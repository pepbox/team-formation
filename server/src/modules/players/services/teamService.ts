import mongoose from "mongoose";
import { Team } from "../models/team";

export default class TeamService {
  static async getTeamById(teamId: mongoose.Types.ObjectId | string) {
    return await Team.findById(teamId);
  }
  static async fetchTeamLeader(teamId: mongoose.Types.ObjectId | string) {
    const team = await Team.findById(teamId).select("leaderId");
    if (!team) {
      throw new Error("Team not found");
    }
    return team.leaderId;
  }

  static async updateTeamName(
    teamId: mongoose.Types.ObjectId | string,
    teamName: string
  ) {
    const team = await Team.findByIdAndUpdate(
      teamId,
      { teamName },
      { new: true, runValidators: true }
    );
    if (!team) {
      throw new Error("Team not found");
    }
    return team;
  }

  static async getTeamsBySessionId(
    sessionId: mongoose.Types.ObjectId | string
  ) {
    return await Team.find({ sessionId }).populate(
      "leaderId",
      "firstName lastName profileImage"
    );
  }
}
