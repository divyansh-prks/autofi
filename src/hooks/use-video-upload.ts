import { useState, useCallback } from 'react';

interface UseVideoUploadOptions {
  onSuccess?: (videoId: string) => void;
  onError?: (error: string) => void;
}

export function useVideoUpload(options: UseVideoUploadOptions = {}) {
  const { onSuccess, onError } = options;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(
    async (file: File) => {
      try {
        setUploading(true);
        setUploadProgress(0);

        // Step 1: Get presigned URL
        const presignedResponse = await fetch('/api/upload/presigned', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type
          })
        });
        console.log(presignedResponse);
        if (!presignedResponse.ok) {
          throw new Error('Failed to get upload URL');
        }

        const { presignedUrl, videoUrl } = await presignedResponse.json();
        console.log('aws');
        console.log(presignedUrl);
        console.log(videoUrl);
        setUploadProgress(25);

        // Step 2: Upload file to S3
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type
          },
          mode: 'cors',
          credentials: 'omit'
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        setUploadProgress(75);

        // Step 3: Create video processing job
        const videoResponse = await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            source: 'upload',
            videoUrl,
            originalFilename: file.name,
            title: file.name.replace(/\.[^/.]+$/, '') // Remove extension
          })
        });

        if (!videoResponse.ok) {
          throw new Error('Failed to  video processing');
        }

        const { id } = await videoResponse.json();
        setUploadProgress(100);

        if (onSuccess) {
          onSuccess(id);
        }

        return id;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        if (onError) {
          onError(errorMessage);
        }
        throw error;
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [onSuccess, onError]
  );

  const submitYouTubeUrl = useCallback(
    async (url: string) => {
      try {
        setUploading(true);

        const response = await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            source: 'youtube',
            youtubeUrl: url
          })
        });
        console.log(response.ok);
        if (!response.ok) {
          throw new Error('Failed to start YouTube video processing');
        }

        const { id } = await response.json();

        if (onSuccess) {
          onSuccess(id);
        }

        return id;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to process YouTube URL';
        if (onError) {
          onError(errorMessage);
        }
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [onSuccess, onError]
  );

  return {
    uploading,
    uploadProgress,
    uploadFile,
    submitYouTubeUrl
  };
}
