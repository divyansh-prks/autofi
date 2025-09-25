import puppeteer, { Browser } from 'puppeteer';

interface YouTubeVideoInfo {
  title: string;
  description: string;
  url: string;
}

export class YouTubeScraper {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    this.browser = await puppeteer.launch({
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
  }

  async scrapeVideoInfo(youtubeUrl: string): Promise<YouTubeVideoInfo | null> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call init() first.');
    }

    const page = await this.browser.newPage();

    try {
      // Set user agent to avoid detection
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      // Navigate to YouTube video
      await page.goto(youtubeUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for the page to load completely
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Wait for video metadata to load
      try {
        await page.waitForSelector('h1[class*="title"]', { timeout: 10000 });
      } catch (e) {
        // Continue even if selector not found
      }

      // Extract title
      const title = await page.evaluate(() => {
        // Try multiple selectors for title
        const titleSelectors = [
          'h1[class*="title"] yt-formatted-string',
          'h1.ytd-watch-metadata yt-formatted-string',
          'h1.style-scope.ytd-watch-metadata yt-formatted-string',
          'h1 yt-formatted-string',
          '[data-testid="video-title"]',
          '.ytd-watch-metadata h1'
        ];

        for (const selector of titleSelectors) {
          const element = document.querySelector(selector);
          if (element?.textContent?.trim()) {
            return element.textContent.trim();
          }
        }

        // Fallback to document title
        const docTitle = document.title;
        if (docTitle && docTitle !== 'YouTube') {
          return docTitle.replace(' - YouTube', '');
        }

        return 'Title not found';
      });

      // Wait a bit more for dynamic content to load
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Try to scroll down to trigger lazy loading of description
      await page.evaluate(() => {
        window.scrollTo(0, 500);
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Extract description
      const description = await page.evaluate(() => {
        // Try multiple selectors for description in order of likelihood
        const descriptionSelectors = [
          // Modern YouTube layout selectors
          'ytd-expandable-video-description-body-renderer span',
          'ytd-text-inline-expander-renderer span',
          '#description-inline-expander span',
          '#description-inline-expandable span',
          // Fallback selectors
          'yt-formatted-string[slot="content"]',
          '#description yt-formatted-string',
          '#description-text',
          '.ytd-expandable-video-description-body-renderer yt-formatted-string',
          '#description .content',
          '[data-testid="video-description"]',
          '.ytd-video-secondary-info-renderer #description yt-formatted-string',
          '#meta-contents #description yt-formatted-string',
          // More generic selectors
          '[id*="description"] span',
          '[class*="description"] span'
        ];

        for (const selector of descriptionSelectors) {
          const elements = document.querySelectorAll(selector);
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (
              element?.textContent?.trim() &&
              element.textContent.length > 20
            ) {
              const text = element.textContent.trim();
              // Filter out common non-description content
              if (
                !text.includes('Subscribe') &&
                !text.includes('views') &&
                !text.includes('Like') &&
                !text.match(/^\d+\s*(K|M|B)?\s*views?$/i) &&
                text.length > 30
              ) {
                return text;
              }
            }
          }
        }

        // Last resort: try to find any substantial text content
        const allSpans = document.querySelectorAll('span');
        for (let i = 0; i < allSpans.length; i++) {
          const span = allSpans[i];
          if (span.textContent && span.textContent.length > 100) {
            const text = span.textContent.trim();
            const parent = span.closest(
              '#description, [class*="description"], [id*="description"]'
            );
            if (
              parent &&
              !text.includes('Subscribe') &&
              !text.includes('views')
            ) {
              return text;
            }
          }
        }

        return 'Description not available or could not be extracted';
      });

      return {
        title,
        description,
        url: youtubeUrl
      };
    } catch (error) {
      throw new Error(
        `Error scraping YouTube video: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      await page.close();
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Standalone function for quick usage
export async function getYouTubeVideoInfo(
  youtubeUrl: string
): Promise<YouTubeVideoInfo | null> {
  const scraper = new YouTubeScraper();

  try {
    await scraper.init();
    const videoInfo = await scraper.scrapeVideoInfo(youtubeUrl);
    return videoInfo;
  } catch (error) {
    throw new Error(
      `Error getting YouTube video info: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  } finally {
    await scraper.close();
  }
}
