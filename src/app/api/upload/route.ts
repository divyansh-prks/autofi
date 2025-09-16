import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/S3';
import puppeteer from 'puppeteer';
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

async function scrapeTopThreeVideos(searchUrl: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });

  // Wait for video results to appear
  await page.waitForSelector('ytd-video-renderer', { timeout: 10000 });

  // Extract title and description of the top 3 videos
  const results = await page.evaluate(() => {
    const videos = Array.from(
      document.querySelectorAll('ytd-video-renderer')
    ).slice(0, 10);
    return videos.map((video) => {
      const title =
        video.querySelector('#video-title')?.textContent?.trim() || '';
      const description =
        video.querySelector('#description-text')?.textContent?.trim() ||
        video.querySelector('#video-description')?.textContent?.trim() ||
        '';
      return { title, description };
    });
  });

  await browser.close();
  return results;
}

export async function GET(req: NextRequest) {
  console.time('myTimer');
  const data = await scrapeTopThreeVideos(
    'https://www.youtube.com/results?search_query=ai+engineering&sp=CAMSBggEEAEYAw%253D%253D'
  );
  console.timeEnd('myTimer');
  return NextResponse.json(data);
}

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
