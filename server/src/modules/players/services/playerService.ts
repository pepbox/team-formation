import mongoose from "mongoose";
import { Player } from "../models/player";
import { profile } from "console";

export default class PlayerService {
  private session?: mongoose.ClientSession;

  constructor(session?: mongoose.ClientSession) {
    this.session = session;
  }

  // Static methods for backward compatibility
  static async createPlayer({
    firstName,
    lastName,
    sessionId,
    profileImage,
    teamId,
  }: {
    firstName: string;
    lastName: string;
    sessionId: mongoose.Types.ObjectId | string;
    profileImage?: mongoose.Types.ObjectId | string;
    teamId?: string;
  }) {
    const service = new PlayerService();
    return service.createPlayer({
      firstName,
      lastName,
      sessionId,
      profileImage,
      teamId,
    });
  }

  static async getPlayerById(playerId: mongoose.Types.ObjectId | string) {
    const service = new PlayerService();
    return service.getPlayerById(playerId);
  }

  static async getPlayersByTeamId(teamId: mongoose.Types.ObjectId | string) {
    const service = new PlayerService();
    return service.getPlayersByTeamId(teamId);
  }

  static async updatePlayer({
    playerId,
    firstName,
    lastName,
    sessionId,
    profileImage,
    votedLeader,
  }: {
    playerId: mongoose.Types.ObjectId | string;
    firstName?: string;
    lastName?: string;
    sessionId?: mongoose.Types.ObjectId | string;
    profileImage?: string;
    votedLeader?: mongoose.Types.ObjectId | string;
  }) {
    const service = new PlayerService();
    return service.updatePlayer({
      playerId,
      firstName,
      lastName,
      sessionId,
      profileImage,
      votedLeader,
    });
  }

  static async getPlayersBySessionId(
    sessionId: mongoose.Types.ObjectId | string
  ) {
    const service = new PlayerService();
    return service.getPlayersBySessionId(sessionId);
  }

  static async assignPlayersToTeams(
    playerIds: (mongoose.Types.ObjectId | string)[],
    teamId: mongoose.Types.ObjectId | string
  ) {
    const service = new PlayerService();
    return service.assignPlayersToTeams(playerIds, teamId);
  }

  // Instance methods that use this.session
  async createPlayer({
    firstName,
    lastName,
    sessionId,
    profileImage,
    teamId,
  }: {
    firstName: string;
    lastName: string;
    sessionId: mongoose.Types.ObjectId | string;
    profileImage?: mongoose.Types.ObjectId | string;
    teamId?: string;
  }) {
    const player = new Player({
      firstName,
      lastName,
      sessionId,
      profileImage,
      teamId,
    });
    const options: any = {};
    if (this.session) {
      options.session = this.session;
    }
    return await player.save(options);
  }

  async getPlayerById(playerId: mongoose.Types.ObjectId | string) {
    const query = Player.findById(playerId)
      .populate("profileImage", "location")
      .populate("teamId", "_id teamNumber teamName leaderId")
      .lean();
    if (this.session) {
      query.session(this.session);
    }
    return await query;
  }

  async getPlayerBySessionIdAndName(
    sessionId: mongoose.Types.ObjectId | string,
    firstName: string,
    lastName: string
  ) {
    return Player.findOne({
      sessionId,
      firstName,
      lastName,
    }).lean();
  }

  async getPlayersByTeamId(teamId: mongoose.Types.ObjectId | string) {
    const query = Player.find({ teamId }).populate("profileImage", "location");
    if (this.session) {
      query.session(this.session);
    }
    const result = await query;

    const players = result.map((player) => ({
      ...player.toObject(),
      profileImage: (player.profileImage as any)?.location || null,
    }));
    return players;
  }

  async updatePlayer({
    playerId,
    firstName,
    lastName,
    sessionId,
    profileImage,
    votedLeader,
  }: {
    playerId: mongoose.Types.ObjectId | string;
    firstName?: string;
    lastName?: string;
    sessionId?: mongoose.Types.ObjectId | string;
    profileImage?: string;
    votedLeader?: mongoose.Types.ObjectId | string;
  }) {
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (profileImage) updateData.profileImage = profileImage;
    if (votedLeader) updateData.votedLeader = votedLeader;
    if (sessionId) {
      updateData.sessionId = sessionId;
    }

    const options: any = {
      new: true,
      runValidators: true,
    };
    if (this.session) {
      options.session = this.session;
    }

    return await Player.findByIdAndUpdate(playerId, updateData, options);
  }

  async getPlayersBySessionId(sessionId: mongoose.Types.ObjectId | string) {
    const query = Player.find({ sessionId })
      .populate("profileImage", "location")
      .lean();
    if (this.session) {
      query.session(this.session);
    }
    const players = await query;
    return players.map((player) => ({
      ...player,
      profileImage: (player.profileImage as any)?.location || null,
    }));
  }

  async assignPlayersToTeams(
    playerIds: (mongoose.Types.ObjectId | string)[],
    teamId: mongoose.Types.ObjectId | string
  ) {
    const options: any = { runValidators: true };
    if (this.session) {
      options.session = this.session;
    }
    return await Player.updateMany(
      { _id: { $in: playerIds } },
      { teamId },
      options
    );
  }

  async countPlayersBySessionId(sessionId: mongoose.Types.ObjectId | string): Promise<number> {
    const query = Player.countDocuments({ sessionId });
    if (this.session) {
      query.session(this.session);
    }
    return await query;
  }
}
