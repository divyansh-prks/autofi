'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Sparkles, Copy, Loader2, TrendingUp } from 'lucide-react';

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

export default function TitleHumePage() {
  const [inputText, setInputText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

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
            Title Generator
          </h1>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            Generate trending YouTube titles from your content and keywords
          </p>
        </div>

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
                  {inputText.length > 0 ? '✓ Content added' : 'Optional field'}
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

        {/* Results Section */}
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

        {/* Usage Instructions */}
        <Card className='mt-8 border-0 bg-white/50 shadow-lg backdrop-blur-sm dark:bg-gray-900/50'>
          <CardHeader>
            <CardTitle className='text-lg text-gray-800 dark:text-gray-200'>
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <h4 className='font-semibold text-purple-600 dark:text-purple-400'>
                  📝 Input Text (Optional)
                </h4>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Add your video content, script, or description to provide
                  context for better title generation.
                </p>
              </div>
              <div className='space-y-2'>
                <h4 className='font-semibold text-purple-600 dark:text-purple-400'>
                  🔑 Keywords (Required)
                </h4>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Enter relevant keywords separated by commas or new lines.
                  These will be used to search for trending titles.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
