import mongoose from "mongoose";
import { Session } from "../models/session";

export default class SessionService {
  static async fetchSessionById(sessionId: mongoose.Types.ObjectId | string) {
    const session = await Session.findById(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    return session;
  }
}
