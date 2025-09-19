import { NextRequest, NextResponse } from 'next/server';
import { generateYouTubeMetadata } from '@/lib/metadata';
import { consoleIntegration } from '@sentry/nextjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// helper function to fetch transcript from youtube-transcript.io
async function fetchTranscript(videoId: string) {
  const API_URL = 'https://www.youtube-transcript.io/api/transcripts';

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer 68cd43b37a41edb3465cab17` // 🔑 put token in env
    },
    body: JSON.stringify({ ids: [videoId] })
  });

  if (!res.ok) {
    throw new Error(`Transcript API failed: ${res.status}`);
  }

  const data = await res.json();

  // The API returns transcript segments
  // Adjust this depending on the actual response shape
  if (!data || !data.transcripts || data.transcripts.length === 0) {
    return null;
  }

  const transcript = data.transcripts[0].segments.map((seg: any) => ({
    start: seg.start,
    dur: seg.duration,
    text: seg.text
  }));

  return transcript;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    console.log(url);
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Missing YouTube URL' },
        { status: 400 }
      );
    }

    // extract videoId (11-char ID from url)
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?]|$)/);
    if (!match) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }
    const videoId = match[1];

    const items = await fetchTranscript(videoId);

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No transcript available' },
        { status: 404 }
      );
    }

    const transcriptText = items.map((i: any) => i.text).join(' ');
    const metadata = await generateYouTubeMetadata(transcriptText);

    return NextResponse.json({ transcript: transcriptText, metadata });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
