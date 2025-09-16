import { NextRequest, NextResponse } from 'next/server';
import {
  PutObjectCommand,
  GetObjectCommand,
  S3Client
} from '@aws-sdk/client-s3';
import { getJsonFromS3 } from '@/lib/S3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
  MediaFormat
} from '@aws-sdk/client-transcribe';
import crypto from 'crypto';
import { generateYouTubeMetadata } from '@/lib/metadata';

const transcribe = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Step 1: Upload to S3
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${crypto.randomUUID()}-${file.name}`;

    console.log(`Uploading file to S3: ${process.env.S3_BUCKET}/${key}`);

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type
      })
    );

    const encodedKey = encodeURIComponent(key);
    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodedKey}`;
    console.log(`File uploaded successfully. URL: ${fileUrl}`);

    // Step 2: Start Transcription
    const jobName = `transcribe-${Date.now()}`;
    console.log(`Starting transcription job: ${jobName}`);

    // Determine media format from file type
    let mediaFormat: MediaFormat = MediaFormat.MP4; // default
    if (file.type.includes('webm')) {
      mediaFormat = MediaFormat.WEBM;
    } else if (file.type.includes('wav')) {
      mediaFormat = MediaFormat.WAV;
    } else if (file.type.includes('mp3')) {
      mediaFormat = MediaFormat.MP3;
    } else if (file.type.includes('m4a')) {
      mediaFormat = MediaFormat.M4A;
    } else if (file.type.includes('flac')) {
      mediaFormat = MediaFormat.FLAC;
    } else if (file.type.includes('ogg')) {
      mediaFormat = MediaFormat.OGG;
    } else if (file.type.includes('amr')) {
      mediaFormat = MediaFormat.AMR;
    } else if (file.type.includes('mov') || file.type.includes('avi')) {
      // MOV and AVI are not supported by AWS Transcribe, convert to MP4 first
      console.warn(`Unsupported format ${file.type}, using MP4 as fallback`);
      mediaFormat = MediaFormat.MP4;
    }

    console.log(`Detected media format: ${mediaFormat} (from ${file.type})`);

    await transcribe.send(
      new StartTranscriptionJobCommand({
        TranscriptionJobName: jobName,
        LanguageCode: 'en-US',
        MediaFormat: mediaFormat,
        Media: { MediaFileUri: `s3://${process.env.S3_BUCKET}/${key}` },
        OutputBucketName: process.env.S3_BUCKET,
        OutputKey: `transcripts/${jobName}.json`
      })
    );

    console.log(`Transcription job started successfully`);

    // Step 3: Poll until job finishes
    let transcriptText = '';
    for (let i = 0; i < 30; i++) {
      const { TranscriptionJob } = await transcribe.send(
        new GetTranscriptionJobCommand({ TranscriptionJobName: jobName })
      );

      console.log(
        `Transcription job status: ${TranscriptionJob?.TranscriptionJobStatus} (attempt ${i + 1})`
      );

      if (TranscriptionJob?.TranscriptionJobStatus === 'COMPLETED') {
        const transcriptUri = TranscriptionJob.Transcript?.TranscriptFileUri;
        console.log('TranscriptionJob', TranscriptionJob);
        console.log('transcriptUri', transcriptUri);
        if (transcriptUri) {
          try {
            // Try to fetch from the public URL first
            const resp = await fetch(transcriptUri);

            if (resp.ok) {
              const json = await resp.json();
              transcriptText = json.results.transcripts[0].transcript;
              console.log('json format');
            } else {
              // If public URL fails, try to get from S3 directly
              console.log('Public URL failed, trying S3 direct access...');
              const s3Key = `transcripts/${jobName}.json`;
              const json = await getJsonFromS3<any>(
                process.env.S3_BUCKET!,
                s3Key
              );
              transcriptText = json.results.transcripts[0].transcript;
              console.log('s3 json format');
              console.log(transcriptText);
            }
          } catch (error) {
            console.error('Error fetching transcript:', error);
            return NextResponse.json(
              { error: 'Failed to fetch transcript' },
              { status: 500 }
            );
          }
        }
        break;
      }

      if (TranscriptionJob?.TranscriptionJobStatus === 'FAILED') {
        console.error(
          'Transcription job failed:',
          TranscriptionJob.FailureReason
        );
        return NextResponse.json(
          {
            error: 'Transcription failed',
            details: TranscriptionJob.FailureReason
          },
          { status: 500 }
        );
      }

      await new Promise((r) => setTimeout(r, 5000)); // wait 5s
    }

    if (!transcriptText) {
      return NextResponse.json(
        { error: 'Timeout while waiting for transcript' },
        { status: 500 }
      );
    }

    // Step 4: Generate Metadata
    const metadata = await generateYouTubeMetadata(transcriptText);

    return NextResponse.json({
      transcript: transcriptText,
      metadata
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
