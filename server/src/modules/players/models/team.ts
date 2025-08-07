import { Schema, model } from "mongoose";
import { ITeam } from "../types/team";

const teamSchema = new Schema<ITeam>(
  {
    teamNumber: { type: Number, required: true },
    teamName: { type: String, default: null },
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    leaderId: { type: Schema.Types.ObjectId, ref: "Player" },
    teamColor: { type: String, default: null },
    winners: [{
      _id: { type: Schema.Types.ObjectId, ref: "Player" },
      name: { type: String },
      votes: { type: Number }
    }],
  },
  {
    timestamps: true,
  }
);

export const Team = model<ITeam>("Team", teamSchema, "teams");
