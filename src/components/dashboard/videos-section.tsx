'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Play } from 'lucide-react';
import { type VideoStatus } from '@/hooks/use-video-polling';
import VideosSectionSkeleton, { EmptyVideosState } from './videos-skeleton';

interface VideosSectionProps {
  refreshTrigger?: number;
}

export default function VideosSection({ refreshTrigger }: VideosSectionProps) {
  const [videos, setVideos] = useState<VideoStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulatedProgress, setSimulatedProgress] = useState<{
    [key: string]: number;
  }>({});

  // More dynamic progress increment with realistic curves
  const getProgressIncrement = (
    currentProgress: number,
    videoId: string
  ): number => {
    // Use video ID to create consistent but varied behavior per video
    const seed = videoId
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const randomFactor = (Math.sin(seed) + 1) / 2; // 0-1 based on video ID

    // Early stage: Fast progress (0-40%)
    if (currentProgress < 15) {
      return Math.random() * 2 + 1.5; // 1.5-3.5% increment
    }
    if (currentProgress < 30) {
      return Math.random() * 1.5 + 1; // 1-2.5% increment
    }
    if (currentProgress < 40) {
      return Math.random() * 1 + 0.8; // 0.8-1.8% increment
    }

    // Middle stage: Moderate progress (40-70%)
    if (currentProgress < 55) {
      return Math.random() * 0.8 + 0.6; // 0.6-1.4% increment
    }
    if (currentProgress < 70) {
      return Math.random() * 0.6 + 0.4; // 0.4-1.0% increment
    }

    // Later stage: Slower but steady (70-88%)
    if (currentProgress < 78) {
      return Math.random() * 0.5 + 0.3; // 0.3-0.8% increment
    }
    if (currentProgress < 85) {
      return Math.random() * 0.4 + 0.2; // 0.2-0.6% increment
    }
    if (currentProgress < 88) {
      return Math.random() * 0.3 + 0.15; // 0.15-0.45% increment
    }

    // Final stage: Very slow but continuous (88-97%)
    if (currentProgress < 92) {
      return Math.random() * 0.2 + 0.1; // 0.1-0.3% increment
    }
    if (currentProgress < 97) {
      return Math.random() * 0.15 + 0.05 * randomFactor; // 0.05-0.2% increment
    }

    return 0; // Stop at 97%
  };

  // Effect to initialize progress for new processing videos
  useEffect(() => {
    const newProcessingVideos = videos.filter(
      (video) => video.status === 'pending'
    );

    setSimulatedProgress((prev) => {
      const updated = { ...prev };
      newProcessingVideos.forEach((video) => {
        if (!(video.id in updated)) {
          updated[video.id] = 0; // Start from 0% for new videos
        }
      });
      return updated;
    });
  }, [videos]);

  // Effect to handle progress simulation for all videos with progress
  useEffect(() => {
    const videosWithProgress = Object.keys(simulatedProgress);

    if (videosWithProgress.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setSimulatedProgress((prev) => {
        const updated = { ...prev };

        videosWithProgress.forEach((videoId) => {
          const video = videos.find((v) => v.id === videoId);
          if (!video) return;

          const currentProgress = updated[videoId] || 0;
          const isCompleted =
            video.status === 'completed' || video.status === 'failed';

          // Don't increment if already completed/failed - let the completion effect handle it
          if (isCompleted) {
            return;
          }

          const increment = getProgressIncrement(currentProgress, videoId);
          updated[videoId] = Math.min(currentProgress + increment, 97);
        });

        return updated;
      });
    }, 200); // Update every 200ms for smoother progress

    return () => clearInterval(interval);
  }, [simulatedProgress, videos]);

  // Handle completed/failed videos - ensure they reach 100% before cleanup
  useEffect(() => {
    videos.forEach((video) => {
      if (
        (video.status === 'completed' || video.status === 'failed') &&
        video.id in simulatedProgress
      ) {
        const currentProgress = simulatedProgress[video.id];
        if (currentProgress < 100) {
          // Force progress to 100% immediately for completed/failed videos
          setSimulatedProgress((prev) => ({
            ...prev,
            [video.id]: 100
          }));

          // Clean up after showing 100% for 2 seconds
          setTimeout(() => {
            setSimulatedProgress((current) => {
              const newState = { ...current };
              delete newState[video.id];
              return newState;
            });
          }, 2000);
        }
      }
    });
  }, [videos, simulatedProgress]);

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

  // Poll processing videos every 3 seconds
  useEffect(() => {
    const processingVideos = videos.filter(
      (video) => video.status === 'pending'
    );

    if (processingVideos.length === 0) {
      return;
    }

    const pollInterval = setInterval(() => {
      fetchVideos();
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [videos]);

  const getVideoStatus = (video: VideoStatus) => {
    if (video.status === 'pending') {
      return 'processing';
    }
    return video.status;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <Badge className='bg-secondary text-secondary-foreground border-0'>
            Processing
          </Badge>
        );
      case 'completed':
        return (
          <Badge className='bg-accent text-accent-foreground border-0'>
            Ready
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant='destructive' className='border-0'>
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

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
        {videos.map((video) => {
          const status = getVideoStatus(video);
          const isProcessing = status === 'processing';
          const hasSimulatedProgress = video.id in simulatedProgress;
          const displayProgress =
            isProcessing || hasSimulatedProgress
              ? Math.round(simulatedProgress[video.id] || 0)
              : Math.round(video.progress || 0);
          return (
            <Card
              key={video.id}
              className={`group relative gap-0 overflow-hidden p-0 transition-all duration-300 hover:shadow-lg ${
                status === 'completed'
                  ? 'border-border/50 hover:border-accent/50 bg-card/80 cursor-pointer backdrop-blur-sm hover:-translate-y-1'
                  : status === 'processing'
                    ? 'border-secondary/30 bg-card/60 backdrop-blur-sm'
                    : 'border-destructive/30 bg-card/60 backdrop-blur-sm'
              }`}
              onClick={() => {
                if (status === 'completed') {
                  window.location.href = `/video/${video.id}`;
                }
              }}
            >
              <CardHeader className='p-0'>
                <div className='bg-muted relative aspect-video overflow-hidden rounded-t-lg'>
                  <Image
                    src={video.thumbnail || '/placeholder.svg'}
                    alt={video.title || 'Video thumbnail'}
                    className='h-full w-full object-cover'
                    width={400}
                    height={225}
                  />
                  {status === 'processing' && (
                    <div className='from-secondary/80 to-secondary/60 absolute inset-0 flex items-center justify-center bg-gradient-to-br'>
                      <div className='text-center text-white'>
                        <div className='mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-3 border-white/30 border-t-white' />
                        <p className='animate-pulse text-sm font-medium'>
                          {displayProgress < 20
                            ? 'Initializing...'
                            : displayProgress < 50
                              ? 'Analyzing...'
                              : displayProgress < 80
                                ? 'Processing...'
                                : 'Finalizing...'}
                        </p>
                      </div>
                    </div>
                  )}
                  {status === 'completed' && (
                    <div className='from-accent/0 to-accent/20 hover:from-accent/20 hover:to-accent/40 absolute inset-0 flex items-center justify-center bg-gradient-to-br opacity-0 transition-all duration-300 hover:opacity-100'>
                      <Play className='h-12 w-12 text-white drop-shadow-lg' />
                    </div>
                  )}
                  <div className='absolute top-3 right-3'>
                    {getStatusBadge(status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className='p-4'>
                <div className='space-y-4'>
                  <h4 className='group-hover:text-foreground line-clamp-2 text-sm leading-tight font-semibold text-balance transition-colors'>
                    {video.title || 'Processing...'}
                  </h4>

                  {(status === 'processing' ||
                    (video.id in simulatedProgress &&
                      simulatedProgress[video.id] < 100)) && (
                    <div className='space-y-3'>
                      <div className='relative'>
                        <div className='bg-muted relative h-3 w-full overflow-hidden rounded-full'>
                          <div
                            className={`h-full transition-all duration-500 ease-out ${
                              displayProgress < 30
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                : displayProgress < 70
                                  ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                                  : displayProgress < 95
                                    ? 'bg-gradient-to-r from-green-400 to-green-500'
                                    : 'from-primary bg-gradient-to-r to-red-600'
                            } ${displayProgress > 0 ? 'shadow-sm' : ''}`}
                            style={{ width: `${displayProgress}%` }}
                          />
                        </div>
                        {/* Animated shimmer effect */}
                        <div className='animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent' />
                      </div>
                      <div className='flex items-center justify-between'>
                        <p className='text-muted-foreground flex items-center gap-2 text-sm'>
                          <Brain
                            className={`h-4 w-4 transition-colors duration-300 ${displayProgress > 0 ? 'text-primary animate-pulse' : 'text-secondary'}`}
                          />
                          <span className='transition-all duration-300'>
                            {displayProgress < 20
                              ? 'Initializing analysis...'
                              : displayProgress < 40
                                ? 'Extracting transcript...'
                                : displayProgress < 60
                                  ? 'Analyzing content...'
                                  : displayProgress < 80
                                    ? 'Generating insights...'
                                    : displayProgress < 95
                                      ? 'Optimizing metadata...'
                                      : 'Finalizing results...'}
                          </span>
                        </p>
                        <span className='text-primary text-sm font-medium tabular-nums'>
                          {displayProgress}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
