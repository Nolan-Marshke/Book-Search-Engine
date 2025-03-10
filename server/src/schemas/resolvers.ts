// server/src/schemas/resolvers.ts
interface User {
  _id: string;
  username: string;
  email: string;
  bookCount: number;
  savedBooks: Book[];
}

interface Book {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image: string;
  link: string;
}

interface BookData {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image: string;
  link: string;
}

export const resolvers = {
  Query: {
    me: () => {
      return {
        _id: 'mock-user-id',
        username: 'testuser',
        email: 'test@example.com',
        bookCount: 5,
        savedBooks: [
          {
            bookId: 'test-book-1',
            authors: ['Test Author 1'],
            description: 'This is a test book description',
            title: 'Test Book 1',
            image: 'https://via.placeholder.com/150',
            link: 'https://example.com/book1'
          },
          {
            bookId: 'test-book-2',
            authors: ['Test Author 2'],
            description: 'Another test book description',
            title: 'Test Book 2',
            image: 'https://via.placeholder.com/150',
            link: 'https://example.com/book2'
          }
        ]
      };
    }
  },
  Mutation: {
    login: (_: unknown, { email, password }: { email: string; password: string }) => {
      return {
        token: 'mock-jwt-token',
        user: {
          _id: 'mock-user-id',
          username: 'testuser',
          email: email
        }
      };
    },
    addUser: (_: unknown, { username, email, password }: { username: string; email: string; password: string }) => {
      return {
        token: 'mock-jwt-token',
        user: {
          _id: 'mock-user-id',
          username: username,
          email: email
        }
      };
    },
    saveBook: (_: unknown, { bookData }: { bookData: BookData }) => {
      return {
        _id: 'mock-user-id',
        username: 'testuser',
        email: 'test@example.com',
        bookCount: 6,
        savedBooks: [
          {
            bookId: bookData.bookId,
            authors: bookData.authors,
            description: bookData.description,
            title: bookData.title,
            image: bookData.image,
            link: bookData.link
          }
        ]
      };
    },
    removeBook: (_: unknown, { bookId }: { bookId: string }) => {
      return {
        _id: 'mock-user-id',
        username: 'testuser',
        email: 'test@example.com',
        bookCount: 4,
        savedBooks: []
      };
    }
  }
};

export default resolvers;