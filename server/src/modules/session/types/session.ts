import mongoose from "mongoose";

export interface ISession {
  sessionId: mongoose.Types.ObjectId;
  numberOfTeams: number | null;
  votingDuration: number | null;
  votingStartTime: Date | null;
}
