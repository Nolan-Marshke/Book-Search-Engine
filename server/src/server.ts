import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { authMiddleware } from './services/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/dist as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  
  // Handle any routes not handled by the server by serving the index.html
  app.get('*', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
} else {
  // In development, serve the index.html for the root route
  app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();
  server.applyMiddleware({ app: app as any });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Start the server
startApolloServer();