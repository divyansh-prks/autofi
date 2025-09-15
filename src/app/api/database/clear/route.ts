import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Script } from '@/lib/models';

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Count documents before deletion
    const [userCount, scriptCount] = await Promise.all([
      User.countDocuments(),
      Script.countDocuments()
    ]);

    // Delete all documents
    await Promise.all([User.deleteMany({}), Script.deleteMany({})]);

    return NextResponse.json({
      message: 'Database cleared successfully',
      deletedUsers: userCount,
      deletedScripts: scriptCount
    });
  } catch (error) {
    console.error('Database clear error:', error);
    return NextResponse.json(
      { error: 'Failed to clear database' },
      { status: 500 }
    );
  }
}
