import { Schema, model } from "mongoose";
import { ITeam } from "../types/team";

const teamSchema = new Schema<ITeam>(
  {
    teamNumber: { type: Number, required: true },
    teamName: { type: String, default: null },
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    leaderId: { type: Schema.Types.ObjectId, ref: "Player" },
  },
  {
    timestamps: true,
  }
);

export const Team = model<ITeam>("Team", teamSchema, "teams");
