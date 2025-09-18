import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Bot,
  Brain,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Video,
  BarChart3
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

gsap.registerPlugin(ScrollTrigger);

const GSAPFeatures = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      icon: Bot,
      title: 'AI Metadata Extraction',
      description:
        'Automatically extract and optimize titles, descriptions, tags, and thumbnails using advanced AI algorithms.',
      highlight: 'Smart Analysis'
    },
    {
      icon: Video,
      title: 'Auto Video Processing',
      description:
        'Process and analyze your videos automatically with AI-powered content recognition and optimization.',
      highlight: 'Video Intelligence'
    },
    {
      icon: Brain,
      title: 'Intelligent Analytics',
      description:
        'Get deep insights into your video performance with AI-powered analytics and predictive recommendations.',
      highlight: 'Performance Prediction'
    },
    {
      icon: Zap,
      title: 'Workflow Automation',
      description:
        'Streamline your entire YouTube workflow from upload to optimization with intelligent automation.',
      highlight: 'End-to-End Automation'
    },
    {
      icon: Target,
      title: 'SEO Optimization',
      description:
        'Maximize your reach with AI-driven SEO suggestions and keyword optimization for better discoverability.',
      highlight: 'Ranking Boost'
    },
    {
      icon: TrendingUp,
      title: 'Growth Insights',
      description:
        'Identify trending topics and optimal posting times to accelerate your channel growth.',
      highlight: 'Strategic Growth'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description:
        'Monitor your content performance in real-time with comprehensive analytics dashboard.',
      highlight: 'Live Monitoring'
    },
    {
      icon: Shield,
      title: 'Content Protection',
      description:
        'Monitor your content across platforms and protect against unauthorized usage with AI detection.',
      highlight: 'Brand Security'
    }
  ];

  useEffect(() => {
    if (!containerRef.current || !featuresRef.current) return;

    const cards = featuresRef.current.children;

    // Set initial state
    gsap.set(cards, {
      x: -200,
      opacity: 0,
      scale: 0.8
    });

    // Create timeline for staggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
        onUpdate: (self) => {
          // Progressive reveal based on scroll progress
          const progress = self.progress;
          const visibleCount = Math.floor(progress * cards.length);

          Array.from(cards).forEach((card, index) => {
            if (index <= visibleCount) {
              gsap.to(card, {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out'
              });
            }
          });
        }
      }
    });

    // Continuous horizontal scroll animation
    gsap.to(featuresRef.current, {
      x: '-50%',
      duration: 20,
      repeat: -1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className='relative overflow-hidden py-24'>
      <div className='mx-auto mb-16 max-w-7xl px-6'>
        <div className='text-center'>
          <div className='glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium'>
            <Zap className='text-primary h-4 w-4 animate-pulse' />
            <span>Powerful Features</span>
          </div>

          <h2 className='mb-6 text-4xl font-bold lg:text-5xl'>
            Everything You Need to
            <br />
            <span className='gradient-text'>Dominate YouTube</span>
          </h2>

          <p className='text-muted-foreground mx-auto max-w-3xl text-xl'>
            Our comprehensive AI suite handles every aspect of your YouTube
            presence, from content creation to performance optimization.
          </p>
        </div>
      </div>

      {/* Horizontally scrolling features */}
      <div className='relative'>
        <div
          ref={featuresRef}
          className='flex w-max gap-8'
          style={{ width: `${features.length * 400}px` }}
        >
          {features.concat(features).map((feature, index) => (
            <Card
              key={`${feature.title}-${index}`}
              className='glossy border-border/50 hover:border-primary/50 group min-w-[380px] flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-xl'
            >
              <CardHeader className='space-y-4'>
                <div className='from-primary/20 to-accent/20 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110'>
                  <feature.icon className='text-primary h-6 w-6' />
                </div>

                <div>
                  <div className='text-primary/80 mb-2 text-xs font-semibold tracking-wide uppercase'>
                    {feature.highlight}
                  </div>
                  <CardTitle className='group-hover:text-primary text-xl transition-colors'>
                    {feature.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <CardDescription className='text-base leading-relaxed'>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gradient overlays for smooth edges */}
        <div className='from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-32 bg-gradient-to-r to-transparent' />
        <div className='from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-32 bg-gradient-to-l to-transparent' />
      </div>

      {/* Background decoration */}
      <div className='from-primary/5 to-accent/5 absolute top-1/2 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r blur-3xl' />
    </section>
  );
};

export default GSAPFeatures;
