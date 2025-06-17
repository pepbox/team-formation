import mongoose  from "mongoose";
import 'socket.io';

declare global {
  namespace Express {
    interface Request {
      user: {
        id:mongoose.Types.ObjectId;
        role: 'USER' | 'ADMIN';
      };
    }
  }
}

declare module 'socket.io' {
  interface Socket {
    user?: {
      id: string;
      role: 'ADMIN' | 'USER';
      name: string;
    };
  }
}

export {}; 
