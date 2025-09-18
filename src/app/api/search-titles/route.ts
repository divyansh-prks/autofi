import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface VideoData {
  title: string;
  views: number;
  uploadDate: string;
  keyword: string;
}

function filterKeywords(keywords: string[]): string[] {
  const stopWords = new Set([
    'you',
    'and',
    'the',
    'that',
    'like',
    'can',
    'not',
    'some',
    'how',
    'for',
    'about',
    'with',
    'this',
    'are',
    'but',
    'what',
    'all',
    'any',
    'your',
    'way',
    'get',
    'has',
    'had',
    'her',
    'was',
    'one',
    'our',
    'out',
    'day',
    'use',
    'man',
    'new',
    'now',
    'old',
    'see',
    'him',
    'two',
    'may',
    'say',
    'she',
    'its',
    'a',
    'an',
    'as',
    'at',
    'be',
    'by',
    'do',
    'he',
    'if',
    'in',
    'is',
    'it',
    'my',
    'no',
    'of',
    'on',
    'or',
    'so',
    'to',
    'up',
    'we'
  ]);

  return keywords.filter(
    (keyword) =>
      !stopWords.has(keyword.toLowerCase()) &&
      keyword.length > 2 &&
      keyword.trim() !== ''
  );
}

function parseViewCount(viewText: string): number {
  if (!viewText) return 0;

  const cleanText = viewText.toLowerCase().replace(/[^\d.km]/g, '');
  const number = parseFloat(cleanText);

  if (cleanText.includes('m')) return number * 1000000;
  if (cleanText.includes('k')) return number * 1000;
  return number || 0;
}

// Check if video was uploaded within the last week (more flexible approach)
function isWithinLastWeek(uploadText: string): boolean {
  if (!uploadText) return true; // Include if no date info available

  const lowerText = uploadText.toLowerCase();

  // Recent uploads (hours and days)
  if (lowerText.includes('hour') || lowerText.includes('minute')) {
    return true; // Definitely within last week
  }

  if (lowerText.includes('day')) {
    const days = parseInt(lowerText) || 0;
    return days <= 7;
  }

  // Week uploads
  if (lowerText.includes('week')) {
    const weeks = parseInt(lowerText) || 1;
    return weeks <= 2; // Allow up to 2 weeks for more results
  }

  // Month uploads - only allow very recent ones
  if (lowerText.includes('month')) {
    const months = parseInt(lowerText) || 1;
    return months <= 1; // Only current month
  }

  // If we can't parse the date, include it anyway
  return true;
}

async function searchKeywordOnYouTube(
  keyword: string,
  page: any
): Promise<VideoData[]> {
  try {
    console.log(`Searching for keyword: ${keyword}`);

    // Create YouTube search URL - try multiple search strategies
    const searchQuery = encodeURIComponent(keyword);

    // First try: Recent videos (past week)
    let searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}&sp=CAISBAgBEAE%253D`;

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for video results
    await page.waitForSelector('ytd-video-renderer', { timeout: 10000 });

    // Extract video data - get more videos to have better selection
    let videos = await page.evaluate((searchKeyword: string) => {
      const videoElements = Array.from(
        document.querySelectorAll('ytd-video-renderer')
      ).slice(0, 30);

      return videoElements
        .map((video: Element) => {
          const titleElement = video.querySelector('#video-title');
          const title = titleElement?.textContent?.trim() || '';

          const metadataElement = video.querySelector('#metadata-line');
          const viewsElement =
            metadataElement?.querySelector('span:first-child');
          const uploadElement =
            metadataElement?.querySelector('span:last-child');

          const viewsText = viewsElement?.textContent?.trim() || '0';
          const uploadText = uploadElement?.textContent?.trim() || '';

          return {
            title,
            viewsText,
            uploadText,
            keyword: searchKeyword
          };
        })
        .filter((video: any) => video.title.length > 0);
    }, keyword);

    // If we don't get enough recent videos, try a broader search
    if (videos.length < 5) {
      console.log(
        `Not enough recent videos found for "${keyword}", trying broader search...`
      );

      // Try without date filter for more results
      searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}&sp=CAMSAhAB`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('ytd-video-renderer', { timeout: 10000 });

      const additionalVideos = await page.evaluate((searchKeyword: string) => {
        const videoElements = Array.from(
          document.querySelectorAll('ytd-video-renderer')
        ).slice(0, 30);

        return videoElements
          .map((video: Element) => {
            const titleElement = video.querySelector('#video-title');
            const title = titleElement?.textContent?.trim() || '';

            const metadataElement = video.querySelector('#metadata-line');
            const viewsElement =
              metadataElement?.querySelector('span:first-child');
            const uploadElement =
              metadataElement?.querySelector('span:last-child');

            const viewsText = viewsElement?.textContent?.trim() || '0';
            const uploadText = uploadElement?.textContent?.trim() || '';

            return {
              title,
              viewsText,
              uploadText,
              keyword: searchKeyword
            };
          })
          .filter((video: any) => video.title.length > 0);
      }, keyword);

      // Combine results, giving preference to recent videos
      videos = [...videos, ...additionalVideos];
    }

    // Process and filter videos
    const processedVideos: VideoData[] = videos
      .map((video: any) => ({
        title: video.title,
        views: parseViewCount(video.viewsText),
        uploadDate: video.uploadText,
        keyword: keyword
      }))
      .filter((video: VideoData) => isWithinLastWeek(video.uploadDate))
      .sort((a: VideoData, b: VideoData) => b.views - a.views)
      .slice(0, 5); // Get top 5 instead of 3 for better variety

    console.log(`Found ${processedVideos.length} videos for "${keyword}"`);
    return processedVideos;
  } catch (error) {
    console.error(`Error searching for keyword "${keyword}":`, error);
    return [];
  }
}

