import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || 'mysecretsshhhhh';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); 
      }

      req.user = user as JwtPayload;
      return next();
    });
  } else {
    res.sendStatus(401); 
  }
};

export const authMiddleware = ({ req }: { req: Request }) => {
  let token = req.body?.token || req.query?.token || req.headers.authorization;

  
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return {};
  }

  try {
    const secretKey = process.env.JWT_SECRET_KEY || 'mysecretsshhhhh';
    const { data } = jwt.verify(token, secretKey, { maxAge: '2h' }) as { data: JwtPayload };
    
    return { user: data };
  } catch {
    console.log('Invalid token');
    return {};
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || 'mysecretsshhhhh';

  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};