'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface VideosSectionSkeletonProps {
  count?: number;
}

export default function VideosSectionSkeleton({
  count = 6
}: VideosSectionSkeletonProps) {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='bg-muted h-8 w-40 animate-pulse rounded-lg'></div>
        <div className='bg-muted h-6 w-24 animate-pulse rounded-md'></div>
      </div>
      <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: count }).map((_, i) => (
          <Card
            key={i}
            className='group border-border/50 hover:border-border/80 bg-card/50 border p-0 backdrop-blur-sm transition-all duration-200'
          >
            <CardHeader className='p-0'>
              <div className='bg-muted relative aspect-video overflow-hidden rounded-t-lg'>
                <div className='from-muted via-muted/30 to-muted absolute inset-0 animate-pulse bg-gradient-to-br'></div>
                <div className='absolute top-3 right-3'>
                  <div className='bg-muted-foreground/10 h-6 w-16 animate-pulse rounded-full'></div>
                </div>
                <div className='absolute bottom-3 left-3'>
                  <div className='h-5 w-12 animate-pulse rounded bg-black/20'></div>
                </div>
              </div>
            </CardHeader>
            <CardContent className='p-4'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='bg-muted h-4 w-full animate-pulse rounded'></div>
                  <div className='bg-muted h-4 w-4/5 animate-pulse rounded'></div>
                </div>
                <div className='space-y-3'>
                  <div className='bg-muted h-2 w-full animate-pulse rounded-full'></div>
                  <div className='flex items-center justify-between'>
                    <div className='bg-muted h-3 w-20 animate-pulse rounded'></div>
                    <div className='bg-muted h-3 w-16 animate-pulse rounded'></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function EmptyVideosState() {
  return (
    <div className='py-20'>
      <div className='mx-auto max-w-lg text-center'>
        <div className='from-primary/10 to-secondary/10 mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br'>
          <svg
            className='text-primary h-12 w-12'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
            />
          </svg>
        </div>

        <h3 className='mb-3 text-2xl font-bold'>Ready to Go Viral?</h3>
        <p className='text-muted-foreground mb-8 text-lg leading-relaxed'>
          Upload your first video or paste a YouTube URL to get AI-powered SEO
          optimization and boost your content&apos;s visibility.
        </p>

        <div className='grid grid-cols-1 gap-4 text-sm sm:grid-cols-3'>
          <div className='bg-card/50 rounded-lg border p-4 backdrop-blur-sm'>
            <div className='bg-primary/10 mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg'>
              <div className='bg-primary h-2 w-2 rounded-full'></div>
            </div>
            <span className='font-medium'>SEO Analysis</span>
          </div>
          <div className='bg-card/50 rounded-lg border p-4 backdrop-blur-sm'>
            <div className='bg-secondary/10 mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg'>
              <div className='bg-secondary h-2 w-2 rounded-full'></div>
            </div>
            <span className='font-medium'>Title Optimization</span>
          </div>
          <div className='bg-card/50 rounded-lg border p-4 backdrop-blur-sm'>
            <div className='bg-accent/10 mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-lg'>
              <div className='bg-accent h-2 w-2 rounded-full'></div>
            </div>
            <span className='font-medium'>Tag Suggestions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
