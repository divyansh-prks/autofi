'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Youtube,
  Zap,
  TrendingUp,
  Target,
  Copy,
  CheckCircle,
  Loader2,
  BarChart3,
  Users,
  Hash,
  FileText,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface OptimizedContent {
  title: string;
  description: string;
  tags: string[];
  reasoning: string;
  estimatedCTR: string;
  targetAudience: string;
}

interface ApiResponse {
  success: boolean;
  contentCategory: string;
  keyThemes: string[];
  analyzedTitles: number;
  transcriptLength: number;
  trendingPatterns: {
    comebackTheme: boolean;
    motivationTheme: boolean;
    examTheme: boolean;
    emojiUsage: boolean;
    hashtagUsage: boolean;
    powerWords: string[];
  };
  optimizedContent: OptimizedContent[];
  message: string;
}

export default function TitleHumePage() {
  const [transcriptText, setTranscriptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ApiResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (transcriptText.length < 50) {
      toast.error('Please enter at least 50 characters for proper analysis');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-optimized-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcriptText
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResults(data);
      toast.success('4 SEO-optimized titles and descriptions generated!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate content'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (
    text: string,
    index: number,
    type: 'title' | 'description'
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      toast.success(
        `${type === 'title' ? 'Title' : 'Description'} copied to clipboard!`
      );
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatContentType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 text-center'
        >
          <div className='mb-4 flex items-center justify-center gap-3'>
            <div className='rounded-xl bg-gradient-to-r from-red-500 to-red-600 p-3'>
              <Youtube className='h-8 w-8 text-white' />
            </div>
            <h1 className='bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold text-transparent dark:from-white dark:to-gray-300'>
              YouTube SEO Optimizer
            </h1>
          </div>
          <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300'>
            Generate 4 SEO-optimized titles and descriptions based on trending
            video analysis and your content
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className='mb-8'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                Video Content / Transcript
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Textarea
                placeholder='Paste your video transcript, content outline, or describe what your video is about... (minimum 50 characters for proper analysis)'
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                className='min-h-32 resize-none'
              />
              <div className='flex items-center justify-between'>
                <div className='text-sm text-gray-500'>
                  {transcriptText.length} characters
                  {transcriptText.length < 50 && (
                    <span className='ml-2 text-red-500'>
                      (Need {50 - transcriptText.length} more)
                    </span>
                  )}
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || transcriptText.length < 50}
                  className='bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className='h-4 w-4' />
                      Generate SEO Content
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-6'
          >
            {/* Analysis Overview */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BarChart3 className='h-5 w-5' />
                  Content Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  <div className='rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/20'>
                    <Target className='mx-auto mb-2 h-6 w-6 text-blue-600' />
                    <div className='font-semibold text-blue-900 dark:text-blue-100'>
                      {formatContentType(results.contentCategory)}
                    </div>
                    <div className='text-sm text-blue-600 dark:text-blue-300'>
                      Category
                    </div>
                  </div>
                  <div className='rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20'>
                    <TrendingUp className='mx-auto mb-2 h-6 w-6 text-green-600' />
                    <div className='font-semibold text-green-900 dark:text-green-100'>
                      {results.analyzedTitles}
                    </div>
                    <div className='text-sm text-green-600 dark:text-green-300'>
                      Trending Titles
                    </div>
                  </div>
                  <div className='rounded-lg bg-purple-50 p-4 text-center dark:bg-purple-900/20'>
                    <Hash className='mx-auto mb-2 h-6 w-6 text-purple-600' />
                    <div className='font-semibold text-purple-900 dark:text-purple-100'>
                      {results.keyThemes.length}
                    </div>
                    <div className='text-sm text-purple-600 dark:text-purple-300'>
                      Key Themes
                    </div>
                  </div>
                  <div className='rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-900/20'>
                    <FileText className='mx-auto mb-2 h-6 w-6 text-orange-600' />
                    <div className='font-semibold text-orange-900 dark:text-orange-100'>
                      {results.transcriptLength}
                    </div>
                    <div className='text-sm text-orange-600 dark:text-orange-300'>
                      Characters
                    </div>
                  </div>
                </div>

                <div className='mt-6'>
                  <h4 className='mb-3 font-semibold'>Key Themes Detected:</h4>
                  <div className='flex flex-wrap gap-2'>
                    {results.keyThemes.map((theme, index) => (
                      <Badge key={index} variant='secondary'>
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className='mt-4'>
                  <h4 className='mb-3 font-semibold'>
                    Trending Patterns Found:
                  </h4>
                  <div className='grid grid-cols-2 gap-2 text-sm md:grid-cols-3'>
                    <div
                      className={`flex items-center gap-2 ${results.trendingPatterns.comebackTheme ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${results.trendingPatterns.comebackTheme ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                      Comeback Theme
                    </div>
                    <div
                      className={`flex items-center gap-2 ${results.trendingPatterns.motivationTheme ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${results.trendingPatterns.motivationTheme ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                      Motivation Focus
                    </div>
                    <div
                      className={`flex items-center gap-2 ${results.trendingPatterns.examTheme ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${results.trendingPatterns.examTheme ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                      Exam Content
                    </div>
                    <div
                      className={`flex items-center gap-2 ${results.trendingPatterns.emojiUsage ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${results.trendingPatterns.emojiUsage ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                      Emoji Usage
                    </div>
                    <div
                      className={`flex items-center gap-2 ${results.trendingPatterns.hashtagUsage ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${results.trendingPatterns.hashtagUsage ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                      Hashtag Usage
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Content */}
            <div className='grid gap-6'>
              {results.optimizedContent.map((content, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className='overflow-hidden'>
                    <CardHeader className='bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'>
                      <div className='flex items-center justify-between'>
                        <CardTitle className='flex items-center gap-2'>
                          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 font-bold text-white'>
                            {index + 1}
                          </div>
                          Option {index + 1}
                        </CardTitle>
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-2 text-sm'>
                            <TrendingUp className='h-4 w-4 text-green-600' />
                            <span className='font-medium'>
                              {content.estimatedCTR} CTR
                            </span>
                          </div>
                          <div className='flex items-center gap-2 text-sm'>
                            <Users className='h-4 w-4 text-blue-600' />
                            <span className='text-xs text-gray-600 dark:text-gray-300'>
                              {content.targetAudience}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='p-6'>
                      <Tabs defaultValue='title' className='w-full'>
                        <TabsList className='grid w-full grid-cols-4'>
                          <TabsTrigger value='title'>Title</TabsTrigger>
                          <TabsTrigger value='description'>
                            Description
                          </TabsTrigger>
                          <TabsTrigger value='tags'>Tags</TabsTrigger>
                          <TabsTrigger value='analysis'>Analysis</TabsTrigger>
                        </TabsList>

                        <TabsContent value='title' className='mt-4'>
                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <label className='text-sm font-medium'>
                                YouTube Title
                              </label>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  copyToClipboard(content.title, index, 'title')
                                }
                                className='h-8'
                              >
                                {copiedIndex === index ? (
                                  <CheckCircle className='h-4 w-4 text-green-600' />
                                ) : (
                                  <Copy className='h-4 w-4' />
                                )}
                              </Button>
                            </div>
                            <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-800'>
                              <p className='text-lg font-medium'>
                                {content.title}
                              </p>
                              <p className='mt-1 text-sm text-gray-500'>
                                {content.title.length} characters
                              </p>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value='description' className='mt-4'>
                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <label className='text-sm font-medium'>
                                YouTube Description
                              </label>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() =>
                                  copyToClipboard(
                                    content.description,
                                    index,
                                    'description'
                                  )
                                }
                                className='h-8'
                              >
                                {copiedIndex === index ? (
                                  <CheckCircle className='h-4 w-4 text-green-600' />
                                ) : (
                                  <Copy className='h-4 w-4' />
                                )}
                              </Button>
                            </div>
                            <div className='max-h-64 overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-800'>
                              <pre className='text-sm whitespace-pre-wrap'>
                                {content.description}
                              </pre>
                              <p className='mt-2 text-sm text-gray-500'>
                                {content.description.length} characters
                              </p>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value='tags' className='mt-4'>
                          <div className='space-y-3'>
                            <label className='text-sm font-medium'>
                              YouTube Tags
                            </label>
                            <div className='flex flex-wrap gap-2'>
                              {content.tags.map((tag, tagIndex) => (
                                <Badge
                                  key={tagIndex}
                                  variant='outline'
                                  className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                copyToClipboard(
                                  content.tags.join(', '),
                                  index,
                                  'title'
                                )
                              }
                              className='mt-3 w-full'
                            >
                              <Copy className='mr-2 h-4 w-4' />
                              Copy All Tags
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value='analysis' className='mt-4'>
                          <div className='space-y-4'>
                            <div>
                              <h4 className='mb-2 font-medium'>
                                Strategy Reasoning
                              </h4>
                              <p className='text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
                                {content.reasoning}
                              </p>
                            </div>
                            <div className='grid gap-4 md:grid-cols-2'>
                              <div className='rounded-lg bg-green-50 p-3 dark:bg-green-900/20'>
                                <h5 className='mb-1 font-medium text-green-800 dark:text-green-200'>
                                  Estimated CTR
                                </h5>
                                <p className='font-semibold text-green-600 dark:text-green-300'>
                                  {content.estimatedCTR}
                                </p>
                              </div>
                              <div className='rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20'>
                                <h5 className='mb-1 font-medium text-blue-800 dark:text-blue-200'>
                                  Target Audience
                                </h5>
                                <p className='text-sm text-blue-600 dark:text-blue-300'>
                                  {content.targetAudience}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!results && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='py-12 text-center'
          >
            <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20'>
              <Youtube className='h-12 w-12 text-red-600' />
            </div>
            <h3 className='mb-2 text-xl font-semibold'>
              Ready to Optimize Your YouTube Content?
            </h3>
            <p className='mx-auto max-w-md text-gray-600 dark:text-gray-300'>
              Enter your video content or transcript above to generate 4
              SEO-optimized titles and descriptions based on trending video
              analysis.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
