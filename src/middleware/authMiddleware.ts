import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    if (decoded) {
      req.user = decoded as { userId: string };
      next();
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
