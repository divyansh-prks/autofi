'use client';

import { useState, useEffect } from 'react';
import VideosSectionSkeleton, { EmptyVideosState } from './videos-skeleton';
import VideoCard from './video-card';
import { IVideo } from '@/lib/models/Video';

interface VideosSectionProps {
  refreshTrigger?: number;
}

export default function VideosSection({ refreshTrigger }: VideosSectionProps) {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos?limit=20');
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos);
      }
    } catch (error) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [refreshTrigger]);

  if (loading) {
    return <VideosSectionSkeleton />;
  }

  if (videos.length === 0) {
    return <EmptyVideosState />;
  }

  return (
    <div className='space-y-8'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex w-full items-center justify-between gap-4'>
          <h3 className='text-2xl font-bold tracking-tight'>Your Videos</h3>
          <p className='text-muted-foreground text-sm'>
            {videos.length} video{videos.length !== 1 ? 's' : ''} •{' '}
            {videos.filter((v) => v.status === 'completed').length} ready
          </p>
        </div>
      </div>
      <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {videos.map((video) => (
          <VideoCard key={video.id} initialVideo={video} />
        ))}
      </div>
    </div>
  );
}
