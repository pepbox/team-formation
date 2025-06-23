import { NextFunction, Request, Response } from "express";
import PlayerService from "../services/playerService";
import TeamService from "../services/teamService";
import AppError from "../../../utils/appError";

export const assignTeamName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const user = await PlayerService.getPlayerById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const teamId = user.teamId;
    if (!teamId) {
      return next(new AppError("User is not assigned to any team", 400));
    }
    const teamLeaderId = await TeamService.fetchTeamLeader(teamId);
    if (!teamLeaderId) {
      return next(new AppError("Team leader not found", 404));
    }
    if (teamLeaderId.toString() !== userId.toString()) {
      return next(new AppError("Only team leader can assign team name", 403));
    }

    const { teamName } = req.body;
    if (!teamName) {
      return next(new AppError("Team name is required", 400));
    }

    const updatedTeam = await TeamService.updateTeamName(teamId, teamName);
    res.status(200).json({
      message: "Team name updated successfully",
      data: updatedTeam,
    });
  } catch (error) {
    next(new AppError("Failed to perform team name update operation", 500));
  }
};

export const getAllTeamsData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const user = await PlayerService.getPlayerById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const sessionId = user.sessionId;

    if (!sessionId) {
      return next(new AppError("User is not assigned to any session", 400));
    }

    const teams = await TeamService.getTeamsBySessionId(sessionId);

    if (!teams || teams.length === 0) {
      return next(new AppError("No teams found for this session", 404));
    }

    const teamPlayersPromises = teams.map(async (team) => {
      const players = await PlayerService.getPlayersByTeamId(team._id);
      return {
        ...team.toObject(),
        players: players.map((player) => ({
          id: player._id,
          firstName: player.firstName,
          lastName: player.lastName,
          profileImage: player.profileImage,
        })),
      };
    });
    const teamsWithPlayers = await Promise.all(teamPlayersPromises);

    res.status(200).json({
      message: "Teams fetched successfully",
      data: teamsWithPlayers,
    });

  } catch (error) {
    next(new AppError("Failed to fetch team players", 500));
  }
};
