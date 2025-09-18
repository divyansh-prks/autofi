'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Copy, Download } from 'lucide-react';
import { TwitterLogoIcon } from '@radix-ui/react-icons';
import {
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandYoutube
} from '@tabler/icons-react';
import VideoUploader from '@/components/VideoUploader';

export default function UploadChoice() {
  const [choice, setChoice] = useState<'video' | 'script' | null>(null);
  const [transcriptText, setTranscriptText] = useState('');

  const router = useRouter();

  const downloadTranscript = () => {
    if (!transcriptText) return;

    const markdownContent = `# Video Transcript\n\n${transcriptText}`;
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output_transcript.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Redirect after download
    setTimeout(() => {
      router.push('/api/uploadingTranscript');
    }, 1000); // Small delay to ensure download starts
  };

  return (
    <div className='flex items-center justify-center bg-white p-6'>
      <Card className='h-[1600px] w-full max-w-lg rounded-2xl border border-gray-200 shadow-xl'>
        <div className='flex items-center justify-center space-x-2'>
          <IconBrandYoutube />
          <IconBrandTwitter />
          <IconBrandTiktok />
        </div>

        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold text-white'>
            Upload Center
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Step 1: Choose Option */}
          {!choice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex flex-col gap-4'
            >
              <Button
                className='flex w-full items-center gap-2 py-6 text-lg'
                onClick={() => setChoice('video')}
              >
                <Upload className='h-5 w-5' /> Upload a Video
              </Button>
              <Button
                className='flex w-full items-center gap-2 py-6 text-lg'
                variant='outline'
                onClick={() => setChoice('script')}
              >
                <FileText className='h-5 w-5' /> Upload a Script
              </Button>
            </motion.div>
          )}

          {/* Step 2: Show Form Based on Choice */}
          {/* {choice === 'video' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='mt-4  flex flex-col gap-4'
            >
              <VideoUploader />
              <Button onClick={() => setChoice(null)}>⬅ Back</Button>
            </motion.div>
          )} */}

          {choice === 'video' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='mt-4 flex flex-col gap-4'
            >
              <VideoUploader />

              {/* Show Transcript Box Only After Generation */}
              {transcriptText && (
                <div className='relative'>
                  <textarea
                    value={transcriptText}
                    readOnly
                    rows={12}
                    placeholder='Generated transcript will appear here...'
                    className='h-[400px] w-full resize-none overflow-y-auto rounded-lg border bg-gray-50 p-3 text-sm'
                  />
                  <div className='absolute top-2 right-2 flex gap-1'>
                    <Button
                      size='sm'
                      variant='outline'
                      className='flex items-center gap-1'
                      onClick={downloadTranscript}
                    >
                      <Download className='h-4 w-4' />
                      Download
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      className='flex items-center gap-1'
                      onClick={() => {
                        navigator.clipboard.writeText(transcriptText);
                      }}
                    >
                      <Copy className='h-4 w-4' />
                      Copy
                    </Button>
                  </div>
                </div>
              )}

              <Button onClick={() => setChoice(null)}>⬅ Back</Button>
            </motion.div>
          )}

          {choice === 'script' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='mt-4 flex flex-col gap-4'
            >
              <textarea
                rows={6}
                placeholder='Paste your script here...'
                className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
              <Button onClick={() => setChoice(null)}>⬅ Back</Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
