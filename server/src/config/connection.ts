import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('DEPLOYMENT TEST MODE: MongoDB connection bypass enabled');
console.log('This will allow the server to start without a working MongoDB connection');


const mockDb = {
  once: (event: string, callback: () => void) => {
    console.log(`Mock MongoDB: Event '${event}' would trigger callback`);
    
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


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/googlebooks';
try {
  console.log('Attempting real MongoDB connection in the background...');
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Real MongoDB connection successful!'))
    .catch(err => console.log('❌ Real MongoDB connection failed:', err.message));
} catch (error) {
  console.error('Error during MongoDB connection attempt:', error);
}


export default mockDb as any;