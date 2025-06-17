import { Socket, Server } from "socket.io";
import { registerAdminListeners } from "./adminListners";
import { registerUserListeners } from "./userListners";
import { registerSharedListeners } from "./sharedListners";

export const registerAllListeners = (io: Server, socket: Socket) => {
  registerSharedListeners(io, socket);
  registerAdminListeners(io, socket);
  registerUserListeners(io, socket);
};
