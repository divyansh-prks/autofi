import puppeteer from 'puppeteer';

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
): Promise<string[]> {
  try {
    // Create YouTube search URL - try multiple search strategies
    const searchQuery = encodeURIComponent(keyword);

    // First try: Recent videos (past week)
    let searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}&sp=CAISBAgBEAE%253D`;

    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for video results
    await page.waitForSelector('ytd-video-renderer', { timeout: 10000 });

    // Extract video data - get more videos to have better selection
    let videos = await page.evaluate(() => {
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
            uploadText
          };
        })
        .filter((video: any) => video.title.length > 0);
    });

    // If we don't get enough recent videos, try a broader search
    if (videos.length < 5) {
      // Try without date filter for more results
      searchUrl = `https://www.youtube.com/results?search_query=${searchQuery}&sp=CAMSAhAB`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('ytd-video-renderer', { timeout: 10000 });

      const additionalVideos = await page.evaluate(() => {
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
              uploadText
            };
          })
          .filter((video: any) => video.title.length > 0);
      });

      // Combine results, giving preference to recent videos
      videos = [...videos, ...additionalVideos];
    }

    // Process and filter videos
    const processedVideos = videos
      .map((video: any) => ({
        title: video.title,
        views: parseViewCount(video.viewsText),
        uploadDate: video.uploadText
      }))
      .filter((video: any) => isWithinLastWeek(video.uploadDate))
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, 3) // Get only top 3 titles
      .map((video: any) => video.title);

    return processedVideos;
  } catch (error) {
    return [];
  }
}

export async function searchTrendyTitles(
  keywords: string[]
): Promise<string[]> {
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

  const finalTitles: string[] = [];
  const filteredKeywords = filterKeywords(keywords);

  // Create multiple pages for parallel searching
  const searchPromises = filteredKeywords.map(async (keyword) => {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    try {
      const titles = await searchKeywordOnYouTube(keyword, page);
      await page.close();
      return titles;
    } catch (error) {
      await page.close();
      return [];
    }
  });

  // Execute all searches in parallel
  const allTitlesArrays = await Promise.all(searchPromises);

  // Flatten and deduplicate results
  allTitlesArrays.forEach((titles) => {
    titles.forEach((title) => {
      if (title && !finalTitles.includes(title)) {
        finalTitles.push(title);
      }
    });
  });

  await browser.close();
  return finalTitles;
}
