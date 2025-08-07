import mongoose from "mongoose";

export interface IWinner {
  _id: mongoose.Types.ObjectId;
  name: string;
  votes: number;
}

export interface ITeam {
  _id?: mongoose.Types.ObjectId;
  teamNumber: number;
  teamName?: string | null;
  leaderId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  teamColor?: string;
  winners?: IWinner[];
}
