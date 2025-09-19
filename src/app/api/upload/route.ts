import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand
} from '@aws-sdk/client-transcribe';
import crypto from 'crypto';
import { generateYouTubeMetadata } from '@/lib/metadata';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const transcribe = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

// Node.js runtime required
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Step 1: Upload original video to S3
    const buffer = Buffer.from(await file.arrayBuffer());
    const id = crypto.randomUUID();
    const key = `${id}-${file.name}`;
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

    // Step 2: Start AWS Transcribe job for the uploaded media
    const transcriptionJobName = `autofi-${id}`;
    await transcribe.send(
      new StartTranscriptionJobCommand({
        TranscriptionJobName: transcriptionJobName,
        Media: {
          MediaFileUri: `s3://${process.env.S3_BUCKET}/${key}`
        },
        IdentifyLanguage: true,
        OutputBucketName: process.env.S3_BUCKET
      })
    );

    // Step 3: Poll for completion
    const startedAt = Date.now();
    const timeoutMs = 5 * 60 * 1000; // up to 5 minutes
    let transcriptFileUri: string | undefined;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const job = await transcribe.send(
        new GetTranscriptionJobCommand({
          TranscriptionJobName: transcriptionJobName
        })
      );
      const status = job.TranscriptionJob?.TranscriptionJobStatus;
      if (status === 'COMPLETED') {
        transcriptFileUri = job.TranscriptionJob?.Transcript?.TranscriptFileUri;
        break;
      }
      if (status === 'FAILED') {
        throw new Error(
          job.TranscriptionJob?.FailureReason || 'Transcription failed'
        );
      }
      if (Date.now() - startedAt > timeoutMs) {
        throw new Error('Transcription timed out');
      }
      await new Promise((r) => setTimeout(r, 3000));
    }

    // Step 4: Fetch transcript JSON and extract text
    let transcriptText = '';
    if (transcriptFileUri) {
      const resp = await fetch(transcriptFileUri);
      if (!resp.ok) throw new Error('Failed to fetch transcript');
      const json = (await resp.json()) as any;
      // Default format from AWS Transcribe
      transcriptText =
        json?.results?.transcripts?.map((t: any) => t.transcript).join('\n') ||
        '';
    }

    // Step 5: Generate YouTube metadata from transcript
    const metadata = await generateYouTubeMetadata(transcriptText);

    return NextResponse.json({
      id,
      key,
      transcript: transcriptText,
      metadata,
      fileUrl
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
