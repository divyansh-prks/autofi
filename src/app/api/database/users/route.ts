import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const users = await User.find({})
      .select('-passwordHash') // Exclude password hash for security
      .sort({ createdAt: -1 })
      .limit(100); // Limit to 100 users to prevent overwhelming the UI

    return NextResponse.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
