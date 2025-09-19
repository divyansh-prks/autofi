'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
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
import { UserProfile } from '@/components/user-profile';
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

export default function VideoDetailPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [video, setVideo] = useState<VideoAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [selectedDescription, setSelectedDescription] = useState<string>('');

  const mockUser = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: '/professional-avatar.png',
    plan: 'pro' as const,
    stats: {
      subscribers: '125K',
      totalViews: '2.4M',
      avgViews: '45K',
      engagementRate: '8.2%'
    }
  };

  const viralityMetrics = {
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

  const originalMetrics = {
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
    // Simulate loading video data
    const loadVideo = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockVideo: VideoAnalysis = {
        id: params.id,
        title: 'How to Build Amazing React Apps',
        originalTitle: 'React Tutorial for Beginners',
        originalDescription:
          "Learn React basics in this tutorial. We'll cover components, state, and props.",
        description:
          "Learn React basics in this tutorial. We'll cover components, state, and props.",
        thumbnail: `https://img.youtube.com/vi/${params.id}/maxresdefault.jpg`,
        suggestedTitles: [
          {
            title:
              "Master React in 2024: Complete Beginner's Guide That Actually Works",
            score: 95,
            reasoning:
              'Uses trending keywords, year specificity, and addresses pain points',
            viralityIncrease: 340,
            seoImprovement: 85
          },
          {
            title: 'React Tutorial: Build 3 Real Projects (No Boring Theory!)',
            score: 92,
            reasoning:
              'Project-based learning appeals to developers, dismisses common complaints',
            viralityIncrease: 280,
            seoImprovement: 78
          },
          {
            title:
              "Why 90% of React Tutorials Fail (And How This One's Different)",
            score: 89,
            reasoning:
              'Controversial hook with solution promise, creates curiosity gap',
            viralityIncrease: 250,
            seoImprovement: 72
          },
          {
            title: 'React Explained Simply: From Zero to Hero in One Video',
            score: 86,
            reasoning:
              'Clear progression promise, appeals to complete beginners',
            viralityIncrease: 220,
            seoImprovement: 68
          },
          {
            title: "The Only React Course You'll Ever Need (2024 Updated)",
            score: 83,
            reasoning: 'Definitive positioning with current year relevance',
            viralityIncrease: 190,
            seoImprovement: 65
          }
        ],
        suggestedDescriptions: [
          {
            description:
              "🚀 Ready to master React? This comprehensive guide takes you from complete beginner to confident developer.\n\n⏰ TIMESTAMPS:\n00:00 - Introduction\n02:30 - Setting up your environment\n08:15 - Your first component\n15:45 - Understanding state\n25:30 - Props explained\n35:20 - Building a real project\n\n💡 What you'll learn:\n✅ React fundamentals that actually matter\n✅ Modern hooks and best practices\n✅ How to think in React\n✅ Real-world project building\n\n🔗 Resources mentioned:\n- Starter code: [link]\n- Cheat sheet: [link]\n- Join our Discord: [link]\n\n#React #JavaScript #WebDevelopment #Programming #Tutorial",
            score: 94,
            reasoning:
              'Structured with timestamps, clear value proposition, and strong CTAs',
            viralityIncrease: 320,
            seoImprovement: 88
          },
          {
            description:
              "Learn React the right way! This isn't another boring tutorial - we're building real projects that you can add to your portfolio.\n\nPerfect for beginners who want to:\n→ Land their first developer job\n→ Build impressive projects\n→ Understand React deeply (not just copy-paste)\n\nBy the end of this video, you'll have built 3 complete applications and understand exactly how React works under the hood.\n\nDrop a 🔥 if you're ready to level up your coding skills!\n\n#ReactJS #WebDev #Coding #Programming",
            score: 91,
            reasoning:
              'Benefit-focused with clear outcomes and engagement hooks',
            viralityIncrease: 290,
            seoImprovement: 82
          }
        ],
        tags: [
          'react',
          'javascript',
          'web development',
          'programming',
          'tutorial',
          'beginner',
          '2024',
          'coding'
        ],
        analytics: {
          currentViews: '12.5K',
          predictedViews: '45.2K',
          viralityScore: 78,
          seoScore: 85,
          engagementPrediction: '12.3%',
          competitorAnalysis: 'Above average performance expected'
        }
      };

      setVideo(mockVideo);
      setSelectedTitle(mockVideo.suggestedTitles[0].title);
      setSelectedDescription(mockVideo.suggestedDescriptions[0].description);
      setLoading(false);
    };

    loadVideo();
  }, [params.id]);

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
    <div className='bg-background min-h-screen'>
      {/* Header */}
      <header className='bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => router.push('/')}
                className='gap-2'
              >
                <ArrowLeft className='h-4 w-4' />
                Back
              </Button>
              <div className='flex items-center gap-3'>
                <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
                  <Youtube className='text-primary-foreground h-5 w-5' />
                </div>
                <div>
                  <h1 className='text-lg font-bold'>Video Analysis</h1>
                  <p className='text-muted-foreground text-sm'>
                    AI-powered optimization
                  </p>
                </div>
              </div>
            </div>

            <UserProfile
              user={mockUser}
              onSettingsClick={() => console.log('Settings')}
              onLogoutClick={() => console.log('Logout')}
            />
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Video Preview */}
          <div className='lg:col-span-1'>
            <Card>
              <CardContent className='p-0'>
                <div className='aspect-video overflow-hidden rounded-t-lg bg-black'>
                  <img
                    src={video.thumbnail || '/placeholder.svg'}
                    alt={video.title}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='space-y-4 p-4'>
                  <div>
                    <h3 className='text-muted-foreground mb-2 text-sm font-semibold'>
                      Original Title
                    </h3>
                    <p className='text-sm'>{video.originalTitle}</p>
                  </div>

                  <div>
                    <h3 className='text-muted-foreground mb-2 text-sm font-semibold'>
                      Original Description
                    </h3>
                    <p className='text-muted-foreground line-clamp-3 text-sm'>
                      {video.originalDescription}
                    </p>
                  </div>

                  {/* Analytics Overview */}
                  <div className='grid grid-cols-2 gap-4 border-t pt-4'>
                    <div className='text-center'>
                      <p className='text-primary text-2xl font-bold'>
                        {video.analytics.currentViews}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        Current Views
                      </p>
                    </div>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-green-600'>
                        {video.analytics.predictedViews}
                      </p>
                      <p className='text-muted-foreground text-xs'>
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
            <Tabs defaultValue='analytics' className='space-y-6'>
              <TabsList className='grid w-full grid-cols-5'>
                <TabsTrigger value='analytics' className='gap-2'>
                  <BarChart3 className='h-4 w-4' />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value='titles' className='gap-2'>
                  <Lightbulb className='h-4 w-4' />
                  Titles
                </TabsTrigger>
                <TabsTrigger value='descriptions' className='gap-2'>
                  <Target className='h-4 w-4' />
                  Descriptions
                </TabsTrigger>
                <TabsTrigger value='tags' className='gap-2'>
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
              <TabsContent value='titles' className='space-y-6'>
                <div className='space-y-4'>
                  {video.suggestedTitles.map((suggestion, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedTitle === suggestion.title
                          ? 'ring-primary ring-2'
                          : ''
                      }`}
                      onClick={() => setSelectedTitle(suggestion.title)}
                    >
                      <CardContent className='p-4'>
                        <div className='flex items-start justify-between gap-4'>
                          <div className='flex-1'>
                            <div className='mb-2 flex items-center gap-2'>
                              <Badge
                                variant={index === 0 ? 'default' : 'secondary'}
                              >
                                Score: {suggestion.score}
                              </Badge>
                              <Badge variant='outline' className='gap-1'>
                                <TrendingUp className='h-3 w-3' />+
                                {suggestion.viralityIncrease}% viral
                              </Badge>
                              <Badge variant='outline' className='gap-1'>
                                <Eye className='h-3 w-3' />+
                                {suggestion.seoImprovement}% SEO
                              </Badge>
                            </div>
                            <h4 className='mb-2 font-medium text-balance'>
                              {suggestion.title}
                            </h4>
                            <p className='text-muted-foreground text-sm'>
                              {suggestion.reasoning}
                            </p>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
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

                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <CheckCircle className='h-5 w-5 text-green-600' />
                      Selected Title
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      value={selectedTitle}
                      onChange={(e) => setSelectedTitle(e.target.value)}
                      className='mb-4'
                    />
                    <div className='flex gap-2'>
                      <Button className='gap-2'>
                        <Youtube className='h-4 w-4' />
                        Update on YouTube
                      </Button>
                      <Button
                        variant='outline'
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
              <TabsContent value='descriptions' className='space-y-6'>
                <div className='space-y-4'>
                  {video.suggestedDescriptions.map((suggestion, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedDescription === suggestion.description
                          ? 'ring-primary ring-2'
                          : ''
                      }`}
                      onClick={() =>
                        setSelectedDescription(suggestion.description)
                      }
                    >
                      <CardContent className='p-4'>
                        <div className='flex items-start justify-between gap-4'>
                          <div className='flex-1'>
                            <div className='mb-2 flex items-center gap-2'>
                              <Badge
                                variant={index === 0 ? 'default' : 'secondary'}
                              >
                                Score: {suggestion.score}
                              </Badge>
                              <Badge variant='outline' className='gap-1'>
                                <TrendingUp className='h-3 w-3' />+
                                {suggestion.viralityIncrease}% viral
                              </Badge>
                              <Badge variant='outline' className='gap-1'>
                                <Eye className='h-3 w-3' />+
                                {suggestion.seoImprovement}% SEO
                              </Badge>
                            </div>
                            <div className='bg-muted/50 mb-2 rounded-md p-3'>
                              <p className='line-clamp-4 text-sm whitespace-pre-line'>
                                {suggestion.description}
                              </p>
                            </div>
                            <p className='text-muted-foreground text-sm'>
                              {suggestion.reasoning}
                            </p>
                          </div>
                          <Button
                            variant='ghost'
                            size='sm'
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

                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <CheckCircle className='h-5 w-5 text-green-600' />
                      Selected Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={selectedDescription}
                      onChange={(e) => setSelectedDescription(e.target.value)}
                      rows={8}
                      className='mb-4'
                    />
                    <div className='flex gap-2'>
                      <Button className='gap-2'>
                        <Youtube className='h-4 w-4' />
                        Update on YouTube
                      </Button>
                      <Button
                        variant='outline'
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
              <TabsContent value='tags' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Optimized Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-4 flex flex-wrap gap-2'>
                      {video.tags.map((tag, index) => (
                        <Badge key={index} variant='outline' className='gap-1'>
                          {tag}
                          <Button
                            variant='ghost'
                            size='sm'
                            className='ml-1 h-auto p-0'
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
                      className='gap-2'
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
  );
}
