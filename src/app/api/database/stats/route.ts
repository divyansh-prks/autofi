import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Script } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get collection stats
    const [userCount, scriptCount] = await Promise.all([
      User.countDocuments(),
      Script.countDocuments()
    ]);

    // Get database stats (this is an approximation since MongoDB Atlas doesn't expose actual size easily)
    const totalDocuments = userCount + scriptCount;
    const estimatedSize = `~${Math.round((totalDocuments * 2) / 1024)}KB`; // Rough estimate

    const stats = {
      users: userCount,
      scripts: scriptCount,
      totalDocuments,
      databaseSize: estimatedSize
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Database stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database statistics' },
      { status: 500 }
    );
  }
}
