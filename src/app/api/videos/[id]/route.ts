import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Video, { IVideo } from '@/lib/models/Video';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: videoId } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const video = await Video.findOne({
      _id: videoId,
      userId
    }).lean<IVideo>();

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error: any) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}
