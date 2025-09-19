'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Youtube,
  TrendingUp,
  Eye,
  Copy,
  CheckCircle,
  Zap,
  Target,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { ViralityDashboard } from '@/components/virality-dashboard';
import { toast } from 'sonner';

interface VideoAnalysis {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  originalTitle: string;
  originalDescription: string;
  suggestedTitles: Array<{
    title: string;
    score: number;
    reasoning: string;
    viralityIncrease: number;
    seoImprovement: number;
  }>;
  suggestedDescriptions: Array<{
    description: string;
    score: number;
    reasoning: string;
    viralityIncrease: number;
    seoImprovement: number;
  }>;
  tags: string[];
  analytics: {
    currentViews: string;
    predictedViews: string;
    viralityScore: number;
    seoScore: number;
    engagementPrediction: string;
    competitorAnalysis: string;
  };
}

interface VideoDetailClientProps {
  videoData: VideoAnalysis & {
    status?: string;
    progress?: number;
    transcript?: string;
    source?: string;
    youtubeUrl?: string;
    videoUrl?: string;
    viralityMetrics?: any;
    originalMetrics?: any;
  };
}

export function VideoDetailClient({ videoData }: VideoDetailClientProps) {
  const router = useRouter();
  const [video, setVideo] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [selectedDescription, setSelectedDescription] = useState<string>('');

  // Use the provided virality metrics or fallback to defaults
  const viralityMetrics = videoData.viralityMetrics || {
    viralityScore: 78,
    seoScore: 85,
    engagementPrediction: 82,
    shareabilityScore: 74,
    trendingPotential: 89,
    audienceMatch: 91,
    competitorComparison: {
      better: 67,
      similar: 23,
      worse: 10
    },
    keyFactors: [
      {
        factor: 'Trending Keywords',
        impact: 'high' as const,
        score: 92,
        description: 'Uses 3 high-volume trending keywords in tech niche'
      },
      {
        factor: 'Title Hook Strength',
        impact: 'high' as const,
        score: 88,
        description: 'Strong curiosity gap and benefit-driven language'
      },
      {
        factor: 'Thumbnail Potential',
        impact: 'medium' as const,
        score: 75,
        description: 'Good contrast but could use more emotional expression'
      },
      {
        factor: 'Content Length',
        impact: 'medium' as const,
        score: 70,
        description: 'Optimal length for engagement in this category'
      },
      {
        factor: 'Upload Timing',
        impact: 'low' as const,
        score: 65,
        description: 'Posted during moderate traffic hours'
      }
    ],
    predictions: {
      views24h: '8.2K',
      views7d: '45.7K',
      views30d: '127K',
      peakTime: 'Day 3',
      plateauTime: 'Week 2'
    }
  };

  const originalMetrics = videoData.originalMetrics || {
    viralityScore: 45,
    seoScore: 52,
    engagementPrediction: 38,
    shareabilityScore: 41,
    trendingPotential: 35,
    audienceMatch: 48,
    competitorComparison: {
      better: 25,
      similar: 35,
      worse: 40
    },
    keyFactors: [],
    predictions: {
      views24h: '2.1K',
      views7d: '12.3K',
      views30d: '34K',
      peakTime: 'Day 5',
      plateauTime: 'Week 3'
    }
  };

  useEffect(() => {
    // Use the provided video data
    const processedVideo: VideoAnalysis = {
      ...videoData,
      // Ensure we have the required analytics structure
      analytics: videoData.analytics || {
        currentViews: '0',
        predictedViews: '0',
        viralityScore: 0,
        seoScore: 0,
        engagementPrediction: '0%',
        competitorAnalysis: 'No analysis available'
      }
    };

    setVideo(processedVideo);

    // Set initial selections
    if (
      processedVideo.suggestedTitles &&
      processedVideo.suggestedTitles.length > 0
    ) {
      setSelectedTitle(processedVideo.suggestedTitles[0].title);
    }
    if (
      processedVideo.suggestedDescriptions &&
      processedVideo.suggestedDescriptions.length > 0
    ) {
      setSelectedDescription(
        processedVideo.suggestedDescriptions[0].description
      );
    }

    setLoading(false);
  }, [videoData]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!', {
      description: `${type} copied to clipboard`
    });
  };

  if (loading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-t-transparent' />
          <p className='text-muted-foreground'>Loading video analysis...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <p className='text-muted-foreground'>Video not found</p>
          <Button onClick={() => router.push('/')} className='mt-4'>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Video Preview */}
          <div className='lg:col-span-1'>
            <Card className='border-slate-200/60 bg-white/70 shadow-lg backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/70'>
              <CardContent className='p-0'>
                <div className='relative aspect-video overflow-hidden rounded-t-lg bg-black'>
                  <Image
                    src={video.thumbnail || '/placeholder.svg'}
                    alt={video.title}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='space-y-6 p-6'>
                  <div>
                    <h3 className='text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase'>
                      Original Title
                    </h3>
                    <p className='rounded-lg border border-slate-200/50 bg-slate-50 p-4 text-sm leading-relaxed dark:border-slate-700/50 dark:bg-slate-800/50'>
                      {video.originalTitle}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-muted-foreground mb-3 text-sm font-semibold tracking-wide uppercase'>
                      Original Description
                    </h3>
                    <p className='text-muted-foreground line-clamp-3 rounded-lg border border-slate-200/50 bg-slate-50 p-4 text-sm leading-relaxed dark:border-slate-700/50 dark:bg-slate-800/50'>
                      {video.originalDescription}
                    </p>
                  </div>

                  {/* Analytics Overview */}
                  <div className='grid grid-cols-2 gap-6 border-t border-slate-200 pt-6 dark:border-slate-700'>
                    <div className='rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center dark:border-blue-800/50 dark:from-blue-950/50 dark:to-blue-900/50'>
                      <p className='text-primary mb-1 text-2xl font-bold'>
                        {video.analytics.currentViews}
                      </p>
                      <p className='text-muted-foreground text-xs font-medium'>
                        Current Views
                      </p>
                    </div>
                    <div className='rounded-xl border border-green-200/50 bg-gradient-to-br from-green-50 to-green-100 p-4 text-center dark:border-green-800/50 dark:from-green-950/50 dark:to-green-900/50'>
                      <p className='mb-1 text-2xl font-bold text-green-600'>
                        {video.analytics.predictedViews}
                      </p>
                      <p className='text-muted-foreground text-xs font-medium'>
                        Predicted Views
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-2'>
            <div className='rounded-xl border border-slate-200/60 bg-white/70 p-6 shadow-lg backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/70'>
              <Tabs defaultValue='analytics' className='space-y-8'>
                <TabsList className='grid h-12 w-full grid-cols-4 rounded-lg bg-slate-100/80 p-1 dark:bg-slate-800/80'>
                  <TabsTrigger
                    value='analytics'
                    className='gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700'
                  >
                    <BarChart3 className='h-4 w-4' />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value='titles'
                    className='gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700'
                  >
                    <Lightbulb className='h-4 w-4' />
                    Titles
                  </TabsTrigger>
                  <TabsTrigger
                    value='descriptions'
                    className='gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700'
                  >
                    <Target className='h-4 w-4' />
                    Descriptions
                  </TabsTrigger>
                  <TabsTrigger
                    value='tags'
                    className='gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700'
                  >
                    <Zap className='h-4 w-4' />
                    Tags
                  </TabsTrigger>
                </TabsList>

                {/* Analytics Tab */}
                <TabsContent value='analytics' className='space-y-6'>
                  <ViralityDashboard
                    metrics={viralityMetrics}
                    originalMetrics={originalMetrics}
                  />
                </TabsContent>

                {/* Titles Tab */}
                <TabsContent value='titles' className='space-y-8'>
                  <div className='space-y-6'>
                    {video.suggestedTitles.map((suggestion, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-xl ${
                          selectedTitle === suggestion.title
                            ? 'ring-primary bg-primary/5 dark:bg-primary/10 shadow-lg ring-2 ring-offset-2'
                            : 'bg-white/80 shadow-md hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800'
                        } border-slate-200/60 dark:border-slate-700/60`}
                        onClick={() => setSelectedTitle(suggestion.title)}
                      >
                        <CardContent className='p-6'>
                          <div className='flex items-start justify-between gap-4'>
                            <div className='flex-1'>
                              <div className='mb-4 flex flex-wrap items-center gap-2'>
                                <Badge
                                  variant={
                                    index === 0 ? 'default' : 'secondary'
                                  }
                                  className='px-3 py-1 text-xs font-semibold'
                                >
                                  Score: {suggestion.score}
                                </Badge>
                                <Badge
                                  variant='outline'
                                  className='gap-1 border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300'
                                >
                                  <TrendingUp className='h-3 w-3' />+
                                  {suggestion.viralityIncrease}% viral
                                </Badge>
                                <Badge
                                  variant='outline'
                                  className='gap-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                                >
                                  <Eye className='h-3 w-3' />+
                                  {suggestion.seoImprovement}% SEO
                                </Badge>
                              </div>
                              <h4 className='mb-3 text-lg leading-tight font-semibold text-balance'>
                                {suggestion.title}
                              </h4>
                              <p className='text-muted-foreground rounded-lg border border-slate-200/50 bg-slate-50 p-4 text-sm leading-relaxed dark:border-slate-700/50 dark:bg-slate-900/50'>
                                {suggestion.reasoning}
                              </p>
                            </div>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='shrink-0 hover:bg-slate-100 dark:hover:bg-slate-700'
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(suggestion.title, 'Title');
                              }}
                            >
                              <Copy className='h-4 w-4' />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className='border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg dark:border-green-800 dark:from-green-950/50 dark:to-emerald-950/50'>
                    <CardHeader className='pb-4'>
                      <CardTitle className='flex items-center gap-2 text-green-700 dark:text-green-300'>
                        <CheckCircle className='h-5 w-5' />
                        Selected Title
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <Input
                        value={selectedTitle}
                        onChange={(e) => setSelectedTitle(e.target.value)}
                        className='border-green-200 bg-white/80 focus:border-green-400 dark:border-green-700 dark:bg-slate-900/80 dark:focus:border-green-500'
                      />
                      <div className='flex gap-3'>
                        <Button className='gap-2 bg-green-600 text-white hover:bg-green-700'>
                          <Youtube className='h-4 w-4' />
                          Update on YouTube
                        </Button>
                        <Button
                          variant='outline'
                          className='border-green-200 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-950/50'
                          onClick={() =>
                            copyToClipboard(selectedTitle, 'Selected title')
                          }
                        >
                          <Copy className='h-4 w-4' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Descriptions Tab */}
                <TabsContent value='descriptions' className='space-y-8'>
                  <div className='space-y-6'>
                    {video.suggestedDescriptions.map((suggestion, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-xl ${
                          selectedDescription === suggestion.description
                            ? 'ring-primary bg-primary/5 dark:bg-primary/10 shadow-lg ring-2 ring-offset-2'
                            : 'bg-white/80 shadow-md hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800'
                        } border-slate-200/60 dark:border-slate-700/60`}
                        onClick={() =>
                          setSelectedDescription(suggestion.description)
                        }
                      >
                        <CardContent className='p-6'>
                          <div className='flex items-start justify-between gap-4'>
                            <div className='flex-1'>
                              <div className='mb-4 flex flex-wrap items-center gap-2'>
                                <Badge
                                  variant={
                                    index === 0 ? 'default' : 'secondary'
                                  }
                                  className='px-3 py-1 text-xs font-semibold'
                                >
                                  Score: {suggestion.score}
                                </Badge>
                                <Badge
                                  variant='outline'
                                  className='gap-1 border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300'
                                >
                                  <TrendingUp className='h-3 w-3' />+
                                  {suggestion.viralityIncrease}% viral
                                </Badge>
                                <Badge
                                  variant='outline'
                                  className='gap-1 border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                                >
                                  <Eye className='h-3 w-3' />+
                                  {suggestion.seoImprovement}% SEO
                                </Badge>
                              </div>
                              <div className='mb-4 rounded-lg border border-slate-200/50 bg-slate-50/80 p-4 dark:border-slate-700/50 dark:bg-slate-800/50'>
                                <p className='line-clamp-4 text-sm leading-relaxed whitespace-pre-line'>
                                  {suggestion.description}
                                </p>
                              </div>
                              <p className='text-muted-foreground rounded-lg border border-slate-200/50 bg-slate-50 p-4 text-sm leading-relaxed dark:border-slate-700/50 dark:bg-slate-900/50'>
                                {suggestion.reasoning}
                              </p>
                            </div>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='shrink-0 hover:bg-slate-100 dark:hover:bg-slate-700'
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  suggestion.description,
                                  'Description'
                                );
                              }}
                            >
                              <Copy className='h-4 w-4' />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className='border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg dark:border-blue-800 dark:from-blue-950/50 dark:to-indigo-950/50'>
                    <CardHeader className='pb-4'>
                      <CardTitle className='flex items-center gap-2 text-blue-700 dark:text-blue-300'>
                        <CheckCircle className='h-5 w-5' />
                        Selected Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <Textarea
                        value={selectedDescription}
                        onChange={(e) => setSelectedDescription(e.target.value)}
                        rows={8}
                        className='border-blue-200 bg-white/80 focus:border-blue-400 dark:border-blue-700 dark:bg-slate-900/80 dark:focus:border-blue-500'
                      />
                      <div className='flex gap-3'>
                        <Button className='gap-2 bg-blue-600 text-white hover:bg-blue-700'>
                          <Youtube className='h-4 w-4' />
                          Update on YouTube
                        </Button>
                        <Button
                          variant='outline'
                          className='border-blue-200 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-950/50'
                          onClick={() =>
                            copyToClipboard(
                              selectedDescription,
                              'Selected description'
                            )
                          }
                        >
                          <Copy className='h-4 w-4' />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tags Tab */}
                <TabsContent value='tags' className='space-y-8'>
                  <Card className='border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg dark:border-purple-800 dark:from-purple-950/50 dark:to-pink-950/50'>
                    <CardHeader className='pb-4'>
                      <CardTitle className='text-purple-700 dark:text-purple-300'>
                        Optimized Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div className='flex flex-wrap gap-3'>
                        {video.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant='outline'
                            className='gap-2 border-purple-200 bg-white/80 px-3 py-2 text-sm transition-colors hover:bg-purple-50 dark:border-purple-700 dark:bg-slate-800/80 dark:hover:bg-purple-950/50'
                          >
                            {tag}
                            <Button
                              variant='ghost'
                              size='sm'
                              className='ml-1 h-5 w-5 rounded-full p-0 hover:bg-purple-100 dark:hover:bg-purple-800'
                              onClick={() => copyToClipboard(tag, 'Tag')}
                            >
                              <Copy className='h-3 w-3' />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant='outline'
                        onClick={() =>
                          copyToClipboard(video.tags.join(', '), 'All tags')
                        }
                        className='gap-2 border-purple-600 bg-purple-600 text-white hover:bg-purple-700'
                      >
                        <Copy className='h-4 w-4' />
                        Copy All Tags
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
