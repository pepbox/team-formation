import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Token missing'));

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);

    if (typeof payload === 'object' && payload.role) {
      (socket as any).user = payload;
      return next();
    }

    next(new Error('Invalid payload structure'));
  } catch {
    next(new Error('Invalid token'));
  }
};
