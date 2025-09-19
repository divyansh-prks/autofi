import { VideoDetailClient } from '@/components/video/video-detail-client';

export default async function VideoDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <VideoDetailClient id={id} />;
}
