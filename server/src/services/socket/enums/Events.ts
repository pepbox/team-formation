import { AdminToServerEvents, ServerToAdminEvents } from "./AdminEvents";
import { AllToServerEvents, ServerToAllEvents } from "./SharedEvents";
import { ServerToUserEvents, UserToServerEvents } from "./UserEvents";

export type SocketEvents =
  | AdminToServerEvents
  | ServerToAdminEvents
  | UserToServerEvents
  | ServerToUserEvents
  | AllToServerEvents
  | ServerToAllEvents;

