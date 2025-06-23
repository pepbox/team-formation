import mongoose from "mongoose";
import { Player } from "../models/player";

export default class PlayerService {
  static async createPlayer({
    firstName,
    lastName,
    profileImage,
    teamId,
  }: {
    firstName: string;
    lastName: string;
    profileImage?: string;
    teamId?: string;
  }) {
    const player = new Player({
      firstName,
      lastName,
      profileImage,
      teamId,
    });
    return await player.save();
  }

  static async getPlayerById(playerId: mongoose.Types.ObjectId | string) {
    return await Player.findById(playerId);
  }

  static async getPlayersByTeamId(teamId: mongoose.Types.ObjectId | string) {
    return await Player.find({ teamId });
  }

  static async updatePlayer({
    playerId,
    firstName,
    lastName,
    profileImage,
    votedLeader,
  }: {
    playerId: mongoose.Types.ObjectId | string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    votedLeader?: mongoose.Types.ObjectId | string;
  }) {
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (profileImage) updateData.profileImage = profileImage;
    if (votedLeader) updateData.votedLeader = votedLeader;

    return await Player.findByIdAndUpdate(playerId, updateData, {
      new: true,
      runValidators: true,
    });
  }
}
