import { Schema, model } from "mongoose";
import { IVotingTimer } from "../types/votingTimer";

const votingTimerSchema = new Schema<IVotingTimer>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    votingEndTime: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// TTL index - documents will be automatically deleted when votingEndTime is reached
votingTimerSchema.index({ votingEndTime: 1 }, { expireAfterSeconds: 0 });

export const VotingTimer = model<IVotingTimer>("VotingTimer", votingTimerSchema, "votingTimers");