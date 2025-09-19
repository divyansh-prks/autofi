import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Video, { VideoSource } from '@/lib/models/Video';
import { auth } from '@clerk/nextjs/server';
import { startVideoProcessing } from '@/lib/video-processor';

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

    // Extract YouTube video ID if it's a YouTube video
    let youtubeVideoId: string | undefined;
    let thumbnail: string | undefined;

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
        title || (source === 'youtube' ? 'YouTube Video' : originalFilename),
      thumbnail,
      status: 'pending',
      progress: 0,
      processingStartedAt: new Date()
    });

    await video.save();

    // Start background processing
    await startVideoProcessing(video._id.toString());

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
        id: video._id.toString(),
        source: video.source,
        title: video.title,
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