async function searchAllKeywords(keywords: string[]): Promise<string[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  );

  const finalTitles: string[] = [];
  const filteredKeywords = filterKeywords(keywords);

  console.log(
    `Searching ${filteredKeywords.length} keywords:`,
    filteredKeywords
  );

  for (const keyword of filteredKeywords) {
    try {
      const videos = await searchKeywordOnYouTube(keyword, page);

      videos.forEach((video) => {
        if (video.title && !finalTitles.includes(video.title)) {
          finalTitles.push(video.title);
        }
      });

      // Small delay between searches to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to search keyword "${keyword}":`, error);
    }
  }

  await browser.close();
  console.log(`Total unique titles found: ${finalTitles.length}`);
  return finalTitles;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keywordsParam = searchParams.get('keywords');

  if (!keywordsParam) {
    return NextResponse.json(
      {
        error: 'Please provide keywords as a query parameter',
        example: '/api/search-titles?keywords=fitness,workout,gym'
      },
      { status: 400 }
    );
  }

  console.time('keywordSearch');

  // Parse keywords from URL parameter
  const keywords = keywordsParam
    .split(',')
    .map((k: string) => k.trim())
    .filter((k: string) => k.length > 0);

  if (keywords.length === 0) {
    return NextResponse.json(
      {
        error: 'No valid keywords provided'
      },
      { status: 400 }
    );
  }

  try {
    const finalTitles = await searchAllKeywords(keywords);
    console.timeEnd('keywordSearch');

    return NextResponse.json({
      success: true,
      totalKeywordsSearched: filterKeywords(keywords).length,
      totalTitlesFound: finalTitles.length,
      searchedKeywords: filterKeywords(keywords),
      finalTitles
    });
  } catch (error) {
    console.error('Error in keyword search:', error);
    return NextResponse.json(
      {
        error: 'Failed to search keywords',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.keywords) {
      return NextResponse.json(
        {
          error: 'Please provide keywords in the request body',
          example: { keywords: ['fitness', 'workout', 'gym'] }
        },
        { status: 400 }
      );
    }

    let keywords: string[] = [];

    // Handle different input formats
    if (typeof body.keywords === 'string') {
      // If it's a string, split by comma or newline
      keywords = (body.keywords as string)
        .split(/[,\n]/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
    } else if (Array.isArray(body.keywords)) {
      keywords = (body.keywords as string[]).filter(
        (k) => typeof k === 'string' && k.trim().length > 0
      );
    } else {
      return NextResponse.json(
        {
          error: 'Keywords must be a string or array of strings'
        },
        { status: 400 }
      );
    }

    if (keywords.length === 0) {
      return NextResponse.json(
        {
          error: 'No valid keywords provided'
        },
        { status: 400 }
      );
    }

    console.time('customKeywordSearch');
    console.log('Received keywords:', keywords);

    const finalTitles = await searchAllKeywords(keywords);
    console.timeEnd('customKeywordSearch');

    return NextResponse.json({
      success: true,
      totalKeywordsReceived: keywords.length,
      totalKeywordsSearched: filterKeywords(keywords).length,
      totalTitlesFound: finalTitles.length,
      searchedKeywords: filterKeywords(keywords),
      finalTitles
    });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      {
        error: 'Request failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
