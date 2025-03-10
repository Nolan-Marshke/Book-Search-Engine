import express, { Request, Response } from 'express';
import { 
  getAllUsers, 
  getSingleUser, 
  createUser, 
  login, 
  saveBook, 
  deleteBook 
} from '../../controllers/user-controller.js';

const router = express.Router();

// The issue is in these route handlers - they are returning Response objects
// We need to modify them to not return the response object

// /api/users
router.route('/')
  .get(async (req: Request, res: Response) => {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching users', error: err });
    }
  })
  .post(async (req: Request, res: Response) => {
    try {
      const user = await createUser(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ message: 'Error creating user', error: err });
    }
  });

// /api/users/login
router.route('/login')
  .post(async (req: Request, res: Response) => {
    try {
      const userData = await login(req.body);
      res.json(userData);
    } catch (err) {
      res.status(400).json({ message: 'Error logging in', error: err });
    }
  });

// /api/users/:userId
router.route('/:userId')
  .get(async (req: Request, res: Response) => {
    try {
      const user = await getSingleUser(req.params.userId);
      res.json(user);
    } catch (err) {
      res.status(404).json({ message: 'User not found', error: err });
    }
  });

// /api/users/:userId/books/:bookId
router.route('/:userId/books/:bookId')
  .delete(async (req: Request, res: Response) => {
    try {
      const updatedUser = await deleteBook(req.params.userId, req.params.bookId);
      res.json(updatedUser);
    } catch (err) {
      res.status(404).json({ message: 'Error removing book', error: err });
    }
  });

// /api/users/:userId/books
router.route('/:userId/books')
  .put(async (req: Request, res: Response) => {
    try {
      const updatedUser = await saveBook(req.params.userId, req.body);
      res.json(updatedUser);
    } catch (err) {
      res.status(404).json({ message: 'Error saving book', error: err });
    }
  });

export default router;