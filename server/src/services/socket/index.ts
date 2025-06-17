import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { socketAuthMiddleware } from '../../middlewares/socketAuthMiddleware';
import { registerAllListeners } from './listners/registerAllListners';

let ioInstance: Server | null = null;

export function initializeSocket(server: HTTPServer): Server {
  if (ioInstance) return ioInstance; 

  const io = new Server(server, {
    cors: {
      origin: '*', 
    },
  });

  io.use(socketAuthMiddleware);

  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
    registerAllListeners(io, socket);
  });

  ioInstance = io;
  return io;
}

export function getSocketIO(): Server {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized yet');
  }
  return ioInstance;
}
