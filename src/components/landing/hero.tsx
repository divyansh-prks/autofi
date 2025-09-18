import { Button } from '@/components/ui/button';
import { Play, Zap, BarChart3 } from 'lucide-react';
import VideoDemo from '../VideoDemo';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden'>
      {/* Background with overlay */}
      <div className='absolute inset-0 z-0'>
        <Image
          src='/hero-bg.jpg'
          alt='AI automation background'
          className='h-full w-full object-cover'
          fill
        />
        <div className='bg-background/80 absolute inset-0 backdrop-blur-sm' />
      </div>

      {/* Animated background elements */}
      <div className='absolute inset-0 z-10'>
        <div className='bg-primary/20 absolute top-20 left-20 h-32 w-32 animate-pulse rounded-full blur-xl' />
        <div className='bg-accent/20 absolute right-20 bottom-20 h-40 w-40 animate-pulse rounded-full blur-xl delay-500' />
        <div className='bg-secondary/20 absolute top-1/2 left-1/4 h-24 w-24 animate-pulse rounded-full blur-xl delay-1000' />
      </div>

      {/* Content */}
      <div className='relative z-20 mx-auto max-w-6xl px-6 text-center'>
        <div className='space-y-8'>
          {/* Badge */}
          <div className='glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium'>
            <Zap className='text-primary h-4 w-4 animate-pulse' />
            <span>AI-Powered YouTube Automation</span>
          </div>

          {/* Main heading */}
          <h1 className='text-5xl leading-tight font-bold lg:text-7xl'>
            <span className='gradient-text'>Supercharge</span> Your
            <br />
            YouTube <span className='text-primary'>Workflow</span>
          </h1>

          {/* Subheading */}
          <p className='text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed lg:text-2xl'>
            Harness the power of AI to extract metadata, analyze performance,
            and optimize your content automatically. Turn hours of manual work
            into minutes of intelligent automation.
          </p>

          {/* Video Demo */}
          <div className='mx-auto mt-12 w-full max-w-4xl'>
            <VideoDemo className='w-full' poster='/api/placeholder/800/450' />
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row'>
            <Button variant='default' size='lg' className='glossy group'>
              <Play className='h-5 w-5 transition-transform group-hover:scale-110' />
              Start Automating Now
            </Button>
            <Button variant='outline' size='lg' className='glass'>
              <BarChart3 className='h-5 w-5' />
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 gap-8 pt-16 md:grid-cols-3'>
            <div className='text-center'>
              <div className='text-primary text-3xl font-bold lg:text-4xl'>
                50K+
              </div>
              <div className='text-muted-foreground'>Videos Processed</div>
            </div>
            <div className='text-center'>
              <div className='text-primary text-3xl font-bold lg:text-4xl'>
                95%
              </div>
              <div className='text-muted-foreground'>Time Saved</div>
            </div>
            <div className='text-center'>
              <div className='text-primary text-3xl font-bold lg:text-4xl'>
                10K+
              </div>
              <div className='text-muted-foreground'>Happy Creators</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className='float absolute top-32 right-10 z-10'>
        <div className='glass rounded-xl p-4'>
          <Play className='text-primary h-6 w-6' />
        </div>
      </div>
      <div
        className='float absolute bottom-32 left-10 z-10'
        style={{ animationDelay: '2s' }}
      >
        <div className='glass rounded-xl p-4'>
          <BarChart3 className='text-accent h-6 w-6' />
        </div>
      </div>
    </section>
  );
};

export default Hero;
