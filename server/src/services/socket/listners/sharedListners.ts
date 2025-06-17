import { Server, Socket } from "socket.io";
import { ServerToAllEvents, AllToServerEvents } from "../enums/SharedEvents";
import { AdminToServerEvents } from "../enums/AdminEvents";

export const registerSharedListeners=(io: Server, socket: Socket)=> {
  // This listener is for all users, regardless of their role

 
  //   socket.on(
  //     AllToServerEvents.START_SESSION,
  //     (payload: AllStartSessionPayload) => {
  //       console.log(`[ADMIN] Starting session:`, payload.sessionId);
  //       io.to('session-' + payload.sessionId).emit(
  //         ServerToAllEvents.SESSION_STATUS,
  //         { status: 'started' }
  //       );
  //     }
  //   );
}
