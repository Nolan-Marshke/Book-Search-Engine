import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authMiddleware } from './services/auth.js';
import * as dotenv from 'dotenv';

dotenv.config();

// For ES modules support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Static assets
if (process.env.NODE_ENV === 'production') {
  // Try multiple possible paths for the client build
  const possiblePaths = [
    path.join(__dirname, '../../../client/dist'), // /opt/render/project/src/client/dist
    path.join(__dirname, '../../client/dist'),    // /opt/render/project/server/client/dist 
    path.join(__dirname, '../client/dist'),       // /opt/render/project/server/dist/client/dist
    path.join(__dirname, '../../../dist'),        // /opt/render/project//dist
    path.join(__dirname, '../../../../dist')      // /opt/render/project/dist
  ];
  
  // Find the first path that exists
  let clientBuildPath = null;
  for (const testPath of possiblePaths) {
    console.log(`Testing path: ${testPath}`);
    if (fs.existsSync(testPath)) {
      clientBuildPath = testPath;
      console.log(`✅ Found client build at: ${clientBuildPath}`);
      break;
    }
  }
  
  if (clientBuildPath) {
    app.use(express.static(clientBuildPath));
    app.get('*', (_, res) => {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
    console.error('❌ Could not find client build directory');
    // Fallback to a simple HTML page
    app.get('*', (_, res) => {
      res.send(`
        <html>
          <head><title>Google Books Search</title></head>
          <body>
            <h1>Google Books Search API is running</h1>
            <p>The API is working but could not locate the client build files.</p>
            <p>Please check the server logs for more information.</p>
          </body>
        </html>
      `);
    });
  }
} else {
  // Development mode
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  
  app.get('*', (_, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

const startApolloServer = async () => {
  try {
    // Initialize Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: authMiddleware,
      persistedQueries: false, // Disable persisted queries to avoid the warning
    });

    // Start Apollo Server
    await server.start();
    console.log('Apollo Server started successfully');
    
    // Apply middleware
    server.applyMiddleware({ app: app as any });
    console.log('Apollo middleware applied to Express');

    // Start Express server without waiting for MongoDB
    // This allows the app to work even if MongoDB is having issues
    const httpServer = app.listen(PORT, () => {
      console.log(`🌍 Server running on http://localhost:${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    });

    // Register MongoDB connection event handlers
    db.once('open', () => {
      console.log('✅ MongoDB connection established successfully');
    });

    db.on('error', (err: Error) => {
      console.error('❌ MongoDB connection error:', err);
      console.log('⚠️ Application running in limited functionality mode');
      // Don't exit process on MongoDB error - allow the server to continue running
    });

    return { server, app };
  } catch (error) {
    console.error('Failed to start Apollo Server:', error);
    process.exit(1);
  }
};

// Start the server
startApolloServer().catch(error => {
  console.error('Fatal error during server startup:', error);
  process.exit(1);
});