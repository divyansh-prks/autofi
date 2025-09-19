import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface GeminiTranscriptResult {
  success: boolean;
  transcript?: string;
  error?: string;
}

/**
 * Fallback function to extract transcript using Gemini LLM
 * This is used when the primary youtube-transcript.io API fails
 */
export async function extractTranscriptWithGemini(
  videoId: string,
  title?: string,
  description?: string
): Promise<GeminiTranscriptResult> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: 'Gemini API key not configured'
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create a prompt to ask Gemini to help with transcript extraction
    const prompt = `
You are an AI assistant that helps extract YouTube video transcripts when automated tools fail.

Video Information:
- Video ID: ${videoId}
- Title: ${title || 'Unknown'}
- Description: ${description || 'No description available'}

I need help extracting the transcript for this YouTube video. The automated transcript extraction failed, which could mean:
1. The video doesn't have auto-generated captions
2. The video has restricted access to transcripts
3. The video is in a language not supported by the transcript API
4. Technical issues with the transcript service

Please provide guidance on how to handle this situation. If you have any insights about this specific video or suggestions for alternative approaches, please share them.

Respond with a JSON object in this format:
{
  "canExtract": false,
  "reason": "explanation of why transcript cannot be extracted",
  "suggestions": ["alternative approach 1", "alternative approach 2"],
  "estimatedLanguage": "detected language if applicable"
}

Do not attempt to generate fake transcript content. Only provide guidance and suggestions.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const geminiResponse = JSON.parse(jsonMatch[0]);

        return {
          success: false,
          error: `Transcript extraction failed: ${geminiResponse.reason}. Suggestions: ${geminiResponse.suggestions?.join(', ')}`
        };
      }
    } catch (parseError) {
      // If JSON parsing fails, return the raw response
    }

    return {
      success: false,
      error: `Transcript not available. Gemini analysis: ${text.substring(0, 200)}...`
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Gemini fallback failed: ${error.message}`
    };
  }
}

/**
 * Alternative approach: Use Gemini to generate content suggestions based on video metadata
 * when transcript is not available
 */
export async function generateContentFromMetadata(
  videoId: string,
  title: string,
  description: string,
  category: string
): Promise<{
  success: boolean;
  content?: string;
  error?: string;
}> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        success: false,
        error: 'Gemini API key not configured'
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Based on the following YouTube video metadata, generate helpful content optimization suggestions:

Video Details:
- Title: ${title}
- Description: ${description}
- Category: ${category}
- Video ID: ${videoId}

Since the transcript is not available, please provide:
1. SEO-optimized title suggestions based on the current title
2. Improved description recommendations
3. Relevant hashtags and keywords
4. Content category analysis
5. Potential audience targeting suggestions

Please format your response as a structured analysis that would be helpful for content optimization.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();

    return {
      success: true,
      content
    };
  } catch (error: any) {
    return {
      success: false,
      error: `Content generation failed: ${error.message}`
    };
  }
}
