import { Document, Types } from "mongoose";

export interface IVotingTimer extends Document {
    sessionId: Types.ObjectId;
    teamId: Types.ObjectId;
    votingEndTime: Date;
    createdAt: Date;
}