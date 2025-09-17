'use client';

import { useState } from 'react';

interface SearchResult {
  success: boolean;
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
  targetKeywords: string[];
  estimatedCTR: string;
  reasoning: string;
}

interface OptimizedResult {
  success: boolean;
  contentCategory: string;
  analyzedTitles: number;
  transcriptLength: number;
  optimizedContent: OptimizedContent[];
  analysis: {
    mainTopics: string[];
    titlePatterns: any;
  };
  error?: string;
  message?: string;
}

export default function TitleSearchPage() {
  const [keywords, setKeywords] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [optimizedResults, setOptimizedResults] =
    useState<OptimizedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'optimize'>('search');

  const handleSearch = async () => {
    if (!keywords.trim()) {
      alert('Please enter some keywords');
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const keywordArray = keywords
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      const response = await fetch('/api/search-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ keywords: keywordArray })
      });

      const data = await response.json();
      setResults(data);

      // Automatically switch to optimize tab if we have results
      if (data.success && data.finalTitles.length > 0) {
        setActiveTab('optimize');
      }
    } catch (error) {
      console.error('Error searching titles:', error);
      setResults({
        success: false,
        error: 'Failed to search titles',
        message: error instanceof Error ? error.message : 'Unknown error',
        totalKeywordsSearched: 0,
        totalTitlesFound: 0,
        searchedKeywords: [],
        finalTitles: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!transcriptText.trim()) {
      alert('Please enter your transcript text');
      return;
    }

    if (!results?.finalTitles?.length) {
      alert('Please search for trending titles first');
      return;
    }

    setOptimizing(true);
    setOptimizedResults(null);

    try {
      const response = await fetch('/api/generate-optimized-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcriptText,
          finalTitles: results.finalTitles
        })
      });

      const data = await response.json();
      setOptimizedResults(data);
    } catch (error) {
      console.error('Error optimizing content:', error);
      setOptimizedResults({
        success: false,
        error: 'Failed to optimize content',
        message: error instanceof Error ? error.message : 'Unknown error',
        contentCategory: '',
        analyzedTitles: 0,
        transcriptLength: 0,
        optimizedContent: [],
        analysis: { mainTopics: [], titlePatterns: {} }
      });
    } finally {
      setOptimizing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTitle(text);
      setTimeout(() => setCopiedTitle(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyAllTitles = async () => {
    if (!results?.finalTitles.length) return;

    const allTitles = results.finalTitles.join('\n');
    try {
      await navigator.clipboard.writeText(allTitles);
      setCopiedTitle('ALL_TITLES');
      setTimeout(() => setCopiedTitle(null), 2000);
    } catch (err) {
      console.error('Failed to copy all titles: ', err);
    }
  };

  const copyOptimizedContent = async (content: OptimizedContent) => {
    const fullContent = `TITLE: ${content.title}\n\nDESCRIPTION:\n${content.description}\n\nTARGET KEYWORDS: ${content.targetKeywords.join(', ')}`;
    try {
      await navigator.clipboard.writeText(fullContent);
      setCopiedTitle(content.title);
      setTimeout(() => setCopiedTitle(null), 2000);
    } catch (err) {
      console.error('Failed to copy content: ', err);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8 text-center'>
          <h1 className='mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-4xl font-bold text-transparent'>
            YouTube SEO Optimizer
          </h1>
          <p className='text-lg text-gray-600'>
            Search trending titles and generate optimized content for maximum
            reach
          </p>
        </div>

        {/* Tab Navigation */}
        <div className='mb-8 flex rounded-xl bg-white p-2 shadow-lg'>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 rounded-lg px-6 py-3 font-semibold transition-all duration-200 ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            1. Search Trending Titles
          </button>
          <button
            onClick={() => setActiveTab('optimize')}
            className={`flex-1 rounded-lg px-6 py-3 font-semibold transition-all duration-200 ${
              activeTab === 'optimize'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            disabled={!results?.finalTitles?.length}
          >
            2. Generate Optimized Content
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className='mb-8 rounded-2xl bg-white p-6 shadow-xl'>
            <div className='mb-4'>
              <label
                htmlFor='keywords'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                Keywords (comma separated)
              </label>
              <textarea
                id='keywords'
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder='e.g., fitness, workout, gym, health'
                className='w-full resize-none rounded-lg border border-gray-300 p-4 focus:border-transparent focus:ring-2 focus:ring-pink-500'
                rows={3}
                disabled={loading}
              />
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !keywords.trim()}
              className='w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-pink-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {loading ? (
                <div className='flex items-center justify-center'>
                  <svg
                    className='mr-3 -ml-1 h-5 w-5 animate-spin text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Searching YouTube...
                </div>
              ) : (
                'Search Trending Titles'
              )}
            </button>

            {/* Search Results */}
            {results && (
              <div className='mt-8'>
                {results.success ? (
                  <>
                    <div className='mb-6 flex items-center justify-between'>
                      <h2 className='text-2xl font-bold text-gray-800'>
                        Search Results
                      </h2>
                      {results.finalTitles.length > 0 && (
                        <button
                          onClick={copyAllTitles}
                          className='rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-green-600 hover:to-emerald-700'
                        >
                          {copiedTitle === 'ALL_TITLES'
                            ? '✓ Copied All!'
                            : 'Copy All Titles'}
                        </button>
                      )}
                    </div>

                    <div className='mb-6 grid gap-6 md:grid-cols-2'>
                      <div className='rounded-lg bg-gradient-to-r from-pink-100 to-purple-100 p-4'>
                        <h3 className='mb-2 font-semibold text-gray-700'>
                          Keywords Searched
                        </h3>
                        <p className='text-2xl font-bold text-pink-600'>
                          {results.totalKeywordsSearched}
                        </p>
                      </div>

                      <div className='rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 p-4'>
                        <h3 className='mb-2 font-semibold text-gray-700'>
                          Titles Found
                        </h3>
                        <p className='text-2xl font-bold text-purple-600'>
                          {results.totalTitlesFound}
                        </p>
                      </div>
                    </div>

                    {results.finalTitles.length > 0 && (
                      <div>
                        <div className='mb-4 flex items-center justify-between'>
                          <h3 className='text-xl font-semibold text-gray-800'>
                            Trending Video Titles
                          </h3>
                          <button
                            onClick={() => setActiveTab('optimize')}
                            className='rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:from-purple-600 hover:to-pink-700'
                          >
                            Next: Generate Optimized Content →
                          </button>
                        </div>
                        <div className='custom-scrollbar max-h-96 space-y-3 overflow-y-auto'>
                          {results.finalTitles.map((title, index) => (
                            <div
                              key={index}
                              className='group flex items-start justify-between rounded-lg bg-gray-50 p-4 transition-colors duration-200 hover:bg-gray-100'
                            >
                              <div className='flex-1 pr-4'>
                                <p className='leading-relaxed font-medium text-gray-800'>
                                  {title}
                                </p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(title)}
                                className='rounded-md bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 text-sm font-medium text-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:from-pink-600 hover:to-purple-700'
                              >
                                {copiedTitle === title ? '✓' : 'Copy'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className='py-8 text-center'>
                    <div className='rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700'>
                      <h3 className='font-bold'>Error</h3>
                      <p>{results.error}</p>
                      {results.message && (
                        <p className='mt-1 text-sm'>{results.message}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Optimize Tab */}
        {activeTab === 'optimize' && (
          <div className='rounded-2xl bg-white p-6 shadow-xl'>
            <div className='mb-6'>
              <label
                htmlFor='transcript'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                Your Video Transcript or Content
              </label>
              <textarea
                id='transcript'
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
                placeholder='Paste your video transcript, script, or content here. The AI will analyze it along with the trending titles to generate 4 optimized titles and descriptions...'
                className='w-full resize-none rounded-lg border border-gray-300 p-4 focus:border-transparent focus:ring-2 focus:ring-pink-500'
                rows={8}
                disabled={optimizing}
              />
              <div className='mt-2 flex justify-between text-sm text-gray-500'>
                <span>{transcriptText.length} characters</span>
                <span className='text-purple-600'>
                  {transcriptText.length >= 50
                    ? '✓ Ready for optimization'
                    : 'Need at least 50 characters'}
                </span>
              </div>
            </div>

            <button
              onClick={handleOptimize}
              disabled={
                optimizing ||
                !transcriptText.trim() ||
                transcriptText.length < 50 ||
                !results?.finalTitles?.length
              }
              className='mb-6 w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:from-purple-600 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {optimizing ? (
                <div className='flex items-center justify-center'>
                  <svg
                    className='mr-3 -ml-1 h-5 w-5 animate-spin text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Generating Optimized Content...
                </div>
              ) : (
                'Generate 4 Optimized Titles & Descriptions'
              )}
            </button>

            {/* Optimized Results */}
            {optimizedResults && (
              <div>
                {optimizedResults.success ? (
                  <>
                    <div className='mb-6 rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4'>
                      <h3 className='mb-2 font-semibold text-green-800'>
                        Analysis Complete!
                      </h3>
                      <div className='grid gap-4 text-sm md:grid-cols-3'>
                        <div>
                          <span className='font-medium text-green-700'>
                            Content Category:
                          </span>
                          <span className='ml-2 capitalize'>
                            {optimizedResults.contentCategory}
                          </span>
                        </div>
                        <div>
                          <span className='font-medium text-green-700'>
                            Analyzed Titles:
                          </span>
                          <span className='ml-2'>
                            {optimizedResults.analyzedTitles}
                          </span>
                        </div>
                        <div>
                          <span className='font-medium text-green-700'>
                            Transcript Length:
                          </span>
                          <span className='ml-2'>
                            {optimizedResults.transcriptLength} chars
                          </span>
                        </div>
                      </div>
                    </div>

                    <h2 className='mb-6 text-2xl font-bold text-gray-800'>
                      4 Optimized Titles & Descriptions
                    </h2>

                    <div className='grid gap-6'>
                      {optimizedResults.optimizedContent.map(
                        (content, index) => (
                          <div
                            key={index}
                            className='rounded-xl border border-gray-200 p-6 transition-shadow duration-200 hover:shadow-lg'
                          >
                            <div className='mb-4 flex items-start justify-between'>
                              <div className='flex items-center'>
                                <span className='mr-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 px-3 py-1 text-sm font-medium text-white'>
                                  Option {index + 1}
                                </span>
                                <span className='rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                                  {content.estimatedCTR}
                                </span>
                              </div>
                              <button
                                onClick={() => copyOptimizedContent(content)}
                                className='rounded-md bg-gradient-to-r from-blue-500 to-cyan-600 px-3 py-1 text-sm font-medium text-white transition-all duration-200 hover:from-blue-600 hover:to-cyan-700'
                              >
                                {copiedTitle === content.title
                                  ? '✓ Copied!'
                                  : 'Copy All'}
                              </button>
                            </div>

                            <div className='space-y-4'>
                              <div>
                                <h4 className='mb-2 font-semibold text-gray-700'>
                                  Title:
                                </h4>
                                <p className='rounded-lg bg-gray-50 p-3 text-lg font-medium text-gray-900'>
                                  {content.title}
                                </p>
                              </div>

                              <div>
                                <h4 className='mb-2 font-semibold text-gray-700'>
                                  Description:
                                </h4>
                                <pre className='max-h-60 overflow-y-auto rounded-lg bg-gray-50 p-3 font-sans text-sm leading-relaxed whitespace-pre-wrap text-gray-700'>
                                  {content.description}
                                </pre>
                              </div>

                              <div className='grid gap-4 md:grid-cols-2'>
                                <div>
                                  <h4 className='mb-2 font-semibold text-gray-700'>
                                    Target Keywords:
                                  </h4>
                                  <div className='flex flex-wrap gap-2'>
                                    {content.targetKeywords.map(
                                      (keyword, kIndex) => (
                                        <span
                                          key={kIndex}
                                          className='rounded bg-blue-100 px-2 py-1 text-xs text-blue-800'
                                        >
                                          {keyword}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className='mb-2 font-semibold text-gray-700'>
                                    Strategy:
                                  </h4>
                                  <p className='text-xs text-gray-600'>
                                    {content.reasoning}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  <div className='py-8 text-center'>
                    <div className='rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700'>
                      <h3 className='font-bold'>Error</h3>
                      <p>{optimizedResults.error}</p>
                      {optimizedResults.message && (
                        <p className='mt-1 text-sm'>
                          {optimizedResults.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
