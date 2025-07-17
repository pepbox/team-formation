import mongoose from "mongoose";
import { SessionStates } from "./sessionStates";

export enum TeamType {
  NUMBER = "number",
  COLOR = "color"
}

export interface ISession {
  sessionName:string;
  gameSessionId: mongoose.Types.ObjectId;
  gameLink: string;
  gameAdminLink: string;
  gameServerUrl: string;
  pin: string;
  numberOfTeams: number | null;
  state: SessionStates;
  paused: boolean;
  teamType: TeamType;
  gameLinked: boolean;
  votingDuration: number | null;
  votingStartTime: Date | null;
}
