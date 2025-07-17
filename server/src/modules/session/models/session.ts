import { Schema, model } from "mongoose";
import { ISession, TeamType } from "../types/session";
import { SessionStates } from "../types/sessionStates";

const sessionSchema = new Schema<ISession>(
  {
    sessionName: {
      type: String,
      trim: true,
    },
    gameSessionId: {
      type: Schema.Types.ObjectId,
      // required: true,
      // unique: true,
    },
    gameLink: { type: String },
    gameAdminLink: { type: String },
    gameServerUrl: { type: String },
    numberOfTeams: { type: Number, default: null },
    state: {
      type: String,
      enum: SessionStates,
      default: SessionStates.TEAM_JOINING,
    },
    teamType: {
      type: String,
      enum: Object.values(TeamType),
      default: TeamType.NUMBER,
    },
    gameLinked: { type: Boolean, default: false },
    paused: { type: Boolean, default: false },
    votingDuration: { type: Number, default: null },
    votingStartTime: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const Session = model<ISession>("Session", sessionSchema, "sessions");
