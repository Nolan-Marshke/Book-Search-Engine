import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('DEPLOYMENT TEST MODE: MongoDB connection bypass enabled');
console.log('This will allow the server to start without a working MongoDB connection');

// Create a mock connection object that mimics the mongoose connection
const mockDb = {
  once: (event: string, callback: () => void) => {
    console.log(`Mock MongoDB: Event '${event}' would trigger callback`);
    // Call the callback immediately to simulate a successful connection
    if (event === 'open') {
      setTimeout(callback, 1000);
    }
    return mockDb;
  },
  on: (event: string, callback: (err?: any) => void) => {
    console.log(`Mock MongoDB: Registered handler for '${event}' event`);
    return mockDb;
  }
};

// Attempt a real connection in the background, but don't wait for it
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/googlebooks';
try {
  console.log('Attempting real MongoDB connection in the background...');
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Real MongoDB connection successful!'))
    .catch(err => console.log('❌ Real MongoDB connection failed:', err.message));
} catch (error) {
  console.error('Error during MongoDB connection attempt:', error);
}

// Export the mock db object so the server can start
export default mockDb as any;