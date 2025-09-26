import { GoogleGenAI, Type } from '@google/genai';
import {
  SuggestedDescription,
  SuggestedTitle,
  YoutubeAnalytics
} from './models/Video';

// Initialize Gemini AI
if (!process.env.GEMINI_API_KEY) {
  throw new Error('Gemini API key not configured');
}
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = 'gemini-2.0-flash-lite';

export async function getGeminiTranscriptFromUrl(
  videoUrl: string
): Promise<string | null> {
  const prompt = `Please transcribe this video. Provide only the spoken content as text, with no extras.`;

  const result = await genAI.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ text: prompt }, { fileData: { fileUri: videoUrl } }]
  });
  return result.text || null;
}

export async function extractKeywords(transcript: string): Promise<string[]> {
  const prompt = `You are a professional YouTube SEO and content strategist. Analyze the following video transcript to create a comprehensive list of relevant keywords/tags.
    The **keywords** should be a comprehensive list of 5-8 relevant terms for search and discovery.

    Respond with a JSON object in the following format:
    {
      "keywords": ["...", "...", "..."]
    }

    Video Transcript:
    ${transcript}
    `;

  const result = await genAI.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['keywords']
      }
    }
  });
  const data = JSON.parse(result.text ?? '{}') as { keywords: string[] };
  return data.keywords;
}

export async function generateYoutubeSuggestedContent(
  transcript: string,
  trendyYoutubeTitles: string[]
): Promise<{
  suggestedTitles: SuggestedTitle[];
  suggestedDescriptions: SuggestedDescription[];
  suggestedTags: string[];
}> {
  const prompt = `
    You are a YouTube content optimizer. Given a transcript with trendy YouTube titles, return JSON only with fields: titles[], descriptions[], tags[].
    titles: array of {title, score, reasoning, viralityIncrease, seoImprovement} (4-6 items)
    descriptions: array of {description, score, reasoning, viralityIncrease, seoImprovement} (2-4 items)
    tags: array of 12-20 relevant SEO tags

    Here is the video transcript and trendy YouTube titles. Generate optimized content.

    Transcript:
    ${transcript}

    Trendy YouTube Titles:
    ${trendyYoutubeTitles.join(' | ')}
    `;

  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          titles: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                score: { type: Type.NUMBER },
                reasoning: { type: Type.STRING },
                viralityIncrease: { type: Type.NUMBER },
                seoImprovement: { type: Type.NUMBER }
              },
              required: [
                'title',
                'score',
                'reasoning',
                'viralityIncrease',
                'seoImprovement'
              ]
            }
          },
          descriptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                score: { type: Type.NUMBER },
                reasoning: { type: Type.STRING },
                viralityIncrease: { type: Type.NUMBER },
                seoImprovement: { type: Type.NUMBER }
              },
              required: [
                'description',
                'score',
                'reasoning',
                'viralityIncrease',
                'seoImprovement'
              ]
            }
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['titles', 'descriptions', 'tags']
      }
    }
  });

  const data = JSON.parse(response.text ?? '{}') as {
    titles: SuggestedTitle[];
    descriptions: SuggestedDescription[];
    tags: string[];
  };

  return {
    suggestedTitles: data.titles,
    suggestedDescriptions: data.descriptions,
    suggestedTags: data.tags
  };
}

export async function generateViralityAnalytics(
  transcript: string,
  titles: SuggestedTitle[],
  originalTitle: string = '',
  youtubeCurrentViews: string = '0'
): Promise<YoutubeAnalytics> {
  const prompt = `
    You are a YouTube growth strategist. Given a video transcript, its titles, and the original title, analyze and predict its virality and SEO potential.
    Respond with a JSON object with fields:
    - predictedViews (number): Estimated views in the next 30 days
    - viralityScore (number 0-100): Overall virality potential
    - seoScore (number 0-100): SEO optimization score
    - engagementPrediction (number 0-100): Predicted engagement level
    - shareabilityScore (number 0-100): Likelihood of being shared
    - trendingPotential (number 0-100): Potential to trend on YouTube
    - keyFactors: array of {factor, impact (high|medium|low), score (0-100), description} key factors influencing performance
    - predictions: {views24h, views7d, views30d} estimated views in respective timeframes

    Video Transcript:
    ${transcript}

    Titles:
    ${titles.map((t) => t.title).join(' | ')}

    Original Title:
    ${originalTitle}

    Current Views:
    ${youtubeCurrentViews}
    `;
  const response = await genAI.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          predictedViews: { type: Type.NUMBER },
          viralityScore: { type: Type.NUMBER },
          seoScore: { type: Type.NUMBER },
          engagementPrediction: { type: Type.NUMBER },
          shareabilityScore: { type: Type.NUMBER },
          trendingPotential: { type: Type.NUMBER },
          keyFactors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                factor: { type: Type.STRING },
                impact: {
                  type: Type.STRING,
                  enum: ['high', 'medium', 'low']
                },
                score: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ['factor', 'impact', 'score', 'description']
            }
          },
          predictions: {
            type: Type.OBJECT,
            properties: {
              views24h: { type: Type.NUMBER },
              views7d: { type: Type.NUMBER },
              views30d: { type: Type.NUMBER }
            },
            required: ['views24h', 'views7d', 'views30d']
          }
        },
        required: [
          'predictedViews',
          'viralityScore',
          'seoScore',
          'engagementPrediction',
          'shareabilityScore',
          'trendingPotential',
          'keyFactors',
          'predictions'
        ]
      }
    }
  });

  const data = JSON.parse(response.text ?? '{}') as unknown as YoutubeAnalytics;
  return data;
}
