'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Youtube,
  Upload,
  TrendingUp,
  Eye,
  Copy,
  Zap,
  Target,
  BarChart3,
  Lightbulb,
  Star,
  ArrowLeft,
  ExternalLink,
  Clock,
  Calendar,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { formatViewCount } from '@/lib/format';
import { IVideo } from '@/lib/models/Video';
import Link from 'next/link';

export function VideoDetailClient({ video }: { video: IVideo }) {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!', {
      description: `${type} copied to clipboard`
    });
  };

  const getDisplayTitle = () => {
    return video.youtubeTitle || video.uploadFilename || 'Video Content';
  };

  const getDisplayThumbnail = () => {
    return video.youtubeThumbnail || '/placeholder.svg';
  };

  const getDisplayDescription = () => {
    return video.youtubeDescription || '';
  };

  const getStatusBadge = () => {
    switch (video.status) {
      case 'completed':
        return (
          <Badge variant='default' className='bg-green-500'>
            Completed
          </Badge>
        );
      case 'pending':
        return <Badge variant='secondary'>Processing</Badge>;
      case 'failed':
        return <Badge variant='destructive'>Failed</Badge>;
      default:
        return <Badge variant='outline'>Unknown</Badge>;
    }
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (video.status === 'pending') {
    return (
      <div className='from-background via-background to-muted/20 min-h-screen bg-gradient-to-br'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8'>
            <Link href='/dashboard'>
              <Button variant='ghost' size='sm' className='mb-4'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back
              </Button>
            </Link>
            <h1 className='text-3xl font-bold'>{getDisplayTitle()}</h1>
            <p className='text-muted-foreground mt-2'>
              Processing your video content...
            </p>
          </div>

          <div className='mx-auto max-w-2xl'>
            <Card className='bg-card border-0 shadow-lg'>
              <CardContent className='p-8 text-center'>
                <div className='border-primary/30 border-t-primary mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4' />
                <h3 className='mb-2 text-xl font-semibold'>
                  Analyzing Your Content
                </h3>
                <p className='text-muted-foreground mb-6'>
                  We&apos;re generating optimized titles, descriptions, and
                  analytics for your video. This usually takes 2-3 minutes.
                </p>
                {getStatusBadge()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (video.status === 'failed') {
    return (
      <div className='from-background via-background to-muted/20 min-h-screen bg-gradient-to-br'>
        <div className='container mx-auto px-4 py-8'>
          <div className='mb-8'>
            <Link href='/dashboard'>
              <Button variant='ghost' size='sm' className='mb-4'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back
              </Button>
            </Link>
            <h1 className='text-3xl font-bold'>{getDisplayTitle()}</h1>
            <p className='text-muted-foreground mt-2'>Processing failed</p>
          </div>

          <div className='mx-auto max-w-2xl'>
            <Card className='bg-card border-0 shadow-lg'>
              <CardContent className='p-8 text-center'>
                <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
                  <X className='h-8 w-8 text-red-600' />
                </div>
                <h3 className='mb-2 text-xl font-semibold'>
                  Processing Failed
                </h3>
                <p className='text-muted-foreground mb-6'>
                  {video.errorMessage ||
                    'Something went wrong while processing your video.'}
                </p>
                {getStatusBadge()}
                <div className='mt-6'>
                  <Link href='/dashboard'>Return to Dashboard</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='from-background via-background to-muted/20 min-h-screen bg-gradient-to-br'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Link href='/dashboard'>
            <Button variant='ghost' size='sm' className='mb-4'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back
            </Button>
          </Link>
          <div className='flex items-start justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>{getDisplayTitle()}</h1>
              <p className='text-muted-foreground mt-2'>
                AI-powered content optimization results
              </p>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Video Preview */}
          <div className='lg:col-span-1'>
            <Card className='bg-card gap-0 overflow-hidden border-0 p-0 shadow-lg'>
              <CardContent className='p-0'>
                <div className='relative aspect-video'>
                  <Image
                    src={getDisplayThumbnail()}
                    alt={getDisplayTitle()}
                    className='h-full w-full object-cover'
                    width={400}
                    height={225}
                  />
                  {video.source === 'youtube' && (
                    <div className='absolute top-3 left-3'>
                      <Badge
                        variant='secondary'
                        className='bg-red-600 text-white'
                      >
                        <Youtube className='mr-1 h-3 w-3' />
                        YouTube
                      </Badge>
                    </div>
                  )}
                  {video.source === 'upload' && (
                    <div className='absolute top-3 left-3'>
                      <Badge
                        variant='secondary'
                        className='bg-blue-600 text-white'
                      >
                        <Upload className='mr-1 h-3 w-3' />
                        Upload
                      </Badge>
                    </div>
                  )}
                </div>

                <div className='space-y-6 p-6'>
                  {/* Original Content */}
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <p className='text-md font-medium'>Original Title:</p>
                      <p className='text-muted-foreground text-sm'>
                        {getDisplayTitle()}
                      </p>
                    </div>
                    {getDisplayDescription() && (
                      <div className='space-y-2'>
                        <p className='text-md font-medium'>
                          Original Description:
                        </p>
                        <p className='text-muted-foreground line-clamp-3 text-sm'>
                          {getDisplayDescription()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Analytics Overview */}
                  {video.youtubeAnalytics && (
                    <div className='space-y-4 border-t pt-6'>
                      <h3 className='font-semibold'>Performance Metrics</h3>
                      <div className='grid grid-cols-2 gap-4'>
                        <div className='bg-muted/50 rounded-lg p-3 text-center'>
                          <Eye className='text-primary mx-auto mb-2 h-5 w-5' />
                          <p className='text-sm font-medium'>Current Views</p>
                          <p className='text-lg font-bold'>
                            {formatViewCount(video.youtubeCurrentViews) || '0'}
                          </p>
                        </div>
                        <div className='bg-muted/50 rounded-lg p-3 text-center'>
                          <TrendingUp className='mx-auto mb-2 h-5 w-5 text-green-600' />
                          <p className='text-sm font-medium'>Predicted</p>
                          <p className='text-lg font-bold text-green-600'>
                            {video.youtubeAnalytics.predictedViews || 'N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Virality Score */}
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium'>
                            Virality Score
                          </span>
                          <Badge
                            variant={
                              (video.youtubeAnalytics.viralityScore || 0) >= 70
                                ? 'default'
                                : (video.youtubeAnalytics.viralityScore || 0) >=
                                    50
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {video.youtubeAnalytics.viralityScore || 0}/100
                          </Badge>
                        </div>
                        <div className='bg-muted h-2 w-full rounded-full'>
                          <div
                            className='bg-primary h-2 rounded-full transition-all'
                            style={{
                              width: `${video.youtubeAnalytics.viralityScore || 0}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* External Link */}
                  {video.youtubeUrl && (
                    <div className='border-t pt-6'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full'
                        onClick={() => window.open(video.youtubeUrl, '_blank')}
                      >
                        <ExternalLink className='mr-2 h-4 w-4' />
                        View on YouTube
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className='lg:col-span-2'>
            <Tabs defaultValue='analytics' className='space-y-6'>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='analytics'>Analytics</TabsTrigger>
                <TabsTrigger value='titles'>Titles</TabsTrigger>
                <TabsTrigger value='descriptions'>Descriptions</TabsTrigger>
                <TabsTrigger value='tags'>Tags</TabsTrigger>
              </TabsList>

              {/* Analytics */}
              <TabsContent value='analytics' className='space-y-6'>
                {video.youtubeAnalytics ? (
                  <>
                    {/* Performance Predictions */}
                    {video.youtubeAnalytics.predictions && (
                      <Card className='bg-card border-0 shadow-lg'>
                        <CardHeader>
                          <CardTitle className='flex items-center gap-2'>
                            <BarChart3 className='text-primary h-5 w-5' />
                            View Predictions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <div className='bg-muted/50 rounded-lg p-4 text-center'>
                              <Clock className='mx-auto mb-2 h-5 w-5 text-blue-600' />
                              <p className='text-sm font-medium'>24 Hours</p>
                              <p className='text-lg font-bold'>
                                {video.youtubeAnalytics.predictions.views24h ||
                                  'N/A'}
                              </p>
                            </div>
                            <div className='bg-muted/50 rounded-lg p-4 text-center'>
                              <Calendar className='mx-auto mb-2 h-5 w-5 text-green-600' />
                              <p className='text-sm font-medium'>7 Days</p>
                              <p className='text-lg font-bold'>
                                {video.youtubeAnalytics.predictions.views7d ||
                                  'N/A'}
                              </p>
                            </div>
                            <div className='bg-muted/50 rounded-lg p-4 text-center'>
                              <TrendingUp className='mx-auto mb-2 h-5 w-5 text-purple-600' />
                              <p className='text-sm font-medium'>30 Days</p>
                              <p className='text-lg font-bold'>
                                {video.youtubeAnalytics.predictions.views30d ||
                                  'N/A'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Key Factors */}
                    {video.youtubeAnalytics.keyFactors &&
                      video.youtubeAnalytics.keyFactors.length > 0 && (
                        <Card className='bg-card border-0 shadow-lg'>
                          <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                              <Target className='text-primary h-5 w-5' />
                              Key Performance Factors
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='space-y-4'>
                            {video.youtubeAnalytics.keyFactors.map(
                              (factor, index) => (
                                <div
                                  key={index}
                                  className='bg-muted/30 flex items-start gap-3 rounded-lg p-3'
                                >
                                  <Badge
                                    variant='outline'
                                    className={`shrink-0 ${getImpactColor(factor.impact)}`}
                                  >
                                    {factor.impact.toUpperCase()}
                                  </Badge>
                                  <div className='flex-1'>
                                    <h4 className='font-medium'>
                                      {factor.factor}
                                    </h4>
                                    <p className='text-muted-foreground text-sm'>
                                      {factor.description}
                                    </p>
                                    <div className='mt-2'>
                                      <div className='flex items-center justify-between text-xs'>
                                        <span>Impact Score</span>
                                        <span>{factor.score}/100</span>
                                      </div>
                                      <div className='bg-muted mt-1 h-1 w-full rounded-full'>
                                        <div
                                          className='bg-primary h-1 rounded-full'
                                          style={{ width: `${factor.score}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </CardContent>
                        </Card>
                      )}

                    {/* Scores Overview */}
                    <Card className='bg-card border-0 shadow-lg'>
                      <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                          <Star className='text-primary h-5 w-5' />
                          Performance Scores
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-6'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                          <div>
                            <div className='mb-2 flex items-center justify-between'>
                              <span className='text-sm font-medium'>
                                Virality Score
                              </span>
                              <span className='text-sm font-bold'>
                                {video.youtubeAnalytics.viralityScore || 0}
                                /100
                              </span>
                            </div>
                            <div className='bg-muted h-2 w-full rounded-full'>
                              <div
                                className='h-2 rounded-full bg-gradient-to-r from-red-500 to-green-500'
                                style={{
                                  width: `${video.youtubeAnalytics.viralityScore || 0}%`
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className='mb-2 flex items-center justify-between'>
                              <span className='text-sm font-medium'>
                                SEO Score
                              </span>
                              <span className='text-sm font-bold'>
                                {video.youtubeAnalytics.seoScore || 0}/100
                              </span>
                            </div>
                            <div className='bg-muted h-2 w-full rounded-full'>
                              <div
                                className='h-2 rounded-full bg-gradient-to-r from-yellow-500 to-blue-500'
                                style={{
                                  width: `${video.youtubeAnalytics.seoScore || 0}%`
                                }}
                              />
                            </div>
                          </div>
                          {video.youtubeAnalytics.shareabilityScore && (
                            <div>
                              <div className='mb-2 flex items-center justify-between'>
                                <span className='text-sm font-medium'>
                                  Shareability
                                </span>
                                <span className='text-sm font-bold'>
                                  {video.youtubeAnalytics.shareabilityScore}
                                  /100
                                </span>
                              </div>
                              <div className='bg-muted h-2 w-full rounded-full'>
                                <div
                                  className='h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500'
                                  style={{
                                    width: `${video.youtubeAnalytics.shareabilityScore}%`
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {video.youtubeAnalytics.trendingPotential && (
                            <div>
                              <div className='mb-2 flex items-center justify-between'>
                                <span className='text-sm font-medium'>
                                  Trending Potential
                                </span>
                                <span className='text-sm font-bold'>
                                  {video.youtubeAnalytics.trendingPotential}
                                  /100
                                </span>
                              </div>
                              <div className='bg-muted h-2 w-full rounded-full'>
                                <div
                                  className='h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500'
                                  style={{
                                    width: `${video.youtubeAnalytics.trendingPotential}%`
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className='bg-card border-0 shadow-lg'>
                    <CardContent className='p-8 text-center'>
                      <BarChart3 className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                      <h3 className='mb-2 text-lg font-semibold'>
                        No Analytics Available
                      </h3>
                      <p className='text-muted-foreground'>
                        Analytics data is not available for this video.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Suggested Titles */}
              <TabsContent value='titles' className='space-y-6'>
                <Card className='bg-card border-0 shadow-lg'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Lightbulb className='text-primary h-5 w-5' />
                      SEO Optimized Titles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {video.suggestedTitles &&
                    video.suggestedTitles.length > 0 ? (
                      video.suggestedTitles.map((suggestion, index) => (
                        <Card
                          key={index}
                          className='border-primary bg-primary/5 cursor-pointer border transition-all'
                        >
                          <CardContent className='p-4'>
                            <div className='mb-2 flex items-start justify-between'>
                              <h4 className='leading-relaxed font-medium'>
                                {suggestion.title}
                              </h4>
                              <Badge variant='outline'>
                                {suggestion.score}/100
                              </Badge>
                            </div>
                            <p className='text-muted-foreground mb-3 text-sm'>
                              {suggestion.reasoning}
                            </p>
                            <div className='flex gap-4 text-xs'>
                              <span className='flex items-center gap-1'>
                                <TrendingUp className='h-3 w-3' />
                                Virality: +{suggestion.viralityIncrease}%
                              </span>
                              <span className='flex items-center gap-1'>
                                <Target className='h-3 w-3' />
                                SEO: +{suggestion.seoImprovement}%
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className='text-muted-foreground'>
                        No suggested titles available.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Suggested Descriptions */}
              <TabsContent value='descriptions' className='space-y-6'>
                <Card className='bg-card border-0 shadow-lg'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Lightbulb className='text-primary h-5 w-5' />
                      SEO Optimized Descriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {video.suggestedDescriptions &&
                    video.suggestedDescriptions.length > 0 ? (
                      video.suggestedDescriptions.map((suggestion, index) => (
                        <Card
                          key={index}
                          className='border-primary bg-primary/5 cursor-pointer border p-0 transition-all'
                        >
                          <CardContent className='p-4'>
                            <div className='mb-2 flex items-start justify-between'>
                              <h4 className='font-medium'>
                                Description {index + 1}
                              </h4>
                              <Badge variant='outline'>
                                {suggestion.score}/100
                              </Badge>
                            </div>
                            <p className='text-muted-foreground mb-3 line-clamp-3 text-sm'>
                              {suggestion.description}
                            </p>
                            <p className='text-muted-foreground mb-3 text-sm'>
                              {suggestion.reasoning}
                            </p>
                            <div className='flex gap-4 text-xs'>
                              <span className='flex items-center gap-1'>
                                <TrendingUp className='h-3 w-3' />
                                Virality: +{suggestion.viralityIncrease}%
                              </span>
                              <span className='flex items-center gap-1'>
                                <Target className='h-3 w-3' />
                                SEO: +{suggestion.seoImprovement}%
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className='text-muted-foreground'>
                        No suggested descriptions available.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tags */}
              <TabsContent value='tags' className='space-y-6'>
                <Card className='bg-card border-0 shadow-lg'>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Zap className='text-primary h-5 w-5' />
                      Suggested Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {video.suggestedTags && video.suggestedTags.length > 0 ? (
                      <div className='flex flex-wrap gap-2'>
                        {video.suggestedTags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className='hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors'
                            onClick={() => copyToClipboard(tag, 'Tag')}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className='text-muted-foreground'>
                        No suggested tags available.
                      </p>
                    )}

                    {video.suggestedTags && video.suggestedTags.length > 0 && (
                      <div className='border-t pt-4'>
                        <Button
                          variant='outline'
                          onClick={() =>
                            copyToClipboard(
                              video
                                .suggestedTags!.map((tag) => `#${tag}`)
                                .join(' '),
                              'All tags'
                            )
                          }
                        >
                          <Copy className='mr-2 h-4 w-4' />
                          Copy All Tags
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
