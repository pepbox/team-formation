import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { verifyAccessToken } from '../utils/jwtUtils';

dotenv.config();

export const authenticateUser = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    return; 
  }
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next(); 
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    return; 
  }
};


export const authorizeRoles = (...roles: ('USER' | 'ADMIN')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
      return; 
    }
    next();
  };
};



