import { SessionStates } from "./sessionStates";

export interface Session {
  sessionId: string | null;
  sessionName: string | null;
  paused: boolean;
  state: SessionStates | null;
  gameLinked: boolean;
  votingStartTime: Date | null;
  votingDuration: number | null;
  teamType: string | null; // Added teamType to track the type of team formation
  numberOfTeams: number; 
}
