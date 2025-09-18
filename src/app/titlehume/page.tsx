'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Search,
  Sparkles,
  Copy,
  Loader2,
  TrendingUp,
  Wand2,
  Target
} from 'lucide-react';

interface SearchResult {
  success: boolean;
  totalKeywordsReceived: number;
  totalKeywordsSearched: number;
  totalTitlesFound: number;
  searchedKeywords: string[];
  finalTitles: string[];
  error?: string;
  message?: string;
}

interface OptimizedContent {
  title: string;
  description: string;
  tags: string[];
  reasoning: string;
  estimatedCTR: string;
  targetAudience: string;
}

interface OptimizedResult {
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
  error?: string;
}

export default function TitleHumePage() {
  const [inputText, setInputText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [optimizedResults, setOptimizedResults] =
    useState<OptimizedResult | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'generate' | 'optimize'>(
    'generate'
  );

  const handleGenerate = async () => {
    // Basic validation
    if (!inputText.trim() && !keywords.trim()) {
      toast.error('Please enter either input text or keywords');
      return;
    }

    if (keywords.trim().length < 3) {
      toast.error('Please enter at least 3 characters for keywords');
      return;
    }

    setIsGenerating(true);
    setResults(null);

    try {
      // Parse keywords from input (comma-separated or line-separated)
      const keywordArray = keywords
        .split(/[,\n]/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      if (keywordArray.length === 0) {
        toast.error('Please enter valid keywords');
        setIsGenerating(false);
        return;
      }

      // Make request to the backend API
      const response = await fetch('/api/search-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          keywords: keywordArray,
          inputText: inputText.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate titles');
      }

      setResults(data);
      toast.success(
        `Successfully found ${data.totalTitlesFound} trending titles!`
      );
    } catch (error) {
      console.error('Error generating titles:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate titles'
      );
      setResults({
        success: false,
        error: 'Failed to generate titles',
        message: error instanceof Error ? error.message : 'Unknown error',
        totalKeywordsReceived: 0,
        totalKeywordsSearched: 0,
        totalTitlesFound: 0,
        searchedKeywords: [],
        finalTitles: []
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimize = async () => {
    // Validation
    if (!promptText.trim()) {
      toast.error('Please enter a prompt text for optimization');
      return;
    }

    if (promptText.trim().length < 10) {
      toast.error('Please enter at least 10 characters for the prompt');
      return;
    }

    setIsOptimizing(true);
    setOptimizedResults(null);

    try {
      // Use generated titles if available, otherwise use the input text as transcript
      const transcriptText = promptText.trim();
      const finalTitles = results?.finalTitles || [];

      const response = await fetch('/api/generate-optimized-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcriptText,
          finalTitles: finalTitles.length > 0 ? finalTitles : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate optimized content');
      }

      setOptimizedResults(data);
      toast.success('Successfully generated 4 SEO-optimized titles!');
    } catch (error) {
      console.error('Error optimizing content:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to optimize content'
      );
      setOptimizedResults({
        success: false,
        error: 'Failed to optimize content',
        message: error instanceof Error ? error.message : 'Unknown error',
        contentCategory: '',
        keyThemes: [],
        analyzedTitles: 0,
        transcriptLength: 0,
        trendingPatterns: {
          comebackTheme: false,
          motivationTheme: false,
          examTheme: false,
          emojiUsage: false,
          hashtagUsage: false,
          powerWords: []
        },
        optimizedContent: []
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTitle(text);
      toast.success('Title copied to clipboard!');
      setTimeout(() => setCopiedTitle(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy title');
    }
  };

  const copyAllTitles = async () => {
    if (!results?.finalTitles.length) return;

    const allTitles = results.finalTitles.join('\n');
    try {
      await navigator.clipboard.writeText(allTitles);
      setCopiedTitle('ALL_TITLES');
      toast.success('All titles copied to clipboard!');
      setTimeout(() => setCopiedTitle(null), 2000);
    } catch (err) {
      console.error('Failed to copy all titles: ', err);
      toast.error('Failed to copy all titles');
    }
  };

  const getKeywordsList = (): string[] => {
    return keywords
      .split(/[,\n]/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950'>
      <div className='mx-auto max-w-6xl'>
        {/* Header */}
        <div className='mb-8 text-center'>
          <h1 className='mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-4xl font-bold text-transparent'>
            <TrendingUp className='mr-3 inline-block h-10 w-10 text-purple-600' />
            YouTube Title & SEO Optimizer
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Generate trending titles and create SEO-optimized content for
            YouTube
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='mb-6 flex justify-center'>
          <div className='inline-flex rounded-lg bg-white/50 p-1 shadow-lg dark:bg-gray-800/50'>
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === 'generate'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400'
              }`}
            >
              <Search className='h-4 w-4' />
              Generate Titles
            </button>
            <button
              onClick={() => setActiveTab('optimize')}
              className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === 'optimize'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400'
              }`}
            >
              <Wand2 className='h-4 w-4' />
              SEO Optimize
            </button>
          </div>
        </div>

        {/* Generate Tab Content */}
        {activeTab === 'generate' && (
          <>
            {/* Main Form */}
            <Card className='mb-8 border-0 bg-white/70 shadow-xl backdrop-blur-sm dark:bg-gray-900/70'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-2xl'>
                  <Sparkles className='h-6 w-6 text-purple-600' />
                  Content & Keywords Input
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Input Text */}
                <div className='space-y-2'>
                  <label
                    htmlFor='inputText'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Input Text (Optional)
                  </label>
                  <Textarea
                    id='inputText'
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder='Enter your content, script, or any text context here... (optional)'
                    className='resize-vertical min-h-[120px] border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:focus:border-purple-400'
                    disabled={isGenerating}
                  />
                  <div className='flex justify-between text-sm text-gray-500 dark:text-gray-400'>
                    <span>{inputText.length} characters</span>
                    <span className='text-purple-600 dark:text-purple-400'>
                      {inputText.length > 0
                        ? '✓ Content added'
                        : 'Optional field'}
                    </span>
                  </div>
                </div>

                {/* Keywords Input */}
                <div className='space-y-2'>
                  <label
                    htmlFor='keywords'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Keywords (Required) *
                  </label>
                  <Textarea
                    id='keywords'
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder='Enter keywords separated by commas or new lines&#10;e.g., fitness, workout, gym, health&#10;or&#10;fitness&#10;workout&#10;gym&#10;health'
                    className='resize-vertical min-h-[100px] border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:focus:border-purple-400'
                    disabled={isGenerating}
                    required
                  />
                  <div className='flex justify-between text-sm text-gray-500 dark:text-gray-400'>
                    <span>{getKeywordsList().length} keywords</span>
                    <span className='text-purple-600 dark:text-purple-400'>
                      {getKeywordsList().length > 0
                        ? '✓ Keywords ready'
                        : 'Enter keywords to continue'}
                    </span>
                  </div>

                  {/* Keywords Preview */}
                  {getKeywordsList().length > 0 && (
                    <div className='mt-3'>
                      <p className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                        Keywords to search:
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {getKeywordsList()
                          .slice(0, 10)
                          .map((keyword, index) => (
                            <Badge
                              key={index}
                              variant='secondary'
                              className='bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            >
                              {keyword}
                            </Badge>
                          ))}
                        {getKeywordsList().length > 10 && (
                          <Badge
                            variant='outline'
                            className='border-purple-300 text-purple-600 dark:border-purple-600 dark:text-purple-400'
                          >
                            +{getKeywordsList().length - 10} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || getKeywordsList().length === 0}
                  className='h-12 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isGenerating ? (
                    <div className='flex items-center justify-center gap-2'>
                      <Loader2 className='h-5 w-5 animate-spin' />
                      Generating Titles...
                    </div>
                  ) : (
                    <div className='flex items-center justify-center gap-2'>
                      <Search className='h-5 w-5' />
                      Generate Trending Titles
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section for Generate Tab */}
            {results && (
              <Card className='border-0 bg-white/70 shadow-xl backdrop-blur-sm dark:bg-gray-900/70'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-2xl'>
                    <TrendingUp className='h-6 w-6 text-green-600' />
                    {results.success ? 'Generated Results' : 'Error'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {results.success ? (
                    <div className='space-y-6'>
                      {/* Stats */}
                      <div className='grid gap-4 md:grid-cols-3'>
                        <div className='rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-4 text-center dark:from-blue-950 dark:to-cyan-950'>
                          <div className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                            {results.totalKeywordsSearched}
                          </div>
                          <div className='text-sm text-blue-700 dark:text-blue-300'>
                            Keywords Searched
                          </div>
                        </div>
                        <div className='rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-center dark:from-green-950 dark:to-emerald-950'>
                          <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                            {results.totalTitlesFound}
                          </div>
                          <div className='text-sm text-green-700 dark:text-green-300'>
                            Titles Found
                          </div>
                        </div>
                        <div className='rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 text-center dark:from-purple-950 dark:to-pink-950'>
                          <div className='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                            {results.searchedKeywords.length}
                          </div>
                          <div className='text-sm text-purple-700 dark:text-purple-300'>
                            Valid Keywords
                          </div>
                        </div>
                      </div>

                      {/* Searched Keywords */}
                      {results.searchedKeywords.length > 0 && (
                        <div>
                          <h3 className='mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200'>
                            Searched Keywords
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {results.searchedKeywords.map((keyword, index) => (
                              <Badge
                                key={index}
                                variant='outline'
                                className='border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300'
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Generated Titles */}
                      {results.finalTitles.length > 0 && (
                        <div>
                          <div className='mb-4 flex items-center justify-between'>
                            <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
                              Trending Video Titles
                            </h3>
                            <Button
                              onClick={copyAllTitles}
                              variant='outline'
                              size='sm'
                              className='border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                            >
                              <Copy className='mr-2 h-4 w-4' />
                              {copiedTitle === 'ALL_TITLES'
                                ? '✓ Copied All!'
                                : 'Copy All Titles'}
                            </Button>
                          </div>

                          <div className='max-h-96 space-y-3 overflow-y-auto rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50'>
                            {results.finalTitles.map((title, index) => (
                              <div
                                key={index}
                                className='group flex items-start justify-between rounded-lg bg-white p-4 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700'
                              >
                                <div className='flex-1 pr-4'>
                                  <p className='leading-relaxed font-medium text-gray-800 dark:text-gray-200'>
                                    {title}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => copyToClipboard(title)}
                                  size='sm'
                                  variant='ghost'
                                  className='bg-gradient-to-r from-purple-500 to-pink-600 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:from-purple-600 hover:to-pink-700'
                                >
                                  <Copy className='mr-1 h-4 w-4' />
                                  {copiedTitle === title ? '✓' : 'Copy'}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Error State
                    <div className='rounded-lg border border-red-300 bg-red-50 p-6 text-center dark:border-red-600 dark:bg-red-950/50'>
                      <div className='mb-2 text-red-600 dark:text-red-400'>
                        <svg
                          className='mx-auto h-12 w-12'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      </div>
                      <h3 className='mb-2 text-lg font-semibold text-red-800 dark:text-red-200'>
                        Generation Failed
                      </h3>
                      <p className='text-red-700 dark:text-red-300'>
                        {results.error}
                      </p>
                      {results.message && (
                        <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                          {results.message}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Optimize Tab Content */}
        {activeTab === 'optimize' && (
          <>
            {/* Optimization Form */}
            <Card className='mb-8 border-0 bg-white/70 shadow-xl backdrop-blur-sm dark:bg-gray-900/70'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-2xl'>
                  <Wand2 className='h-6 w-6 text-purple-600' />
                  SEO Content Optimizer
                </CardTitle>
                <p className='text-gray-600 dark:text-gray-400'>
                  Transform your content into 4 SEO-optimized YouTube titles and
                  descriptions
                </p>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Prompt Text Input */}
                <div className='space-y-2'>
                  <label
                    htmlFor='promptText'
                    className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                  >
                    Content Description / Prompt (Required) *
                  </label>
                  <Textarea
                    id='promptText'
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder='Describe your video content, topic, or provide a transcript...&#10;&#10;Example: "This video is about study tips for NEET students. I share my daily routine, motivation strategies, and how I overcame failure to achieve success."'
                    className='resize-vertical min-h-[150px] border-gray-300 focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:focus:border-purple-400'
                    disabled={isOptimizing}
                    required
                  />
                  <div className='flex justify-between text-sm text-gray-500 dark:text-gray-400'>
                    <span>{promptText.length} characters</span>
                    <span className='text-purple-600 dark:text-purple-400'>
                      {promptText.length >= 10
                        ? '✓ Prompt ready'
                        : 'At least 10 characters required'}
                    </span>
                  </div>
                </div>

                {/* Generated Titles Integration Notice */}
                {results?.finalTitles && results.finalTitles.length > 0 && (
                  <div className='rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:border-green-800 dark:from-green-950 dark:to-emerald-950'>
                    <div className='mb-2 flex items-center gap-2'>
                      <TrendingUp className='h-5 w-5 text-green-600' />
                      <h4 className='font-semibold text-green-800 dark:text-green-200'>
                        Using Generated Titles for Analysis
                      </h4>
                    </div>
                    <p className='text-sm text-green-700 dark:text-green-300'>
                      The optimizer will analyze your{' '}
                      {results.finalTitles.length} generated titles to create
                      SEO-optimized content that matches trending patterns.
                    </p>
                  </div>
                )}

                {/* Optimize Button */}
                <Button
                  onClick={handleOptimize}
                  disabled={isOptimizing || promptText.trim().length < 10}
                  className='h-12 w-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isOptimizing ? (
                    <div className='flex items-center justify-center gap-2'>
                      <Loader2 className='h-5 w-5 animate-spin' />
                      Optimizing Content...
                    </div>
                  ) : (
                    <div className='flex items-center justify-center gap-2'>
                      <Target className='h-5 w-5' />
                      Generate SEO-Optimized Titles
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Optimized Results Section */}
            {optimizedResults && (
              <Card className='border-0 bg-white/70 shadow-xl backdrop-blur-sm dark:bg-gray-900/70'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-2xl'>
                    <Target className='h-6 w-6 text-green-600' />
                    {optimizedResults.success
                      ? 'SEO-Optimized Content'
                      : 'Optimization Error'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {optimizedResults.success ? (
                    <div className='space-y-8'>
                      {/* Analysis Overview */}
                      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        <div className='rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-4 text-center dark:from-blue-950 dark:to-cyan-950'>
                          <div className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                            {optimizedResults.contentCategory.toUpperCase()}
                          </div>
                          <div className='text-sm text-blue-700 dark:text-blue-300'>
                            Content Category
                          </div>
                        </div>
                        <div className='rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-center dark:from-green-950 dark:to-emerald-950'>
                          <div className='text-lg font-bold text-green-600 dark:text-green-400'>
                            {optimizedResults.analyzedTitles}
                          </div>
                          <div className='text-sm text-green-700 dark:text-green-300'>
                            Titles Analyzed
                          </div>
                        </div>
                        <div className='rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4 text-center dark:from-purple-950 dark:to-pink-950'>
                          <div className='text-lg font-bold text-purple-600 dark:text-purple-400'>
                            {optimizedResults.keyThemes.length}
                          </div>
                          <div className='text-sm text-purple-700 dark:text-purple-300'>
                            Key Themes
                          </div>
                        </div>
                        <div className='rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50 p-4 text-center dark:from-orange-950 dark:to-yellow-950'>
                          <div className='text-lg font-bold text-orange-600 dark:text-orange-400'>
                            4
                          </div>
                          <div className='text-sm text-orange-700 dark:text-orange-300'>
                            SEO Titles
                          </div>
                        </div>
                      </div>

                      {/* Key Themes */}
                      {optimizedResults.keyThemes.length > 0 && (
                        <div>
                          <h3 className='mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200'>
                            Detected Key Themes
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {optimizedResults.keyThemes.map((theme, index) => (
                              <Badge
                                key={index}
                                className='bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              >
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trending Patterns */}
                      <div>
                        <h3 className='mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200'>
                          Trending Patterns Detected
                        </h3>
                        <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
                          {optimizedResults.trendingPatterns.comebackTheme && (
                            <div className='flex items-center gap-2 rounded-lg bg-green-50 p-3 dark:bg-green-950'>
                              <div className='h-2 w-2 rounded-full bg-green-500'></div>
                              <span className='text-sm font-medium text-green-700 dark:text-green-300'>
                                Comeback Theme
                              </span>
                            </div>
                          )}
                          {optimizedResults.trendingPatterns
                            .motivationTheme && (
                            <div className='flex items-center gap-2 rounded-lg bg-purple-50 p-3 dark:bg-purple-950'>
                              <div className='h-2 w-2 rounded-full bg-purple-500'></div>
                              <span className='text-sm font-medium text-purple-700 dark:text-purple-300'>
                                Motivation Theme
                              </span>
                            </div>
                          )}
                          {optimizedResults.trendingPatterns.examTheme && (
                            <div className='flex items-center gap-2 rounded-lg bg-blue-50 p-3 dark:bg-blue-950'>
                              <div className='h-2 w-2 rounded-full bg-blue-500'></div>
                              <span className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                                Exam Theme
                              </span>
                            </div>
                          )}
                          {optimizedResults.trendingPatterns.emojiUsage && (
                            <div className='flex items-center gap-2 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-950'>
                              <div className='h-2 w-2 rounded-full bg-yellow-500'></div>
                              <span className='text-sm font-medium text-yellow-700 dark:text-yellow-300'>
                                Emoji Usage
                              </span>
                            </div>
                          )}
                          {optimizedResults.trendingPatterns.hashtagUsage && (
                            <div className='flex items-center gap-2 rounded-lg bg-pink-50 p-3 dark:bg-pink-950'>
                              <div className='h-2 w-2 rounded-full bg-pink-500'></div>
                              <span className='text-sm font-medium text-pink-700 dark:text-pink-300'>
                                Hashtag Usage
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* SEO-Optimized Content */}
                      <div>
                        <h3 className='mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200'>
                          4 SEO-Optimized YouTube Titles & Descriptions
                        </h3>
                        <div className='space-y-6'>
                          {optimizedResults.optimizedContent.map(
                            (content, index) => (
                              <Card
                                key={index}
                                className='border-l-4 border-l-purple-500 shadow-md'
                              >
                                <CardHeader className='pb-3'>
                                  <div className='flex items-start justify-between'>
                                    <div className='flex-1'>
                                      <div className='mb-2 flex items-center gap-2'>
                                        <Badge className='bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'>
                                          Option {index + 1}
                                        </Badge>
                                        <Badge
                                          variant='outline'
                                          className='border-green-300 text-green-700 dark:border-green-600 dark:text-green-300'
                                        >
                                          CTR: {content.estimatedCTR}
                                        </Badge>
                                      </div>
                                      <h4 className='text-lg leading-tight font-bold text-gray-800 dark:text-gray-200'>
                                        {content.title}
                                      </h4>
                                    </div>
                                    <Button
                                      onClick={() =>
                                        copyToClipboard(content.title)
                                      }
                                      size='sm'
                                      variant='ghost'
                                      className='ml-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                                    >
                                      <Copy className='mr-1 h-4 w-4' />
                                      {copiedTitle === content.title
                                        ? '✓'
                                        : 'Copy Title'}
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                  {/* Description */}
                                  <div>
                                    <h5 className='mb-2 font-semibold text-gray-700 dark:text-gray-300'>
                                      Description:
                                    </h5>
                                    <div className='max-h-32 overflow-y-auto rounded-lg bg-gray-50 p-3 dark:bg-gray-800'>
                                      <pre className='font-sans text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300'>
                                        {content.description}
                                      </pre>
                                    </div>
                                    <Button
                                      onClick={() =>
                                        copyToClipboard(content.description)
                                      }
                                      size='sm'
                                      variant='outline'
                                      className='mt-2'
                                    >
                                      <Copy className='mr-1 h-4 w-4' />
                                      Copy Description
                                    </Button>
                                  </div>

                                  {/* Tags */}
                                  <div>
                                    <h5 className='mb-2 font-semibold text-gray-700 dark:text-gray-300'>
                                      Tags:
                                    </h5>
                                    <div className='flex flex-wrap gap-2'>
                                      {content.tags
                                        .slice(0, 8)
                                        .map((tag, tagIndex) => (
                                          <Badge
                                            key={tagIndex}
                                            variant='secondary'
                                            className='bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                          >
                                            {tag}
                                          </Badge>
                                        ))}
                                      {content.tags.length > 8 && (
                                        <Badge
                                          variant='outline'
                                          className='border-blue-300 text-blue-600 dark:border-blue-600 dark:text-blue-400'
                                        >
                                          +{content.tags.length - 8} more
                                        </Badge>
                                      )}
                                    </div>
                                    <Button
                                      onClick={() =>
                                        copyToClipboard(content.tags.join(', '))
                                      }
                                      size='sm'
                                      variant='outline'
                                      className='mt-2'
                                    >
                                      <Copy className='mr-1 h-4 w-4' />
                                      Copy All Tags
                                    </Button>
                                  </div>

                                  {/* Target Audience & Reasoning */}
                                  <div className='grid gap-4 md:grid-cols-2'>
                                    <div>
                                      <h5 className='mb-2 font-semibold text-gray-700 dark:text-gray-300'>
                                        Target Audience:
                                      </h5>
                                      <p className='rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400'>
                                        {content.targetAudience}
                                      </p>
                                    </div>
                                    <div>
                                      <h5 className='mb-2 font-semibold text-gray-700 dark:text-gray-300'>
                                        Strategy Reasoning:
                                      </h5>
                                      <p className='rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400'>
                                        {content.reasoning}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Copy Everything Button */}
                                  <Button
                                    onClick={() =>
                                      copyToClipboard(
                                        `Title: ${content.title}\n\nDescription:\n${content.description}\n\nTags: ${content.tags.join(', ')}`
                                      )
                                    }
                                    variant='outline'
                                    className='w-full border-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                                  >
                                    <Copy className='mr-2 h-4 w-4' />
                                    Copy Complete Package
                                  </Button>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Error State for Optimization
                    <div className='rounded-lg border border-red-300 bg-red-50 p-6 text-center dark:border-red-600 dark:bg-red-950/50'>
                      <div className='mb-2 text-red-600 dark:text-red-400'>
                        <svg
                          className='mx-auto h-12 w-12'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      </div>
                      <h3 className='mb-2 text-lg font-semibold text-red-800 dark:text-red-200'>
                        Optimization Failed
                      </h3>
                      <p className='text-red-700 dark:text-red-300'>
                        {optimizedResults.error}
                      </p>
                      {optimizedResults.message && (
                        <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                          {optimizedResults.message}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Usage Instructions */}
        <Card className='mt-8 border-0 bg-white/50 shadow-lg backdrop-blur-sm dark:bg-gray-900/50'>
          <CardHeader>
            <CardTitle className='text-lg text-gray-800 dark:text-gray-200'>
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-purple-600 dark:text-purple-400'>
                    📝 Generate Tab
                  </h4>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Enter keywords to find trending YouTube titles. Optionally
                    add content context for better results.
                  </p>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-purple-600 dark:text-purple-400'>
                    🔑 Keywords (Required)
                  </h4>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Enter relevant keywords separated by commas or new lines.
                  </p>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-orange-600 dark:text-orange-400'>
                    🎯 Optimize Tab
                  </h4>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Create 4 SEO-optimized titles and descriptions. Works best
                    after generating titles first.
                  </p>
                </div>
                <div className='space-y-2'>
                  <h4 className='font-semibold text-orange-600 dark:text-orange-400'>
                    ✨ Content Prompt
                  </h4>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Describe your video content, topic, or provide a transcript
                    for personalized optimization.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
