interface YouTubeTranscriptResponse {
  [key: number]: {
    tracks: Array<{
      transcript: {
        start: number;
        dur: number;
        text: string;
      }[];
    }>;
  };
}

export async function fetchYouTubeTranscript(
  videoId: string
): Promise<string | null> {
  const API_URL = 'https://www.youtube-transcript.io/api/transcripts';

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: 'Basic 68cd43b37a41edb3465cab17',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ids: [videoId] })
  });

  if (!res.ok) {
    throw new Error(`Transcript API failed: ${res.status}`);
  }

  const data: YouTubeTranscriptResponse = await res.json();

  if (!data || !data[0].tracks || data[0].tracks.length === 0) {
    return null;
  }

  const transcript = data[0].tracks[0].transcript
    .map((seg) => seg.text)
    .join(' ');

  return transcript;
}
