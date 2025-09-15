import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/S3';
import {
  TranscribeClient,
  StartTranscriptionJobCommand
} from '@aws-sdk/client-transcribe';
import crypto from 'crypto';

const transcribe = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${crypto.randomUUID()}-${file.name}`;

  // Upload to S3
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type
    })
  );

  const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  const jobName = `transcribe-${Date.now()}`;

  // Start transcription
  await transcribe.send(
    new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      LanguageCode: 'en-US',
      MediaFormat: 'mp4', // change if video format is different
      Media: { MediaFileUri: fileUrl },
      OutputBucketName: process.env.S3_BUCKET
    })
  );

  return NextResponse.json({ jobName });
}
