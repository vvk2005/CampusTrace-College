
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is missing from .env');
    }

    const parsed = new URL(uri);
    const databaseName = parsed.pathname.replace(/^\/+/, '');

    if (!databaseName || databaseName.includes('/')) {
      throw new Error(
        'Invalid database name in MONGO_URI. Use /campustrace only once.'
      );
    }

    await mongoose.connect(uri, {
      dbName: 'campustrace',
    });

    console.log('✅ MongoDB connected');
    console.log('✅ Database:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
