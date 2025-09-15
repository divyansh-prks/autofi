import { NextResponse } from 'next/server';
import connectDB, { isConnected } from '../../../lib/db';

export async function GET() {
  try {
    // Test database connection
    await connectDB();

    const health = {
      success: true,
      status: 'healthy',
      connection: {
        isConnected: isConnected(),
        readyState: 1
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(health, {
      status: 200
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
