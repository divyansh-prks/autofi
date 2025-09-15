import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Script } from '@/lib/models';
import bcrypt from 'bcryptjs';

// Sample data for seeding
const sampleUsers = [
  {
    email: 'john.doe@example.com',
    username: 'johndoe',
    passwordHash: 'hashedpassword123'
  },
  {
    email: 'jane.smith@example.com',
    username: 'janesmith',
    passwordHash: 'hashedpassword456'
  },
  {
    email: 'mike.johnson@example.com',
    username: 'mikejohnson',
    passwordHash: 'hashedpassword789'
  },
  {
    email: 'sarah.wilson@example.com',
    username: 'sarahwilson',
    passwordHash: 'hashedpassword101'
  },
  {
    email: 'alex.brown@example.com',
    username: 'alexbrown',
    passwordHash: 'hashedpassword102'
  }
];

const processingStatuses = [
  'uploading',
  'transcribing',
  'analyzing',
  'generating',
  'completed',
  'failed'
];
const llmProviders = ['gemini', 'openai', 'claude'];

const generateSampleScripts = (userIds: string[]) => {
  const scripts = [];
  const sampleFilenames = [
    'product_demo_video.mp4',
    'tutorial_recording.mov',
    'webinar_presentation.mp4',
    'interview_session.mp4',
    'marketing_content.mov',
    'training_material.mp4',
    'conference_talk.mp4',
    'podcast_episode.mp3',
    'live_stream_recording.mp4',
    'demo_walkthrough.mov'
  ];

  for (let i = 0; i < Math.min(15, userIds.length * 3); i++) {
    const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
    const randomFilename =
      sampleFilenames[Math.floor(Math.random() * sampleFilenames.length)];
    const randomStatus =
      processingStatuses[Math.floor(Math.random() * processingStatuses.length)];
    const randomProvider =
      llmProviders[Math.floor(Math.random() * llmProviders.length)];

    scripts.push({
      userId: randomUserId,
      originalFilename: `${i + 1}_${randomFilename}`,
      cloudinaryVideoUrl: `https://cloudinary.com/video/${i + 1}`,
      cloudinaryAudioUrl: `https://cloudinary.com/audio/${i + 1}`,
      processingStatus: randomStatus,
      llmProvider: randomProvider,
      transcript: {
        content: `This is a sample transcript for ${randomFilename}. It contains the audio content that was extracted and transcribed from the original video file.`,
        language: 'en',
        confidenceScore: Math.random() * 0.3 + 0.7 // Random score between 0.7 and 1.0
      },
      keywords: [
        {
          keyword: 'technology',
          relevanceScore: Math.random() * 0.5 + 0.5,
          category: 'tech',
          trendScore: Math.random() * 0.3 + 0.7
        },
        {
          keyword: 'tutorial',
          relevanceScore: Math.random() * 0.4 + 0.6,
          category: 'education',
          trendScore: Math.random() * 0.2 + 0.8
        }
      ],
      generatedContent: {
        title: `Generated Title for ${randomFilename}`,
        description: `This is an automatically generated description for the video content. It provides a comprehensive overview of the main topics covered in the video.`,
        tags: ['technology', 'tutorial', 'educational', 'demo'],
        seoScore: Math.random() * 0.3 + 0.7
      },
      processingTimeSeconds: Math.floor(Math.random() * 300) + 30 // Random time between 30-330 seconds
    });
  }

  return scripts;
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Hash passwords for sample users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        passwordHash: await bcrypt.hash('password123', 12) // Default password for all sample users
      }))
    );

    // Clear existing data and insert new data
    await User.deleteMany({});
    await Script.deleteMany({});

    // Insert users
    const insertedUsers = await User.insertMany(hashedUsers);
    const userIds = insertedUsers.map((user) => user._id.toString());

    // Generate and insert scripts
    const sampleScripts = generateSampleScripts(userIds);
    const insertedScripts = await Script.insertMany(sampleScripts);

    return NextResponse.json({
      message: 'Database seeded successfully',
      usersCreated: insertedUsers.length,
      scriptsCreated: insertedScripts.length
    });
  } catch (error) {
    console.error('Database seeding error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
