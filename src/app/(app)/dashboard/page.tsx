'use client';
import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Youtube, Brain } from 'lucide-react';
import type { OptimizationSuggestions } from '@/lib/ai-optimizer';
import { useRouter } from 'next/navigation';
interface VideoData {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  status: 'processing' | 'completed' | 'error';
  progress: number;
  suggestions?: OptimizationSuggestions;
}

export default function Dashboard() {
  const router = useRouter();

  const [videos, setVideos] = useState<VideoData[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please choose a video file');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      const newId = data.id || data.key || data.fileUrl;
      const newVideo: VideoData = {
        id: newId,
        url: data.fileUrl,
        title: 'Transcribing...',
        thumbnail: '/placeholder.svg',
        status: 'processing',
        progress: 0
      };
      setVideos((prev) => [newVideo, ...prev]);
      router.push(`/video/${encodeURIComponent(newId)}`);
    } catch (err) {
      alert((err as Error).message);
    }
  };

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

          <Card className='border-primary/20 from-card to-muted/20 border-2 border-dashed bg-gradient-to-br'>
            <CardContent className='p-6'>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <label htmlFor='video-file' className='text-sm font-medium'>
                    Upload Video File
                  </label>
                  <Input
                    id='video-file'
                    type='file'
                    accept='video/*'
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className='text-base'
                  />
                  <p className='text-muted-foreground text-xs'>
                    Select a video to upload and transcribe
                  </p>
                </div>
                <Button type='submit' className='w-full gap-2' size='lg'>
                  <Brain className='h-5 w-5' />
                  Analyze & Optimize
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
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-xl ${
                    video.status === 'completed'
                      ? 'border-accent/20 hover:border-accent/40 hover:scale-[1.02]'
                      : video.status === 'processing'
                        ? 'border-secondary/20 hover:border-secondary/40'
                        : 'border-primary/20 hover:border-primary/40'
                  } from-card to-card/80 bg-gradient-to-br`}
                  onClick={() => {
                    if (video.status === 'completed') {
                      window.location.href = `/video/${video.id}`;
                    }
                  }}
                >
                  <CardHeader className='p-0'>
                    <div className='bg-muted relative aspect-video overflow-hidden rounded-t-lg'>
                      <Image
                        src={video.thumbnail || '/placeholder.svg'}
                        alt={video.title}
                        className='h-full w-full object-cover'
                        width={400}
                        height={225}
                      />
                      {video.status === 'processing' && (
                        <div className='from-secondary/80 to-secondary/60 absolute inset-0 flex items-center justify-center bg-gradient-to-br'>
                          <div className='text-center text-white'>
                            <div className='mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent' />
                            <p className='text-sm font-medium'>Processing...</p>
                          </div>
                        </div>
                      )}
                      {video.status === 'completed' && (
                        <div className='from-accent/0 to-accent/20 hover:from-accent/20 hover:to-accent/40 absolute inset-0 flex items-center justify-center bg-gradient-to-br opacity-0 transition-all duration-300 hover:opacity-100'>
                          <Play className='h-12 w-12 text-white drop-shadow-lg' />
                        </div>
                      )}
                      <div className='absolute top-3 right-3'>
                        {video.status === 'processing' && (
                          <Badge className='bg-secondary text-secondary-foreground border-0'>
                            Processing
                          </Badge>
                        )}
                        {video.status === 'completed' && (
                          <Badge className='bg-accent text-accent-foreground border-0'>
                            Ready
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='p-5'>
                    <div className='space-y-3'>
                      <h4 className='line-clamp-2 leading-tight font-semibold text-balance'>
                        {video.title}
                      </h4>

                      {video.status === 'processing' && (
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

                      {video.status === 'completed' && (
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
                    </div>
                  </CardContent>
                </Card>
              ))}
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
