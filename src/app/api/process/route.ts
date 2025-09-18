import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import { generateYouTubeMetadata } from '@/lib/metadata';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const s3 = new S3Client({
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

    // Step 1: Upload original video to S3 (optional)
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${crypto.randomUUID()}-${file.name}`;
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

    // Step 2: Save video temporarily to send to local Whisper
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'autofi-'));
    const tmpPath = path.join(tmpDir, file.name);
    await fs.writeFile(tmpPath, buffer);

    // Step 3: Send video to local Whisper server
    const whisperUrl =
      process.env.WHISPER_URL || 'http://localhost:3000/transcribe';
    const form = new FormData();
    const fileBuffer = await fs.readFile(tmpPath);
    // Use File to preserve filename and content type
    const uploadFile = new File([new Uint8Array(fileBuffer)], file.name, {
      type: file.type || 'application/octet-stream'
    });
    form.append('file', uploadFile);

    const response = await fetch(whisperUrl, {
      method: 'POST',
      body: form
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(
        `Whisper server error: ${response.status} ${response.statusText}${errText ? ` - ${errText}` : ''}`
      );
    }

    const data = await response.json();
    const transcriptText = data.transcript;

    // Cleanup temp files
    await fs.rm(tmpDir, { recursive: true, force: true });

    // Step 4: Generate YouTube metadata
    const metadata = await generateYouTubeMetadata(transcriptText);

    return NextResponse.json({
      transcript: transcriptText,
      metadata,
      fileUrl
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
