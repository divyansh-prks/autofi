import connectDB, { isConnected, disconnect } from './db';
import mongoose from 'mongoose';

/**
 * Database utility functions for common operations
 */

/**
 * Initialize database connection with error handling
 */
export async function initializeDB() {
  try {
    if (!isConnected()) {
      await connectDB();
      console.log('✅ MongoDB connected successfully');
    }
    return { success: true };
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return { success: false, error };
  }
}

/**
 * Gracefully close database connection
 */
export async function closeDB() {
  try {
    if (isConnected()) {
      await disconnect();
      console.log('✅ MongoDB disconnected successfully');
    }
    return { success: true };
  } catch (error) {
    console.error('❌ MongoDB disconnection failed:', error);
    return { success: false, error };
  }
}

/**
 * Check database connection status
 */
export function getConnectionStatus() {
  const readyState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return {
    state: readyState,
    status: states[readyState as keyof typeof states] || 'unknown',
    isConnected: readyState === 1
  };
}

/**
 * Execute database operation with automatic connection handling
 */
export async function withDB<T>(operation: () => Promise<T>): Promise<T> {
  try {
    await connectDB();
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}

/**
 * Health check for database connection
 */
export async function healthCheck() {
  try {
    await connectDB();

    // Ping the database
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();

    return {
      success: true,
      status: 'healthy',
      connection: getConnectionStatus(),
      ping: result,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      status: 'unhealthy',
      connection: getConnectionStatus(),
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}
