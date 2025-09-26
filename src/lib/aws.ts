import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand
} from '@aws-sdk/client-transcribe';

// Initialize AWS Transcribe client
const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    : undefined
});

export async function getTranscriptWithAWSFromS3Url(
  videoHttpsUrl: string
): Promise<string | null> {
  if (!process.env.AWS_REGION) return null;

  // Convert https URL to s3 URI
  // e.g., https://bucket.s3.region.amazonaws.com/videos/abc.mp4 -> s3://bucket/videos/abc.mp4
  const url = new URL(videoHttpsUrl);
  const bucketMatch = url.hostname.match(/^(.*?)\.s3\.[^.]+\.amazonaws\.com$/);
  if (!bucketMatch) return null;
  const bucket = bucketMatch[1];
  const key = decodeURIComponent(url.pathname.replace(/^\//, ''));
  const mediaUri = `s3://${bucket}/${key}`;

  const jobName = `autofi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await transcribeClient.send(
    new StartTranscriptionJobCommand({
      TranscriptionJobName: jobName,
      LanguageCode: 'en-US',
      Media: { MediaFileUri: mediaUri },
      OutputBucketName: bucket
    })
  );

  // Poll for completion
  const startTime = Date.now();
  const timeoutMs = 15 * 60 * 1000; // 15 minutes
  const pollDelayMs = 5000;

  while (true) {
    const res = await transcribeClient.send(
      new GetTranscriptionJobCommand({ TranscriptionJobName: jobName })
    );

    const status = res.TranscriptionJob?.TranscriptionJobStatus;
    if (status === 'COMPLETED') {
      const transcriptFileUri =
        res.TranscriptionJob?.Transcript?.TranscriptFileUri;
      if (!transcriptFileUri) return null;
      const resp = await fetch(transcriptFileUri);
      if (!resp.ok) return null;
      const json = await resp.json();
      const text = json?.results?.transcripts?.[0]?.transcript as
        | string
        | undefined;
      return text || null;
    }
    if (status === 'FAILED') return null;
    if (Date.now() - startTime > timeoutMs) return null;
    await new Promise((r) => setTimeout(r, pollDelayMs));
  }
}
