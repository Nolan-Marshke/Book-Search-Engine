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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});


if (process.env.NODE_ENV === 'production') {
  
  const possiblePaths = [
    path.join(__dirname, '../../../client/dist'),
    path.join(__dirname, '../../client/dist'),    
    path.join(__dirname, '../client/dist'),      
    path.join(__dirname, '../../../dist'),        
    path.join(__dirname, '../../../../dist')      
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
  
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  
  app.get('*', (_, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

const startApolloServer = async () => {
  try {
  
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: authMiddleware,
      persistedQueries: false, 
    });

    
    await server.start();
    console.log('Apollo Server started successfully');
    
    
    server.applyMiddleware({ app: app as any });
    console.log('Apollo middleware applied to Express');

    
    const httpServer = app.listen(PORT, () => {
      console.log(`🌍 Server running on http://localhost:${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
    });

    
    db.once('open', () => {
      console.log('✅ MongoDB connection established successfully');
    });

    db.on('error', (err: Error) => {
      console.error('❌ MongoDB connection error:', err);
      console.log('⚠️ Application running in limited functionality mode');
      
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