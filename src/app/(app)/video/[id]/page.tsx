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

    // Transform the video data to match the expected interface
    const videoData = {
      id: video._id.toString(),
      title: video.title || 'Untitled Video',
      description: video.description || '',
      thumbnail: video.thumbnail || '/placeholder.svg',
      originalTitle: video.title || 'Untitled Video',
      originalDescription: video.description || '',
      suggestedTitles: video.generatedContent?.suggestedTitles || [],
      suggestedDescriptions:
        video.generatedContent?.suggestedDescriptions || [],
      tags: video.generatedContent?.tags || [],
      analytics: video.generatedContent?.analytics || {
        currentViews: '0',
        predictedViews: '0',
        viralityScore: 0,
        seoScore: 0,
        engagementPrediction: '0%',
        competitorAnalysis: 'No analysis available'
      },
      viralityMetrics: video.generatedContent?.viralityMetrics,
      originalMetrics: video.generatedContent?.originalMetrics,
      status: video.status,
      progress: video.progress,
      transcript: video.transcript,
      source: video.source,
      youtubeUrl: video.youtubeUrl,
      videoUrl: video.videoUrl
    };

    return <VideoDetailClient videoData={videoData} />;
  } catch (error) {
    // Error fetching video
    notFound();
  }
}
