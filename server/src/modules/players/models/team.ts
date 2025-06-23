import { Schema, model } from "mongoose";
import { ITeam } from "../types/team";

const teamSchema = new Schema<ITeam>(
  {
    teamNumber: { type: Number, required: true, unique: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    leaderId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
  },
  {
    timestamps: true,
  }
);

export const Team = model<ITeam>("Team", teamSchema, "teams");
