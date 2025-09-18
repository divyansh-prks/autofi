'use client';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoDemoProps {
  src?: string;
  poster?: string;
  className?: string;
}

const VideoDemo = ({
  src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  poster = '/api/placeholder/800/450',
  className = ''
}: VideoDemoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            if (!hasStarted) {
              video.play();
              setIsPlaying(true);
              setHasStarted(true);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Scroll-triggered play
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const isVisible =
        rect.top < window.innerHeight * 0.8 &&
        rect.bottom > window.innerHeight * 0.2;

      if (isVisible && !hasStarted) {
        video.play();
        setIsPlaying(true);
        setHasStarted(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    observer.observe(container);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [hasStarted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  return (
    <div ref={containerRef} className={`group relative ${className}`}>
      <div className='video-container relative overflow-hidden rounded-2xl'>
        <video
          ref={videoRef}
          poster={poster}
          loop
          muted
          playsInline
          className='h-auto w-full object-cover'
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={src} type='video/mp4' />
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Button Overlay */}
        <div className='absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
          <Button
            variant='secondary'
            size='lg'
            onClick={togglePlay}
            className='glossy border-white/20 bg-black/20 backdrop-blur-lg hover:bg-black/40'
          >
            {isPlaying ? (
              <Pause className='h-6 w-6 text-white' />
            ) : (
              <Play className='ml-1 h-6 w-6 text-white' />
            )}
          </Button>
        </div>

        {/* Gradient overlay for better text contrast */}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
      </div>
    </div>
  );
};

export default VideoDemo;
