import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, TrendingUp, Eye, Clock } from 'lucide-react';
import Image from 'next/image';

const Dashboard = () => {
  return (
    <section className='relative overflow-hidden px-6 py-24'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 items-center gap-16 lg:grid-cols-2'>
          {/* Content */}
          <div className='space-y-8'>
            <div className='space-y-6'>
              <div className='glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium'>
                <TrendingUp className='text-primary h-4 w-4 animate-pulse' />
                <span>Intelligent Dashboard</span>
              </div>

              <h2 className='text-4xl leading-tight font-bold lg:text-5xl'>
                Your YouTube
                <br />
                <span className='gradient-text'>Command Center</span>
              </h2>

              <p className='text-muted-foreground text-xl leading-relaxed'>
                Monitor all your channels, track performance metrics, and get
                AI-powered insights from a single, beautiful dashboard designed
                for creators.
              </p>
            </div>

            {/* Stats Cards */}
            <div className='grid grid-cols-2 gap-4'>
              <Card className='glass border-border/50 p-4'>
                <CardContent className='p-0'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/20 flex h-10 w-10 items-center justify-center rounded-lg'>
                      <Play className='text-primary h-5 w-5' />
                    </div>
                    <div>
                      <div className='text-2xl font-bold'>2.1M</div>
                      <div className='text-muted-foreground text-sm'>
                        Total Views
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='glass border-border/50 p-4'>
                <CardContent className='p-0'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-accent/20 flex h-10 w-10 items-center justify-center rounded-lg'>
                      <Eye className='text-accent h-5 w-5' />
                    </div>
                    <div>
                      <div className='text-2xl font-bold'>45.2K</div>
                      <div className='text-muted-foreground text-sm'>
                        Subscribers
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className='space-y-4'>
              <h3 className='text-xl font-semibold'>Key Features:</h3>
              <ul className='space-y-3'>
                {[
                  'Real-time analytics and performance tracking',
                  'AI-powered content optimization suggestions',
                  'Automated metadata generation and A/B testing',
                  'Competitor analysis and trending topic alerts'
                ].map((feature, index) => (
                  <li key={index} className='flex items-center gap-3'>
                    <div className='bg-primary h-2 w-2 animate-pulse rounded-full' />
                    <span className='text-muted-foreground'>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button variant='ghost' size='lg' className='group'>
              <Clock className='h-5 w-5 transition-transform group-hover:rotate-12' />
              Explore Dashboard
            </Button>
          </div>

          {/* Dashboard Preview Image */}
          <div className='relative'>
            <div className='glass border-primary/20 rounded-2xl border p-6'>
              <Image
                src='/dashboard.jpg'
                alt='YouTube AI Dashboard Preview'
                className='w-full rounded-xl shadow-2xl'
                width={600}
                height={400}
                priority
              />

              {/* Floating elements */}
              <div className='glass border-primary/30 float absolute -top-4 -right-4 rounded-xl border p-3'>
                <TrendingUp className='text-primary h-6 w-6' />
              </div>

              <div
                className='glass border-accent/30 float absolute -bottom-4 -left-4 rounded-xl border p-3'
                style={{ animationDelay: '1s' }}
              >
                <Play className='text-accent h-6 w-6' />
              </div>
            </div>

            {/* Background glow */}
            <div className='from-primary/20 to-accent/20 absolute inset-0 -z-10 scale-110 rounded-2xl bg-gradient-to-r blur-2xl' />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
