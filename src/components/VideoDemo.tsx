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
  src = 'https://www.youtube.com/watch?v=mOWP7G5sn_g',
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

  return (
    <div ref={containerRef} className={`group relative ${className}`}>
      <div className='video-container relative overflow-hidden rounded-2xl'>
        <div className='relative overflow-hidden rounded-2xl'>
          <iframe
            width='100%'
            height='450'
            src='https://www.youtube.com/embed/mOWP7G5sn_g'
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='aspect-video h-[450px] w-full rounded-2xl'
          />
        </div>

        {/* <source src={src} type='video/mp4' />
          Your browser does not support the video tag. */}

        {/* Play/Pause Button Overlay */}
      </div>
    </div>
  );
};

export default VideoDemo;
