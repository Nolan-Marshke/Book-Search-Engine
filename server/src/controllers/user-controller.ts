import User from '../models/User.js';
import { signToken } from '../services/auth.js';

// Get all users
export const getAllUsers = async () => {
  return await User.find();
};

// Get a single user by ID
export const getSingleUser = async (userId: string) => {
  return await User.findById(userId);
};

// Create a new user
export const createUser = async (userData: any) => {
  const user = await User.create(userData);
  const token = signToken(user.username, user.email, user._id);
  return { token, user };
};

// Login a user
export const login = async (userData: { email: string; password: string }) => {
  const user = await User.findOne({ email: userData.email });
  
  if (!user) {
    throw new Error("Can't find this user");
  }
  
  const correctPw = await user.isCorrectPassword(userData.password);
  
  if (!correctPw) {
    throw new Error('Wrong password!');
  }
  
  const token = signToken(user.username, user.email, user._id);
  return { token, user };
};

// Save a book to a user's savedBooks
export const saveBook = async (userId: string, bookData: any) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { savedBooks: bookData } },
    { new: true, runValidators: true }
  );
  
  if (!updatedUser) {
    throw new Error("Couldn't find user with this id!");
  }
  
  return updatedUser;
};

// Remove a book from a user's savedBooks
export const deleteBook = async (userId: string, bookId: string) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { savedBooks: { bookId } } },
    { new: true }
  );
  
  if (!updatedUser) {
    throw new Error("Couldn't find user with this id!");
  }
  
  return updatedUser;
};