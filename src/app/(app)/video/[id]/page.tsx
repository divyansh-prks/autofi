import { VideoDetailClient } from '@/components/video/video-detail-client';
import connectDB from '@/lib/db';
import Video, { IVideo } from '@/lib/models/Video';
import { auth } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';

export default async function VideoDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  try {
    await connectDB();
    const video = (await Video.findOne({
      _id: id,
      userId
    }).lean()) as IVideo | null;

    if (!video) {
      notFound();
    }

    return <VideoDetailClient video={video} />;
  } catch (error) {
    notFound();
  }
}
