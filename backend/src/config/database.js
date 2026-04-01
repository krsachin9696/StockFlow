const mongoose = require('mongoose');

/**
 * Database - OOP class managing MongoDB connection lifecycle
 */
class Database {
  constructor() {
    this.uri = process.env.MONGODB_URI;
  }

  async connect() {
    try {
      await mongoose.connect(this.uri);
      console.log('✅ MongoDB connected successfully');

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      throw error;
    }
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log('MongoDB disconnected gracefully');
  }
}

const database = new Database();
module.exports = () => database.connect();
