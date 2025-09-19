import { useState, useEffect, useCallback } from 'react';

export interface VideoStatus {
  id: string;
  status:
    | 'pending'
    | 'transcribing'
    | 'generating_keywords'
    | 'researching_titles'
    | 'optimizing_content'
    | 'completed'
    | 'failed';
  progress: number;
  title?: string;
  thumbnail?: string;
  source: 'youtube' | 'upload';
  transcript?: string;
  generatedContent?: {
    keywords?: string[];
    seoKeywords?: string[];
    youtubeTitles?: string[];
    suggestedTitles?: string[];
    suggestedDescription?: string;
    tags?: string[];
  };
  errorMessage?: string;
  processingStartedAt?: string;
  processingCompletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseVideoPollingOptions {
  enabled?: boolean;
  interval?: number;
  onComplete?: (video: VideoStatus) => void;
  onError?: (error: string) => void;
}

export function useVideoPolling(
  videoId: string | null,
  options: UseVideoPollingOptions = {}
) {
  const { enabled = true, interval = 2000, onComplete, onError } = options;

  const [video, setVideo] = useState<VideoStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideoStatus = useCallback(async () => {
    if (!videoId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/videos/${videoId}/status`);

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
