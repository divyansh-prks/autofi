'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { TwitterLogoIcon } from '@radix-ui/react-icons';
import {
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandYoutube
} from '@tabler/icons-react';
import VideoUploader from '@/components/VideoUploader';

export default function UploadChoice() {
  const [choice, setChoice] = useState<'video' | 'script' | null>(null);

  return (
    <div className='flex min-h-screen items-center justify-center bg-white p-6'>
      <Card className='h-[500px] w-full max-w-lg rounded-2xl border border-gray-200 shadow-xl'>
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
          {choice === 'video' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='mt-4 flex flex-col gap-4'
            >
              <VideoUploader />
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
