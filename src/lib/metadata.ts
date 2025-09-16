import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPEN_AI_KEY
});

export async function generateYouTubeMetadata(transcript: string) {
  // Fallback metadata generation without OpenAI
  const fallbackMetadata = {
    title: generateTitle(transcript),
    description: generateDescription(transcript),
    tags: generateTags(transcript),
    chapters: generateChapters(transcript)
  };

  try {
    const prompt = `
    Based on this transcript, create optimized YouTube metadata:
    - Title (catchy, under 80 characters)
    - Description (150-300 words)
    - 10 SEO-friendly tags (comma separated)

    Transcript:
    ${transcript}
    `;

    const res = await openai.chat.completions.create({
      model: 'meta-llama/llama-4-maverick:free',
      messages: [{ role: 'user', content: prompt }]
    });

    const output = res.choices[0].message?.content || '';
    return { raw: output, fallback: fallbackMetadata };
  } catch (error: any) {
    console.warn(
      'OpenAI API failed, using fallback metadata generation:',
      error.message
    );
    return {
      raw: 'OpenAI API quota exceeded. Using fallback metadata generation.',
      fallback: fallbackMetadata
    };
  }
}

function generateTitle(transcript: string): string {
  const words = transcript.split(' ').slice(0, 10);
  const title = words.join(' ').substring(0, 60);
  return title + (title.length >= 60 ? '...' : '');
}

function generateDescription(transcript: string): string {
  const sentences = transcript.split('.').slice(0, 3);
  const description = sentences.join('. ').substring(0, 250);
  return description + (description.length >= 250 ? '...' : '');
}

function generateTags(transcript: string): string[] {
  const words = transcript
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(' ')
    .filter((word) => word.length > 4)
    .slice(0, 10);

  return Array.from(new Set(words)); // Remove duplicates
}

function generateChapters(transcript: string): string[] {
  const sentences = transcript.split('.');
  const chapters = [];

  for (let i = 0; i < Math.min(5, sentences.length); i++) {
    const time = i * 2; // Approximate 2 minutes per chapter
    const chapter = sentences[i].substring(0, 50);
    chapters.push(`${time.toString().padStart(2, '0')}:00 ${chapter}...`);
  }

  return chapters;
}
