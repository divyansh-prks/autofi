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
    const { source, youtubeUrl, videoUrl, originalFilename, title } = body;

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

    if (source === 'upload' && !videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required for uploaded videos' },
        { status: 400 }
      );
    }

    // Extract YouTube video ID and fetch video info if it's a YouTube video
    let youtubeVideoId: string | undefined;
    let thumbnail: string | undefined;
    let scrapedTitle: string | undefined;
    let scrapedDescription: string | undefined;

    if (source === 'youtube' && youtubeUrl) {
      const match = youtubeUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?]|$)/);
      if (!match) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL format' },
          { status: 400 }
        );
      }
      youtubeVideoId = match[1];
      thumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;

      // Scrape video info from YouTube
      try {
        const videoInfo = await getYouTubeVideoInfo(youtubeUrl);
        if (videoInfo) {
          scrapedTitle = videoInfo.title;
          scrapedDescription = videoInfo.description;
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
      videoUrl: source === 'upload' ? videoUrl : undefined,
      originalFilename: source === 'upload' ? originalFilename : undefined,
      title:
        title ||
        scrapedTitle ||
        (source === 'youtube' ? 'YouTube Video' : originalFilename),
      description: scrapedDescription,
      thumbnail,
      status: 'pending',
      progress: 0,
      processingStartedAt: new Date()
    });

    await video.save();

    startVideoProcessing(video._id.toString());

    return NextResponse.json({
      id: video._id.toString(),
      status: video.status,
      progress: video.progress,
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
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        status: video.status,
        progress: video.progress,
        createdAt: video.createdAt,
        processingCompletedAt: video.processingCompletedAt
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
