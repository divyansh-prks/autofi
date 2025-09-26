'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Youtube, Loader2, Upload, Video, CloudUpload } from 'lucide-react';
import { useVideoUpload } from '@/hooks/use-video-upload';

interface UploadSectionProps {
  onVideoAdded?: () => void;
}

export default function UploadSection({ onVideoAdded }: UploadSectionProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video upload hook
  const { uploading, uploadProgress, uploadFile, submitYouTubeUrl } =
    useVideoUpload({
      onSuccess: () => {
        onVideoAdded?.(); // Notify parent to refresh videos list
      },
      onError: (error) => {
        alert(error);
      }
    });

  const handleYouTubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;

    try {
      await submitYouTubeUrl(youtubeUrl.trim());
      setYoutubeUrl('');
    } catch (error) {
      // Error already handled by hook
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    try {
      await uploadFile(file);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Error already handled by hook
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('video/')) {
      setSelectedFile(files[0]);
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='mx-auto mb-16 max-w-4xl'>
      {/* Hero Section */}
      <div className='mb-12 text-center'>
        <h1 className='text-foreground mb-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
          Transform Your Content Into{' '}
          <span className='from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent'>
            Viral Hits
          </span>
        </h1>
        <p className='text-muted-foreground mx-auto mb-6 max-w-2xl text-base sm:text-lg'>
          Generate SEO-optimized titles, descriptions, and tags that boost your
          YouTube visibility and engagement with advanced AI analytics.
        </p>
      </div>

      {/* Upload Interface */}
      <div className='mx-auto mb-8 max-w-2xl'>
        <Card className='border-primary/50 bg-card/50 border-2 border-dashed p-0 shadow-lg backdrop-blur-sm'>
          <CardContent className='p-6'>
            <Tabs defaultValue='youtube' className='w-full'>
              <TabsList className='mb-6 grid h-10 w-full grid-cols-2'>
                <TabsTrigger
                  value='youtube'
                  className='flex items-center gap-2'
                >
                  <Youtube className='h-4 w-4' />
                  YouTube URL
                </TabsTrigger>
                <TabsTrigger value='upload' className='flex items-center gap-2'>
                  <Upload className='h-4 w-4' />
                  Upload Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value='youtube' className='mt-0'>
                <form onSubmit={handleYouTubeSubmit} className='space-y-4'>
                  <div className='space-y-2'>
                    <Input
                      type='url'
                      placeholder='https://www.youtube.com/watch?v=...'
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className='h-11'
                      disabled={uploading}
                    />
                    <p className='text-muted-foreground text-xs'>
                      Paste a YouTube URL to analyze
                    </p>
                  </div>

                  <Button
                    type='submit'
                    disabled={!youtubeUrl.trim() || uploading}
                    className='w-full'
                    size='sm'
                  >
                    {uploading ? (
                      <>
                        <Loader2 className='h-4 w-4 animate-spin' />
                        Processing
                      </>
                    ) : (
                      <>
                        <Youtube className='mr-2 h-4 w-4' />
                        Analyze URL
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value='upload' className='mt-0'>
                {/* Dropzone */}
                <div
                  className={`relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    isDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border/30 hover:border-border/50 hover:bg-muted/20'
                  } ${uploading ? 'pointer-events-none opacity-50' : ''} `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={!uploading ? openFileDialog : undefined}
                >
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='video/*'
                    onChange={handleFileInputChange}
                    className='hidden'
                    disabled={uploading}
                  />

                  <div className='space-y-3'>
                    <div className='bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full'>
                      {uploading ? (
                        <Loader2 className='text-primary h-6 w-6 animate-spin' />
                      ) : (
                        <CloudUpload className='text-primary h-6 w-6' />
                      )}
                    </div>

                    {uploading ? (
                      <div className='space-y-2'>
                        <p className='text-sm font-medium'>
                          {selectedFile ? 'Uploading...' : 'Processing...'}
                        </p>
                        {uploadProgress > 0 && (
                          <>
                            <p className='text-muted-foreground text-xs'>
                              {Math.round(uploadProgress)}% complete
                            </p>
                            <div className='bg-muted mx-auto h-2 w-full max-w-xs overflow-hidden rounded-full'>
                              <div
                                className='bg-primary h-full rounded-full transition-all duration-300'
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className='space-y-1'>
                        <p className='text-sm font-medium'>
                          {selectedFile
                            ? selectedFile.name
                            : 'Drop your video here or click to browse'}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          Supports MP4, MOV, AVI and other video formats
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedFile && !uploading && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileSelect(selectedFile);
                      }}
                      className='mt-4'
                      size='sm'
                    >
                      <Video className='mr-2 h-4 w-4' />
                      Analyze Video
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
