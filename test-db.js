// Simple database connection test
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false
    });

    console.log('✅ Successfully connected to MongoDB!');
    console.log('📊 Connection details:');
    console.log('  - Host:', mongoose.connection.host);
    console.log('  - Database:', mongoose.connection.name);
    console.log('  - Ready State:', mongoose.connection.readyState);

    // Test a simple operation
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log('📁 Available collections:', collections.length);

    if (collections.length > 0) {
      console.log('  Collections:', collections.map((c) => c.name).join(', '));
    } else {
      console.log('  No collections found (this is normal for a new database)');
    }

    // Ping the database
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.ping();
    console.log('🏓 Ping result:', pingResult);

    console.log('\n🎉 Database connection test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error message:', error.message);

    if (error.message.includes('authentication')) {
      console.error(
        '💡 This looks like an authentication error. Please check:'
      );
      console.error('  - Username and password are correct');
      console.error('  - Password is properly URL-encoded (@ should be %40)');
      console.error('  - Database user has proper permissions');
    } else if (error.message.includes('network')) {
      console.error('💡 This looks like a network error. Please check:');
      console.error('  - Internet connection');
      console.error('  - MongoDB Atlas cluster is running');
      console.error('  - IP address is whitelisted in MongoDB Atlas');
    }
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
    process.exit(0);
  }
}

testConnection();
