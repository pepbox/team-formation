import mongoose, { Schema, model } from "mongoose";
import { IPlayer } from "../types/player";

const playerSchema = new Schema<IPlayer>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
    votedLeader: { type: Schema.Types.ObjectId, ref: "Player" },
    teamId: { type: Schema.Types.ObjectId, ref: "Team" },
  },
  {
    timestamps: true,
  }
);

export const Player = model<IPlayer>("Player", playerSchema, "players");
