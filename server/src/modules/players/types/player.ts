import mongoose from "mongoose";

export interface IPlayer {
  _id?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  profileImage: string;
  sessionId?: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  votedLeader: mongoose.Types.ObjectId;
}
