import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Video, { IVideo } from '@/lib/models/Video';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const video = (await Video.findOne({
      _id: params.id,
      userId
    }).lean()) as IVideo | null;

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: video._id.toString(),
      status: video.status,
      progress: video.progress,
      title: video.title,
      thumbnail: video.thumbnail,
      source: video.source,
      transcript: video.transcript,
      generatedContent: video.generatedContent,
      errorMessage: video.errorMessage,
      processingStartedAt: video.processingStartedAt,
      processingCompletedAt: video.processingCompletedAt,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt
    });
  } catch (error: any) {
    console.error('Error fetching video status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video status' },
      { status: 500 }
    );
  }
}
