import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// IMPORTANT: This API key should be stored securely in a .env.local file.
// In development, you can use a fallback.
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('Gemini API key not found in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey);

// The `generateContent` model is designed for this type of task.
// We use gemini-1.5-pro for its advanced reasoning and structured output capabilities.
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  generationConfig: {
    // This setting tells the model to respond with a JSON object.
    // It's crucial for getting a structured, easy-to-parse response.
    responseMimeType: 'application/json'
  }
});

/**
 * Handles the POST request to generate YouTube content from a transcript.
 * @param {NextRequest} req The incoming request.
 * @returns {NextResponse} The JSON response containing the generated content.
 */
export async function POST(req: any) {
  try {
    const { transcript } = await req.json();

    if (
      !transcript ||
      typeof transcript !== 'string' ||
      transcript.trim().length === 0
    ) {
      return NextResponse.json(
        { error: 'Please provide a video transcript in the request body.' },
        { status: 400 }
      );
    }

    // A detailed prompt instructs the model on its persona and the desired output format.
    const prompt = `You are a professional YouTube SEO and content strategist. Analyze the following video transcript to create a YouTube video title, a detailed video description, and a comprehensive list of relevant keywords/tags.

The **title** should be catchy, concise (under 60 characters), and optimized for search.
The **description** should be detailed (around 150-200 words), conversational, include a call-to-action, and summarize the key points of the video.
The **keywords** should be a comprehensive list of 10-15 relevant terms for search and discovery.

Respond with a JSON object in the following format:
{
  "title": "...",
  "description": "...",
  "keywords": ["...", "...", "..."]
}

Video Transcript:
${transcript}
`;

    // Make the API call to Gemini. The model's responseMimeType setting handles the JSON parsing for us.
    const result = await model.generateContent([{ text: prompt }]);
    const response = await result.response;
    const data = JSON.parse(response.text());

    // Send the generated content back to the client.
    return NextResponse.json({
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      message: 'Content generated successfully.'
    });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
