import { Server, Socket } from "socket.io";
import { ServerToUserEvents, UserToServerEvents } from "../enums/UserEvents";

export const registerUserListeners= (io: Server, socket: Socket)=> {
  if (socket.user?.role !== "USER") return;

  //   socket.on(
  //     UserToServerEvents.START_SESSION,
  //     (payload: UserStartSessionPayload) => {
  //       console.log(`[ADMIN] Starting session:`, payload.sessionId);
  //       io.to('session-' + payload.sessionId).emit(
  //         ServerToUserEvents.SESSION_STATUS,
  //         { status: 'started' }
  //       );
  //     }
  //   );
}
