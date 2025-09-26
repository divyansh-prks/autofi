import { IVideo } from '@/lib/models/Video';
import { useState, useEffect, useCallback } from 'react';

interface UseVideoPollingOptions {
  enabled?: boolean;
  interval?: number;
  onComplete?: (video: IVideo) => void;
  onError?: (error: string) => void;
}

export function useVideoPolling(
  videoId: string | null,
  options: UseVideoPollingOptions = {}
) {
  const { enabled = true, interval = 3000, onComplete, onError } = options;

  const [video, setVideo] = useState<IVideo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoStatus = useCallback(async () => {
    if (!videoId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/videos/${videoId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch video status');
      }

      const data = await response.json();
      setVideo(data);
      setError(null);

      // Call completion callback if video is completed
      if (data.status === 'completed' && onComplete) {
        onComplete(data);
      }

      // Call error callback if video failed
      if (data.status === 'failed' && onError) {
        onError(data.errorMessage || 'Video processing failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [videoId, onComplete, onError]);

  useEffect(() => {
    if (!enabled || !videoId) return;

    // Fetch immediately
    fetchVideoStatus();

    // Set up polling only if video is not completed or failed
    const pollInterval = setInterval(() => {
      if (video?.status === 'completed' || video?.status === 'failed') {
        clearInterval(pollInterval);
        return;
      }
      fetchVideoStatus();
    }, interval);

    return () => clearInterval(pollInterval);
  }, [enabled, videoId, interval, fetchVideoStatus, video?.status]);

  const refetch = useCallback(() => {
    fetchVideoStatus();
  }, [fetchVideoStatus]);

  const isProcessing =
    video?.status && !['completed', 'failed'].includes(video.status);
  const isCompleted = video?.status === 'completed';
  const isFailed = video?.status === 'failed';

  return {
    video,
    loading,
    error,
    refetch,
    isProcessing,
    isCompleted,
    isFailed
  };
}
