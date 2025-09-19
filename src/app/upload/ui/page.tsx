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
  const [choice, setChoice] = useState<'video' | 'script' | 'youtube' | null>(
    null
  );
  const [transcriptText, setTranscriptText] = useState('');
  const [ytUrl, setYtUrl] = useState('');
  const [ytLoading, setYtLoading] = useState(false);
  const [ytResult, setYtResult] = useState<any>(null);

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
              <Button
                className='flex w-full items-center gap-2 py-6 text-lg'
                variant='outline'
                onClick={() => setChoice('youtube')}
              >
                <IconBrandYoutube className='h-5 w-5' /> Use YouTube URL
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

          {choice === 'youtube' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='mt-4 flex flex-col gap-4'
            >
              <input
                type='url'
                placeholder='Paste YouTube URL (https://...)'
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                className='w-full rounded-lg border p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none'
              />
              <Button
                onClick={async () => {
                  if (!ytUrl) return;
                  setYtLoading(true);
                  setYtResult(null);
                  try {
                    const res = await fetch('/api/process-youtube', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url: ytUrl })
                    });
                    const data = await res.json();
                    setYtResult(data);
                  } finally {
                    setYtLoading(false);
                  }
                }}
                disabled={ytLoading || !ytUrl}
              >
                {ytLoading ? 'Fetching transcript...' : 'Generate Metadata'}
              </Button>

              {ytResult && (
                <div className='mt-2 grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='rounded-lg border p-4'>
                    <h3 className='mb-2 font-semibold'>Transcript</h3>
                    <div className='max-h-[420px] overflow-auto rounded bg-gray-50 p-3 text-sm text-gray-800'>
                      {ytResult.transcript}
                    </div>
                  </div>
                  <div className='rounded-lg border p-4 md:sticky md:top-4 md:h-fit'>
                    <h3 className='mb-2 font-semibold'>Generated Metadata</h3>
                    {ytResult?.metadata?.fallback ? (
                      <div className='space-y-4'>
                        <div>
                          <h4 className='font-medium text-blue-600'>Title</h4>
                          <p className='text-sm'>
                            {ytResult.metadata.fallback.title}
                          </p>
                        </div>
                        <div>
                          <h4 className='font-medium text-blue-600'>
                            Description
                          </h4>
                          <p className='text-sm whitespace-pre-wrap'>
                            {ytResult.metadata.fallback.description}
                          </p>
                        </div>
                        <div>
                          <h4 className='font-medium text-blue-600'>Tags</h4>
                          <div className='flex flex-wrap gap-2'>
                            {ytResult.metadata.fallback.tags.map(
                              (tag: string, idx: number) => (
                                <span
                                  key={idx}
                                  className='rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700'
                                >
                                  {tag}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                        {ytResult.metadata.fallback.chapters &&
                          ytResult.metadata.fallback.chapters.length > 0 && (
                            <div>
                              <h4 className='font-medium text-blue-600'>
                                Chapters
                              </h4>
                              <ul className='list-inside list-disc text-sm'>
                                {ytResult.metadata.fallback.chapters.map(
                                  (chapter: string, index: number) => (
                                    <li key={index}>{chapter}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        <div className='text-xs text-gray-500'>
                          {ytResult.metadata.raw}
                        </div>
                      </div>
                    ) : (
                      <pre className='rounded bg-gray-100 p-3 text-sm whitespace-pre-wrap'>
                        {JSON.stringify(ytResult.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              )}

              <Button onClick={() => setChoice(null)}>⬅ Back</Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
