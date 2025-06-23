import { Schema, model } from "mongoose";
import { ISession } from "../types/session";

const sessionSchema = new Schema<ISession>(
  {
    sessionId: { type: Schema.Types.ObjectId, required: true, unique: true },
    numberOfTeams: { type: Number, default: null },
    votingDuration: { type: Number, default: null },
    votingStartTime: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const Session = model<ISession>("Session", sessionSchema, "sessions");
