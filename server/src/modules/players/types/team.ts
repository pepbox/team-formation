import mongoose from "mongoose";

export interface ITeam {
  _id?: mongoose.Types.ObjectId;
  teamNumber: number;
  teamName?: string | null;
  leaderId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
}
