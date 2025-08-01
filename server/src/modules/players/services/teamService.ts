import mongoose from "mongoose";
import { Team } from "../models/team";
import { ITeam } from "../types/team";
import { TEAM_COLORS } from "../../../utils/teamColors";
import axios from "axios";
import { TeamType } from "../../session/types/session";

export default class TeamService {
  private session?: mongoose.ClientSession;

  constructor(session?: mongoose.ClientSession) {
    this.session = session;
  }

  // Static methods for backward compatibility
  static async createNTeams(
    numberOfTeams: number,
    sessionId: mongoose.Types.ObjectId | string,
    teamType: TeamType = TeamType.NUMBER
  ) {
    const service = new TeamService();
    return service.createNTeams(numberOfTeams, sessionId, teamType);
  }

  static async getTeamById(teamId: mongoose.Types.ObjectId | string) {
    const service = new TeamService();
    return service.getTeamById(teamId);
  }

  static async fetchTeamLeader(teamId: mongoose.Types.ObjectId | string) {
    const service = new TeamService();
    return service.fetchTeamLeader(teamId);
  }

  static async getTeamsBySessionId(
    sessionId: mongoose.Types.ObjectId | string
  ) {
    const service = new TeamService();
    return service.getTeamsBySessionId(sessionId);
  }

  async updateTeam(
    teamId: mongoose.Types.ObjectId | string,
    updateData: Partial<ITeam>
  ) {
    const options: any = { new: true, runValidators: true };
    if (this.session) {
      options.session = this.session;
    }
    const team = await Team.findByIdAndUpdate(teamId, updateData, options);
    if (!team) {
      throw new Error("Team not found");
    }
    return team;
  }

  async createNTeams(
    numberOfTeams: number,
    sessionId: mongoose.Types.ObjectId | string,
    teamType: TeamType = TeamType.NUMBER
  ) {
    const teamDocs = Array.from({ length: numberOfTeams }, (_, i) => ({
      teamNumber:  i + 1 ,
      leaderId: null,
      teamColor: teamType === TeamType.COLOR ? TEAM_COLORS[i].option : undefined,
      sessionId,
    }));
    const payload = {
      gameSessionId: sessionId,
      totalTeams: numberOfTeams,
    };

    try {
      await axios.post(`${process.env.SUPER_ADMIN_SERVER_URL}/update`, payload);
      console.log("Session data sent to super admin server successfully.");
    } catch (axiosError) {
      console.error('Error sending session data:', axiosError);
    }
    const options: any = {};
    if (this.session) {
      options.session = this.session;
    }
    const teams = await Team.insertMany(teamDocs, options);
    return teams;
  }

  async getTeamById(teamId: mongoose.Types.ObjectId | string) {
    const query = Team.findById(teamId);
    if (this.session) {
      query.session(this.session);
    }
    return await query;
  }

  async fetchTeamLeader(teamId: mongoose.Types.ObjectId | string) {
    const query = Team.findById(teamId).select("leaderId");
    if (this.session) {
      query.session(this.session);
    }
    const team = await query;
    if (!team) {
      throw new Error("Team not found");
    }
    return team.leaderId;
  }

  async getTeamsBySessionId(sessionId: mongoose.Types.ObjectId | string) {
    const query = Team.find({ sessionId }).populate(
      "leaderId",
      "firstName lastName profileImage"
    );
    if (this.session) {
      query.session(this.session);
    }
    return await query;
  }
}
