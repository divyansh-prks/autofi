import OpenAI from 'openai';
import ffmpeg from 'ffmpeg-static';
import { spawn } from 'child_process';
import { createWriteStream, createReadStream, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function downloadFileFromS3(
  uploadVideoKey: string,
  outputPath: string
): Promise<void> {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: uploadVideoKey
  });

  const response = await s3.send(command);

  if (!response.Body) {
    throw new Error('No response body from S3');
  }

  const fileStream = createWriteStream(outputPath);

  return new Promise((resolve, reject) => {
    if (response.Body instanceof Buffer) {
      fileStream.write(response.Body);
      fileStream.end();
      resolve();
    } else if (response.Body && 'pipe' in response.Body) {
      // Handle readable stream
      (response.Body as any).pipe(fileStream);
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    } else {
      reject(new Error('Unsupported response body type'));
    }
  });
}

async function convertVideoToAudio(
  videoPath: string,
  audioPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!ffmpeg) {
      reject(new Error('FFmpeg not available'));
      return;
    }

    const process = spawn(ffmpeg, [
      '-i',
      videoPath,
      '-vn', // No video
      '-acodec',
      'mp3',
      '-ab',
      '128k',
      '-ar',
      '16000', // 16kHz sample rate for better Whisper performance
      '-y', // Overwrite output file
      audioPath
    ]);

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    process.on('error', reject);
  });
}

export async function getTranscriptWithOpenAI(
  uploadVideoKey: string
): Promise<string | null> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const tempDir = tmpdir();
  const videoPath = join(tempDir, `video-${Date.now()}.mp4`);
  const audioPath = join(tempDir, `audio-${Date.now()}.mp3`);

  try {
    // Download video from S3
    await downloadFileFromS3(uploadVideoKey, videoPath);

    // Convert video to audio
    await convertVideoToAudio(videoPath, audioPath);

    // Transcribe audio with OpenAI Whisper
    const audioFile = createReadStream(audioPath);
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      response_format: 'text'
    });
    console.log('Transcription result:', transcription);

    return transcription || null;
  } catch (error) {
    console.error('Error during transcription:', error);
    return null;
  } finally {
    // Clean up temporary files
    try {
      unlinkSync(videoPath);
    } catch (e) {
      // Ignore cleanup errors
    }
    try {
      unlinkSync(audioPath);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}
