import { NextRequest, NextResponse } from 'next/server';
import {
  TranscribeClient,
  GetTranscriptionJobCommand
} from '@aws-sdk/client-transcribe';

const transcribe = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function GET(req: NextRequest) {
  const jobName = req.nextUrl.searchParams.get('jobName');
  if (!jobName) {
    return NextResponse.json({ error: 'Missing jobName' }, { status: 400 });
  }

  const { TranscriptionJob } = await transcribe.send(
    new GetTranscriptionJobCommand({ TranscriptionJobName: jobName })
  );

  if (!TranscriptionJob) {
    return NextResponse.json({ status: 'NOT_FOUND' }, { status: 404 });
  }

  if (TranscriptionJob.TranscriptionJobStatus === 'COMPLETED') {
    const transcriptUri = TranscriptionJob.Transcript?.TranscriptFileUri;
    if (transcriptUri) {
      const res = await fetch(transcriptUri);
      const json = await res.json();
      const text = json.results.transcripts[0].transcript;
      return NextResponse.json({ status: 'COMPLETED', transcript: text });
    }
  }

  return NextResponse.json({ status: TranscriptionJob.TranscriptionJobStatus });
}
