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

        // Step 1: Get presigned URL (5% progress)
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
        if (!presignedResponse.ok) {
          throw new Error('Failed to get upload URL');
        }

        const { presignedUrl, key } = await presignedResponse.json();
        setUploadProgress(5);

        // Step 2: Upload file to S3 with real-time progress (5% to 85%)
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              // Map upload progress from 5% to 85% (80% of total progress)
              const uploadPercent = (event.loaded / event.total) * 80;
              setUploadProgress(5 + uploadPercent);
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setUploadProgress(85);
              resolve();
            } else {
              reject(new Error('Failed to upload file'));
            }
          });

          xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
          });

          xhr.open('PUT', presignedUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });

        // Step 3: Create video processing job (85% to 100%)
        setUploadProgress(90);

        const videoResponse = await fetch('/api/videos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            source: 'upload',
            uploadVideoKey: key,
            uploadFilename: file.name
          })
        });

        if (!videoResponse.ok) {
          throw new Error('Failed to start video processing');
        }

        const { id } = await videoResponse.json();
        setUploadProgress(100);

        // Keep progress at 100% briefly before clearing
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);

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
