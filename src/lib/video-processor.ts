import connectDB from '@/lib/db';
import Video, { VideoStatus } from '@/lib/models/Video';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Types for transcript API
interface ProcessedTranscriptSegment {
  start: number;
  dur: number;
  text: string;
}

interface YouTubeTranscriptResponse {
  [key: number]: {
    tracks: Array<{
      transcript: ProcessedTranscriptSegment[];
    }>;
  };
}

// Helper function to update video status
async function updateVideoStatus(
  videoId: string,
  status: VideoStatus,
  progress: number,
  data: any = {}
) {
  await connectDB();

  const updateData: any = {
    status,
    progress,
    ...data
  };

  if (status === 'completed') {
    updateData.processingCompletedAt = new Date();
  }

  if (status === 'failed' && data.errorMessage) {
    updateData.errorMessage = data.errorMessage;
  }

  await Video.findByIdAndUpdate(videoId, updateData);
}

// Fetch transcript from youtube-transcript.io
async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  try {
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
  } catch (error) {
    // Silent fail for transcript fetching
    return null;
  }
}

// Upload video to Gemini and get transcript
async function getGeminiTranscript(videoUrl: string): Promise<string | null> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // For file uploads, we need to handle the video file differently
    // This is a simplified approach - in production you might want to use Gemini's file API
    const prompt = `
Please transcribe this video. Provide only the spoken content as text, without any additional commentary or formatting.
Video URL: ${videoUrl}

Note: If you cannot access the video directly, please respond with "TRANSCRIPTION_FAILED"
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (text.includes('TRANSCRIPTION_FAILED') || text.length < 10) {
      return null;
    }

    return text;
  } catch (error) {
    // Silent fail for Gemini transcript
    return null;
  }
}

// Extract keywords from transcript
async function extractKeywords(transcript: string): Promise<string[]> {
  try {
    // Use existing keyword extraction logic
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/extract-keywords`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: transcript })
      }
    );

    if (!response.ok) {
      throw new Error('Keyword extraction failed');
    }

    const data = await response.json();
    return data.keywords || [];
  } catch (error) {
    // Silent fail for keyword extraction
    return [];
  }
}

// Generate SEO keywords
async function generateSEOKeywords(
  transcript: string,
  keywords: string[]
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Based on this transcript and extracted keywords, generate 10-15 SEO-optimized keywords for YouTube:

Transcript: ${transcript.substring(0, 1000)}...
Extracted Keywords: ${keywords.join(', ')}

Generate keywords that are:
1. Highly relevant to the content
2. Search-friendly for YouTube
3. Include both broad and specific terms
4. Mix of short and long-tail keywords

Return only the keywords as a comma-separated list, no other text.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
  } catch (error) {
    // Silent fail for SEO keyword generation
    return [];
  }
}

// Research YouTube titles
async function researchYouTubeTitles(keywords: string[]): Promise<string[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/search-titles`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keywords: keywords.slice(0, 5) })
      }
    );

    if (!response.ok) {
      throw new Error('Title research failed');
    }

    const data = await response.json();
    return data.titles || [];
  } catch (error) {
    // Silent fail for title research
    return [];
  }
}

// Generate optimized content
async function generateOptimizedContent(
  transcript: string,
  keywords: string[],
  youtubeTitles: string[]
): Promise<{
  suggestedTitles: string[];
  suggestedDescription: string;
  tags: string[];
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-optimized-content`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: transcript,
          keywords,
          trendingTitles: youtubeTitles
        })
      }
    );

    if (!response.ok) {
      throw new Error('Content optimization failed');
    }

    const data = await response.json();
    return {
      suggestedTitles: data.titles || [],
      suggestedDescription: data.description || '',
      tags: data.tags || []
    };
  } catch (error) {
    // Silent fail for content optimization
    return {
      suggestedTitles: [],
      suggestedDescription: '',
      tags: []
    };
  }
}

// Main processing function
export async function processVideo(videoId: string) {
  try {
    await connectDB();

    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    // Step 1: Get transcript
    await updateVideoStatus(videoId, 'transcribing', 10);

    let transcript: string | null = null;

    if (video.source === 'youtube' && video.youtubeVideoId) {
      // Try youtube-transcript.io first
      transcript = await fetchYouTubeTranscript(video.youtubeVideoId);

      // If that fails, try Gemini
      if (!transcript && video.youtubeUrl) {
        transcript = await getGeminiTranscript(video.youtubeUrl);
      }
    } else if (video.source === 'upload' && video.videoUrl) {
      // For uploaded videos, use Gemini
      transcript = await getGeminiTranscript(video.videoUrl);
    }

    if (!transcript) {
      throw new Error('Failed to generate transcript');
    }

    await updateVideoStatus(videoId, 'generating_keywords', 30, { transcript });

    // Step 2: Extract keywords
    const keywords = await extractKeywords(transcript);
    await updateVideoStatus(videoId, 'generating_keywords', 50, {
      transcript,
      'generatedContent.keywords': keywords
    });

    // Step 3: Generate SEO keywords
    const seoKeywords = await generateSEOKeywords(transcript, keywords);
    await updateVideoStatus(videoId, 'researching_titles', 60, {
      transcript,
      'generatedContent.keywords': keywords,
      'generatedContent.seoKeywords': seoKeywords
    });

    // Step 4: Research YouTube titles
    const youtubeTitles = await researchYouTubeTitles([
      ...keywords,
      ...seoKeywords
    ]);
    await updateVideoStatus(videoId, 'optimizing_content', 80, {
      transcript,
      'generatedContent.keywords': keywords,
      'generatedContent.seoKeywords': seoKeywords,
      'generatedContent.youtubeTitles': youtubeTitles
    });

    // Step 5: Generate optimized content
    const optimizedContent = await generateOptimizedContent(
      transcript,
      keywords,
      youtubeTitles
    );

    // Complete processing
    await updateVideoStatus(videoId, 'completed', 100, {
      transcript,
      generatedContent: {
        keywords,
        seoKeywords,
        youtubeTitles,
        ...optimizedContent
      }
    });
  } catch (error: any) {
    // Update video status to failed
    await updateVideoStatus(videoId, 'failed', 0, {
      errorMessage: error.message
    });
  }
}

// Function to start processing (can be called from API)
export async function startVideoProcessing(videoId: string) {
  // In a production environment, you'd want to use a job queue like Bull/BullMQ
  // For now, we'll process immediately in the background
  setTimeout(() => {
    processVideo(videoId).catch(() => {
      // Error already handled in processVideo
    });
  }, 100);
}
