import { Server, Socket } from "socket.io";
import { AdminToServerEvents, ServerToAdminEvents } from "../enums/AdminEvents";
import { handleGamePause } from "../handelers/admin/gameEvents";

export const registerAdminListeners = (io: Server, socket: Socket) => {
  if (socket.user?.role !== "ADMIN") return;

   socket.on(AdminToServerEvents.GAME_PAUSE,handleGamePause)
  





  //   socket.on(
  //     AdminToServerEvents.START_SESSION,
  //     (payload: AdminStartSessionPayload) => {
  //       console.log(`[ADMIN] Starting session:`, payload.sessionId);
  //       io.to('session-' + payload.sessionId).emit(
  //         ServerToAdminEvents.SESSION_STATUS,
  //         { status: 'started' }
  //       );
  //     }
  //   );
};
