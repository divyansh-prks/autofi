import connectDB from '@/lib/db';
import Video, { IVideo } from '@/lib/models/Video';
import { searchTrendyTitles } from '@/scripts/youtube-search-titles';
import { getTranscriptWithOpenAI } from './openai';
import { fetchYouTubeTranscript } from '@/scripts/youtube-transcript';
import {
  extractKeywords,
  generateViralityAnalytics,
  generateYoutubeSuggestedContent,
  getGeminiTranscriptFromUrl
} from './gemini';
import { generateSEOKeywords } from './seo';

async function researchYouTubeTrendyTitles(
  keywords: string[]
): Promise<string[]> {
  const trendyTitles = await searchTrendyTitles(keywords);
  return trendyTitles.slice(0, 20);
}

// Main processing function
export async function startVideoProcessing(videoId: string) {
  try {
    await connectDB();

    const video = await Video.findById(videoId).lean<IVideo>();
    if (!video) {
      throw new Error('Video not found');
    }

    // Get transcript
    let transcript: string | null = null;

    if (video.source === 'youtube' && video.youtubeVideoId) {
      // Try youtube-transcript.io first
      transcript = await fetchYouTubeTranscript(video.youtubeVideoId);

      // If that fails, try Gemini
      if (!transcript && video.youtubeUrl) {
        transcript = await getGeminiTranscriptFromUrl(video.youtubeUrl);
      }
    } else if (video.source === 'upload' && video.uploadVideoKey) {
      // For uploaded videos stored in S3
      transcript = await getTranscriptWithOpenAI(video.uploadVideoKey);
    }

    if (!transcript) {
      throw new Error('Failed to generate transcript');
    }

    transcript = transcript.trim().slice(0, 30000); // Limit to first 30k chars

    // Extract keywords
    const keywords = await extractKeywords(transcript);

    // Generate SEO keywords
    const seoKeywords = await generateSEOKeywords(keywords);

    // Research YouTube trendy titles
    const youtubeTrendyTitles = await researchYouTubeTrendyTitles(seoKeywords);

    // Generate suggested titles, descriptions, and tags
    const youtubeSuggestions = await generateYoutubeSuggestedContent(
      transcript,
      youtubeTrendyTitles
    );

    // Generate virality and SEO analytics
    const youtubeAnalytics = await generateViralityAnalytics(
      transcript,
      youtubeSuggestions.suggestedTitles,
      video.youtubeTitle,
      video.youtubeCurrentViews
    );

    // Update video document with results
    await Video.findByIdAndUpdate(videoId, {
      status: 'completed',
      transcript,
      keywords,
      seoKeywords,
      suggestedTitles: youtubeSuggestions.suggestedTitles,
      suggestedDescriptions: youtubeSuggestions.suggestedDescriptions,
      suggestedTags: youtubeSuggestions.suggestedTags,
      youtubeAnalytics,
      processingCompletedAt: new Date()
    });

    console.log(
      'Video processing completed successfully for videoId:',
      videoId
    );
  } catch (error: any) {
    console.error('Video processing failed for videoId:', videoId, error);
    await Video.findByIdAndUpdate(videoId, {
      status: 'failed',
      errorMessage: error.message
    });
  }
}
