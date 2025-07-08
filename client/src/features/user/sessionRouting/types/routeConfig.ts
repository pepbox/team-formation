import { SessionStates } from "../../../session/types/sessionStates";

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  allowedStates: SessionStates[];
}
