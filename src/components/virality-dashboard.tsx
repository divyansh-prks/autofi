'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  Eye,
  ThumbsUp,
  Share2,
  Clock,
  Users,
  Target,
  Zap,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface ViralityMetrics {
  viralityScore: number;
  seoScore: number;
  engagementPrediction: number;
  shareabilityScore: number;
  trendingPotential: number;
  audienceMatch: number;
  competitorComparison: {
    better: number;
    similar: number;
    worse: number;
  };
  keyFactors: Array<{
    factor: string;
    impact: 'high' | 'medium' | 'low';
    score: number;
    description: string;
  }>;
  predictions: {
    views24h: string;
    views7d: string;
    views30d: string;
    peakTime: string;
    plateauTime: string;
  };
}

interface ViralityDashboardProps {
  metrics: ViralityMetrics;
  originalMetrics?: ViralityMetrics;
}

export function ViralityDashboard({
  metrics,
  originalMetrics
}: ViralityDashboardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return (
        <Badge className='border-green-200 bg-green-100 text-green-800'>
          Excellent
        </Badge>
      );
    if (score >= 60)
      return (
        <Badge className='border-yellow-200 bg-yellow-100 text-yellow-800'>
          Good
        </Badge>
      );
    return (
      <Badge className='border-red-200 bg-red-100 text-red-800'>
        Needs Work
      </Badge>
    );
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <ArrowUp className='h-4 w-4 text-green-600' />;
      case 'medium':
        return <Minus className='h-4 w-4 text-yellow-600' />;
      case 'low':
        return <ArrowDown className='h-4 w-4 text-red-600' />;
      default:
        return <Minus className='h-4 w-4 text-gray-600' />;
    }
  };

  const calculateImprovement = (current: number, original?: number) => {
    if (!original) return null;
    const improvement = current - original;
    const percentage = Math.round((improvement / original) * 100);
    return { improvement, percentage };
  };

  return (
    <div className='space-y-6'>
      {/* Main Scores */}
      <div className='grid gap-6 md:grid-cols-3'>
        <Card className='border-l-primary border-l-4'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <TrendingUp className='text-primary h-5 w-5' />
              Virality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span
                  className={`text-4xl font-bold ${getScoreColor(metrics.viralityScore)}`}
                >
                  {metrics.viralityScore}
                </span>
                {getScoreBadge(metrics.viralityScore)}
              </div>
              <Progress value={metrics.viralityScore} className='h-3' />
              {originalMetrics && (
                <div className='flex items-center gap-2 text-sm'>
                  {(() => {
                    const improvement = calculateImprovement(
                      metrics.viralityScore,
                      originalMetrics.viralityScore
                    );
                    return improvement && improvement.percentage > 0 ? (
                      <>
                        <ArrowUp className='h-4 w-4 text-green-600' />
                        <span className='text-green-600'>
                          +{improvement.percentage}% improvement
                        </span>
                      </>
                    ) : null;
                  })()}
                </div>
              )}
              <p className='text-muted-foreground text-sm'>
                Likelihood of content going viral based on trending patterns
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className='border-l-4 border-l-green-500'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Eye className='h-5 w-5 text-green-600' />
              SEO Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span
                  className={`text-4xl font-bold ${getScoreColor(metrics.seoScore)}`}
                >
                  {metrics.seoScore}
                </span>
                {getScoreBadge(metrics.seoScore)}
              </div>
              <Progress value={metrics.seoScore} className='h-3' />
              {originalMetrics && (
                <div className='flex items-center gap-2 text-sm'>
                  {(() => {
                    const improvement = calculateImprovement(
                      metrics.seoScore,
                      originalMetrics.seoScore
                    );
                    return improvement && improvement.percentage > 0 ? (
                      <>
                        <ArrowUp className='h-4 w-4 text-green-600' />
                        <span className='text-green-600'>
                          +{improvement.percentage}% improvement
                        </span>
                      </>
                    ) : null;
                  })()}
                </div>
              )}
              <p className='text-muted-foreground text-sm'>
                Search optimization and discoverability potential
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className='border-l-4 border-l-blue-500'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <ThumbsUp className='h-5 w-5 text-blue-600' />
              Engagement Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span
                  className={`text-4xl font-bold ${getScoreColor(metrics.engagementPrediction)}`}
                >
                  {metrics.engagementPrediction}
                </span>
                {getScoreBadge(metrics.engagementPrediction)}
              </div>
              <Progress value={metrics.engagementPrediction} className='h-3' />
              {originalMetrics && (
                <div className='flex items-center gap-2 text-sm'>
                  {(() => {
                    const improvement = calculateImprovement(
                      metrics.engagementPrediction,
                      originalMetrics.engagementPrediction
                    );
                    return improvement && improvement.percentage > 0 ? (
                      <>
                        <ArrowUp className='h-4 w-4 text-green-600' />
                        <span className='text-green-600'>
                          +{improvement.percentage}% improvement
                        </span>
                      </>
                    ) : null;
                  })()}
                </div>
              )}
              <p className='text-muted-foreground text-sm'>
                Expected likes, comments, and interaction rates
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className='grid gap-6 md:grid-cols-3'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <Share2 className='h-8 w-8 rounded-lg bg-purple-100 p-2 text-purple-600' />
              <div>
                <p className='text-2xl font-bold'>
                  {metrics.shareabilityScore}
                </p>
                <p className='text-muted-foreground text-sm'>Shareability</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <Zap className='h-8 w-8 rounded-lg bg-orange-100 p-2 text-orange-600' />
              <div>
                <p className='text-2xl font-bold'>
                  {metrics.trendingPotential}
                </p>
                <p className='text-muted-foreground text-sm'>
                  Trending Potential
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <Target className='h-8 w-8 rounded-lg bg-pink-100 p-2 text-pink-600' />
              <div>
                <p className='text-2xl font-bold'>{metrics.audienceMatch}</p>
                <p className='text-muted-foreground text-sm'>Audience Match</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            Performance Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
            <div className='bg-muted/50 rounded-lg p-4 text-center'>
              <Clock className='text-primary mx-auto mb-2 h-6 w-6' />
              <p className='text-2xl font-bold'>
                {metrics.predictions.views24h}
              </p>
              <p className='text-muted-foreground text-sm'>24 Hours</p>
            </div>
            <div className='bg-muted/50 rounded-lg p-4 text-center'>
              <Eye className='mx-auto mb-2 h-6 w-6 text-green-600' />
              <p className='text-2xl font-bold'>
                {metrics.predictions.views7d}
              </p>
              <p className='text-muted-foreground text-sm'>7 Days</p>
            </div>
            <div className='bg-muted/50 rounded-lg p-4 text-center'>
              <TrendingUp className='mx-auto mb-2 h-6 w-6 text-blue-600' />
              <p className='text-2xl font-bold'>
                {metrics.predictions.views30d}
              </p>
              <p className='text-muted-foreground text-sm'>30 Days</p>
            </div>
            <div className='bg-muted/50 rounded-lg p-4 text-center'>
              <Zap className='mx-auto mb-2 h-6 w-6 text-orange-600' />
              <p className='text-lg font-bold'>
                {metrics.predictions.peakTime}
              </p>
              <p className='text-muted-foreground text-sm'>Peak Time</p>
            </div>
            <div className='bg-muted/50 rounded-lg p-4 text-center'>
              <Users className='mx-auto mb-2 h-6 w-6 text-purple-600' />
              <p className='text-lg font-bold'>
                {metrics.predictions.plateauTime}
              </p>
              <p className='text-muted-foreground text-sm'>Plateau</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Factors */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Target className='h-5 w-5' />
            Key Success Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {metrics.keyFactors.map((factor, index) => (
              <div
                key={index}
                className='bg-muted/30 flex items-center justify-between rounded-lg p-4'
              >
                <div className='flex items-center gap-3'>
                  {getImpactIcon(factor.impact)}
                  <div>
                    <p className='font-medium'>{factor.factor}</p>
                    <p className='text-muted-foreground text-sm'>
                      {factor.description}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-2xl font-bold'>{factor.score}</p>
                  <Badge
                    variant={
                      factor.impact === 'high'
                        ? 'default'
                        : factor.impact === 'medium'
                          ? 'secondary'
                          : 'outline'
                    }
                  >
                    {factor.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <BarChart3 className='h-5 w-5' />
            Competitor Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='rounded-lg border border-green-200 bg-green-50 p-4 text-center'>
              <p className='text-3xl font-bold text-green-600'>
                {metrics.competitorComparison.better}
              </p>
              <p className='text-sm text-green-700'>Better Than</p>
              <p className='text-muted-foreground text-xs'>competitors</p>
            </div>
            <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center'>
              <p className='text-3xl font-bold text-yellow-600'>
                {metrics.competitorComparison.similar}
              </p>
              <p className='text-sm text-yellow-700'>Similar To</p>
              <p className='text-muted-foreground text-xs'>competitors</p>
            </div>
            <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-center'>
              <p className='text-3xl font-bold text-red-600'>
                {metrics.competitorComparison.worse}
              </p>
              <p className='text-sm text-red-700'>Behind</p>
              <p className='text-muted-foreground text-xs'>competitors</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
