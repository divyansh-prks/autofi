import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Script } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const scripts = await Script.find({})
      .select(
        'userId originalFilename processingStatus llmProvider createdAt updatedAt'
      )
      .sort({ createdAt: -1 })
      .limit(100); // Limit to 100 scripts to prevent overwhelming the UI

    return NextResponse.json(scripts);
  } catch (error) {
    console.error('Fetch scripts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scripts' },
      { status: 500 }
    );
  }
}
