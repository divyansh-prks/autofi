import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Video, { VideoSource } from '@/lib/models/Video';
import { auth } from '@clerk/nextjs/server';
import { startVideoProcessing } from '@/lib/video-processor';
import { getYouTubeVideoInfo } from '@/scripts/youtube-scraper';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { source, youtubeUrl, uploadVideoKey, uploadFilename } = body;

    // Validate input based on source
    if (!source || !['youtube', 'upload'].includes(source)) {
      return NextResponse.json(
        { error: 'Valid source (youtube or upload) is required' },
        { status: 400 }
      );
    }

    if (source === 'youtube' && !youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required for YouTube videos' },
        { status: 400 }
      );
    }

    if (source === 'upload' && !uploadVideoKey) {
      return NextResponse.json(
        { error: 'Video URL is required for uploaded videos' },
        { status: 400 }
      );
    }

    // Extract YouTube video ID and fetch video info if it's a YouTube video
    let youtubeVideoId: string | undefined;
    let youtubeThumbnail: string | undefined;
    let youtubeTitle: string | undefined;
    let youtubeDescription: string | undefined;
    let youtubeCurrentViews: string | undefined;

    if (source === 'youtube' && youtubeUrl) {
      const match = youtubeUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?]|$)/);
      if (!match) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL format' },
          { status: 400 }
        );
      }
      youtubeVideoId = match[1];
      youtubeThumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;

      // Scrape video info from YouTube
      try {
        const videoInfo = await getYouTubeVideoInfo(youtubeUrl);
        if (videoInfo) {
          youtubeTitle = videoInfo.title;
          youtubeDescription = videoInfo.description;
          youtubeCurrentViews = videoInfo.viewCount;
        }
      } catch (error) {
        // Log error but continue with video creation
        console.warn('Failed to scrape YouTube video info:', error);
      }
    }

    // Create video document
    const video = new Video({
      userId,
      source: source as VideoSource,
      youtubeUrl: source === 'youtube' ? youtubeUrl : undefined,
      youtubeVideoId,
      youtubeTitle,
      youtubeDescription,
      youtubeThumbnail,
      youtubeCurrentViews,
      uploadVideoKey: source === 'upload' ? uploadVideoKey : undefined,
      uploadFilename: source === 'upload' ? uploadFilename : undefined,
      status: 'pending',
      processingStartedAt: new Date()
    });

    await video.save();

    startVideoProcessing(video._id.toString());

    return NextResponse.json({
      id: video._id.toString(),
      status: video.status,
      message: 'Video processing started'
    });
  } catch (error: any) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to start video processing' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    const videos = await Video.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    return NextResponse.json({
      videos: videos.map((video) => ({
        id: (video._id as object).toString(),
        source: video.source,
        youtubeUrl: video.youtubeUrl,
        youtubeVideoId: video.youtubeVideoId,
        youtubeTitle: video.youtubeTitle,
        youtubeDescription: video.youtubeDescription,
        youtubeThumbnail: video.youtubeThumbnail,
        youtubeCurrentViews: video.youtubeCurrentViews,
        uploadVideoKey: video.uploadVideoKey,
        uploadFilename: video.uploadFilename,
        status: video.status,
        transcript: video.transcript,
        keywords: video.keywords,
        seoKeywords: video.seoKeywords,
        suggestedTitles: video.suggestedTitles,
        suggestedDescriptions: video.suggestedDescriptions,
        suggestedTags: video.suggestedTags,
        youtubeAnalytics: video.youtubeAnalytics,
        createdAt: video.createdAt,
        processingStartedAt: video.processingStartedAt,
        processingCompletedAt: video.processingCompletedAt,
        errorMessage: video.errorMessage
      })),
      page,
      limit
    });
  } catch (error: any) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
