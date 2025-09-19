'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Youtube, Loader2, Brain, Play } from 'lucide-react';
import { useVideoUpload } from '@/hooks/use-video-upload';
import { useVideoPolling, type VideoStatus } from '@/hooks/use-video-polling';

export default function Dashboard() {
  const [videos, setVideos] = useState<VideoStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingVideoId, setProcessingVideoId] = useState<string | null>(
    null
  );

  // Video upload hook
  const { uploading, uploadProgress, uploadFile, submitYouTubeUrl } =
    useVideoUpload({
      onSuccess: (videoId) => {
        setProcessingVideoId(videoId);
        fetchVideos(); // Refresh the list
      },
      onError: (error) => {
        alert(error);
      }
    });

  // Video polling hook for the currently processing video
  useVideoPolling(processingVideoId, {
    enabled: !!processingVideoId,
    onComplete: () => {
      setProcessingVideoId(null);
      fetchVideos(); // Refresh the list when processing completes
    },
    onError: () => {
      // Log error and reset processing state
      setProcessingVideoId(null);
    }
  });

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
  }, []);

  const handleYouTubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;

    try {
      await submitYouTubeUrl(youtubeUrl.trim());
      setYoutubeUrl('');
    } catch (error) {
      // Error already handled by hook
    }
  };

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      await uploadFile(selectedFile);
      setSelectedFile(null);
      // Reset the file input
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      // Error already handled by hook
    }
  };

  const getVideoStatus = (video: VideoStatus) => {
    if (
      [
        'pending',
        'transcribing',
        'generating_keywords',
        'researching_titles',
        'optimizing_content'
      ].includes(video.status)
    ) {
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
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <Loader2 className='text-muted-foreground mx-auto mb-4 h-8 w-8 animate-spin' />
            <p>Loading videos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-background min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        {/* URL Input Section */}
        <div className='mx-auto mb-12 max-w-2xl'>
          <div className='mb-8 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-balance'>
              Optimize Your YouTube Content
            </h2>
            <p className='text-muted-foreground text-lg text-pretty'>
              Generate SEO-optimized titles, descriptions, and tags powered by
              AI
            </p>
          </div>

          {/* YouTube URL Form */}
          <Card className='border-secondary/20 from-card to-muted/20 mb-6 border-2 border-dashed bg-gradient-to-br'>
            <CardContent className='p-6'>
              <form onSubmit={handleYouTubeSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <label htmlFor='youtube-url' className='text-sm font-medium'>
                    Paste YouTube URL
                  </label>
                  <div className='flex gap-2'>
                    <Input
                      id='youtube-url'
                      type='url'
                      placeholder='https://www.youtube.com/watch?v=...'
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className='text-base'
                      disabled={uploading}
                    />
                    <Button
                      type='submit'
                      disabled={!youtubeUrl.trim() || uploading}
                      className='whitespace-nowrap'
                    >
                      {uploading ? 'Processing…' : 'Analyze URL'}
                    </Button>
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    We fetch the transcript and generate optimized metadata.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* File Upload Form */}
          <Card className='border-primary/20 from-card to-muted/20 border-2 border-dashed bg-gradient-to-br'>
            <CardContent className='p-6'>
              <form onSubmit={handleFileSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <label htmlFor='video-file' className='text-sm font-medium'>
                    Upload Video File
                  </label>
                  <Input
                    id='video-file'
                    type='file'
                    accept='video/*'
                    onChange={(e) =>
                      setSelectedFile(e.target.files?.[0] || null)
                    }
                    className='text-base'
                    disabled={uploading}
                  />
                  <p className='text-muted-foreground text-xs'>
                    Select a video to upload and transcribe
                  </p>
                </div>
                {uploading && uploadProgress > 0 && (
                  <div className='space-y-2'>
                    <Progress value={uploadProgress} className='bg-muted h-2' />
                    <p className='text-muted-foreground text-sm'>
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
                <Button
                  type='submit'
                  className='w-full gap-2'
                  size='lg'
                  disabled={!selectedFile || uploading}
                >
                  <Brain className='h-5 w-5' />
                  {uploading ? 'Uploading...' : 'Analyze & Optimize'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Video Cards Grid */}
        {videos.length > 0 ? (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-2xl font-semibold'>Your Videos</h3>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setVideos([])}
                className='gap-2 bg-transparent'
              >
                Clear All
              </Button>
            </div>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {videos.map((video) => {
                const status = getVideoStatus(video);
                return (
                  <Card
                    key={video.id}
                    className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-xl ${
                      status === 'completed'
                        ? 'border-accent/20 hover:border-accent/40 hover:scale-[1.02]'
                        : status === 'processing'
                          ? 'border-secondary/20 hover:border-secondary/40'
                          : 'border-primary/20 hover:border-primary/40'
                    } from-card to-card/80 bg-gradient-to-br`}
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
                              <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent' />
                              <p className='text-sm font-medium'>
                                Processing...
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
                    <CardContent className='p-5'>
                      <div className='space-y-3'>
                        <h4 className='line-clamp-2 leading-tight font-semibold text-balance'>
                          {video.title || 'Processing...'}
                        </h4>

                        {status === 'processing' && (
                          <div className='space-y-3'>
                            <Progress
                              value={video.progress}
                              className='bg-muted h-2'
                            />
                            <p className='text-muted-foreground flex items-center gap-2 text-sm'>
                              <Brain className='text-secondary h-4 w-4' />
                              Analyzing content... {video.progress}%
                            </p>
                          </div>
                        )}

                        {status === 'completed' && (
                          <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                              <Badge
                                variant='outline'
                                className='border-accent/30 text-accent gap-1'
                              >
                                <Brain className='h-3 w-3' />
                                AI Analysis Complete
                              </Badge>
                            </div>
                            <p className='text-muted-foreground text-sm'>
                              Click to view optimization suggestions
                            </p>
                          </div>
                        )}

                        {status === 'failed' && (
                          <div className='space-y-2'>
                            <p className='text-destructive text-sm'>
                              {video.errorMessage || 'Processing failed'}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          /* Added empty state message for when no videos exist */
          <div className='py-16 text-center'>
            <div className='mx-auto max-w-md'>
              <div className='bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
                <Youtube className='text-muted-foreground h-10 w-10' />
              </div>
              <h3 className='mb-2 text-xl font-semibold'>
                You don&apos;t have any video yet
              </h3>
              <p className='text-muted-foreground mb-6'>
                Start by adding a YouTube URL above to analyze and optimize your
                content with AI-powered suggestions.
              </p>
              <div className='text-muted-foreground flex items-center justify-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <div className='bg-primary h-2 w-2 rounded-full'></div>
                  <span>SEO Analysis</span>
                </div>
                <div className='flex items-center gap-1'>
                  <div className='bg-secondary h-2 w-2 rounded-full'></div>
                  <span>Title Optimization</span>
                </div>
                <div className='flex items-center gap-1'>
                  <div className='bg-accent h-2 w-2 rounded-full'></div>
                  <span>Tag Suggestions</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
