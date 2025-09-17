'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 to-purple-50'>
      {/* Navigation */}
      <nav className='sticky top-0 z-10 bg-white/80 shadow-lg backdrop-blur-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 justify-between'>
            <div className='flex items-center'>
              <h1 className='bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent'>
                AutoFi
              </h1>
            </div>
            <div className='flex items-center space-x-4'>
              <Link
                href='/upload/ui'
                className='text-gray-600 transition-colors hover:text-pink-600'
              >
                Upload
              </Link>
              <Link
                href='/keywords'
                className='text-gray-600 transition-colors hover:text-pink-600'
              >
                Keywords
              </Link>
              <Link
                href='/titlehume'
                className='text-gray-600 transition-colors hover:text-pink-600'
              >
                Title Search
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className='mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='mb-6 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-5xl font-bold text-transparent md:text-6xl'>
            YouTube SEO Optimization
          </h1>
          <p className='mx-auto mb-12 max-w-3xl text-xl text-gray-600'>
            Complete YouTube SEO toolkit with video transcription, keyword
            extraction, and trending title discovery powered by AWS and AI
          </p>
        </div>

        {/* Features Grid */}
        <div className='mt-16 grid gap-8 md:grid-cols-3'>
          {/* Video Upload & Transcription */}
          <Link href='/upload/ui' className='block'>
            <div className='group rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
              <div className='text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 transition-transform group-hover:scale-110'>
                  <svg
                    className='h-8 w-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                    />
                  </svg>
                </div>
                <h3 className='mb-3 text-2xl font-bold text-gray-800'>
                  Video Upload
                </h3>
                <p className='leading-relaxed text-gray-600'>
                  Upload your videos and get AI-powered transcriptions using AWS
                  Transcribe. Download transcripts as markdown files for easy
                  editing.
                </p>
                <div className='mt-4 text-sm font-medium text-pink-600'>
                  Upload → Transcribe → Download
                </div>
              </div>
            </div>
          </Link>

          {/* Keyword Extraction */}
          <Link href='/keywords' className='block'>
            <div className='group rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
              <div className='text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 transition-transform group-hover:scale-110'>
                  <svg
                    className='h-8 w-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 20l4-16m2 16l4-16M6 9h14M4 15h14'
                    />
                  </svg>
                </div>
                <h3 className='mb-3 text-2xl font-bold text-gray-800'>
                  Keyword Extraction
                </h3>
                <p className='leading-relaxed text-gray-600'>
                  Extract 30+ SEO-optimized keywords using AWS Comprehend.
                  Context-aware analysis for targeted audience reach.
                </p>
                <div className='mt-4 text-sm font-medium text-pink-600'>
                  Analyze → Extract → Optimize
                </div>
              </div>
            </div>
          </Link>

          {/* Title Search */}
          <Link href='/titlehume' className='block'>
            <div className='group rounded-2xl bg-white p-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl'>
              <div className='text-center'>
                <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 transition-transform group-hover:scale-110'>
                  <svg
                    className='h-8 w-8 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                    />
                  </svg>
                </div>
                <h3 className='mb-3 text-2xl font-bold text-gray-800'>
                  Title Search
                </h3>
                <p className='leading-relaxed text-gray-600'>
                  Discover trending YouTube video titles based on your keywords.
                  Find what's working in your niche right now.
                </p>
                <div className='mt-4 text-sm font-medium text-pink-600'>
                  Search → Discover → Adapt
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Workflow Section */}
        <div className='mt-20'>
          <h2 className='mb-12 text-center text-3xl font-bold text-gray-800'>
            Complete YouTube SEO Workflow
          </h2>
          <div className='grid gap-8 md:grid-cols-4'>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white'>
                1
              </div>
              <h3 className='mb-2 font-semibold text-gray-800'>Upload Video</h3>
              <p className='text-sm text-gray-600'>
                Upload your video file to get started
              </p>
            </div>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-xl font-bold text-white'>
                2
              </div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                Extract Keywords
              </h3>
              <p className='text-sm text-gray-600'>
                Generate SEO keywords from your content
              </p>
            </div>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-xl font-bold text-white'>
                3
              </div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                Find Trending Titles
              </h3>
              <p className='text-sm text-gray-600'>
                Discover what titles are working
              </p>
            </div>
            <div className='text-center'>
              <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white'>
                4
              </div>
              <h3 className='mb-2 font-semibold text-gray-800'>
                Optimize & Publish
              </h3>
              <p className='text-sm text-gray-600'>
                Use insights to optimize your video
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className='mt-20 text-center'>
          <Link
            href='/upload/ui'
            className='inline-flex items-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:from-pink-600 hover:to-purple-700 hover:shadow-xl'
          >
            Get Started
            <svg
              className='ml-2 h-5 w-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 7l5 5m0 0l-5 5m5-5H6'
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
