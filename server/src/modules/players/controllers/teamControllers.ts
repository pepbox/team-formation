import { NextFunction, Request, Response } from "express";
import PlayerService from "../services/playerService";
import TeamService from "../services/teamService";
import AppError from "../../../utils/appError";
import { SessionEmitters } from "../../../services/socket/sessionEmitters";
import { ServerToAdminEvents } from "../../../services/socket/enums/AdminEvents";
import { ServerToUserEvents } from "../../../services/socket/enums/UserEvents";

export const assignTeamName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === "ADMIN";
    const teamService = new TeamService();

    let teamId;
    if (!isAdmin) {
      const playerService = new PlayerService();

      const user = await playerService.getPlayerById(userId);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      teamId = user.teamId;
      if (!teamId) {
        return next(new AppError("User is not assigned to any team", 400));
      }
      const teamLeaderId = await teamService.fetchTeamLeader(teamId);
      if (!teamLeaderId) {
        return next(new AppError("Team leader not found", 404));
      }
      if (teamLeaderId.toString() !== userId.toString()) {
        return next(new AppError("Only team leader can assign team name", 403));
      }
    } else {
      teamId = req.body.teamId;
    }

    const { teamName } = req.body;
    if (!teamName) {
      return next(new AppError("Team name is required", 400));
    }

    const updatedTeam = await teamService.updateTeam(teamId, { teamName });

    const sessionIdStr = updatedTeam.sessionId.toString();
    // Notify admins
    SessionEmitters.toSessionAdmins(
      sessionIdStr,
      ServerToAdminEvents.TEAMS_UPDATE,
      { teamId: updatedTeam._id.toString(), teamName: updatedTeam.teamName }
    );
    // Notify all players in session (so their team lists refetch)
    SessionEmitters.toSessionPlayers(
      sessionIdStr,
      ServerToUserEvents.TEAMS_UPDATE,
      { teamId: updatedTeam._id.toString(), teamName: updatedTeam.teamName }
    );
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

    const playerService = new PlayerService();
    const teamService = new TeamService();

    const user = await playerService.getPlayerById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const sessionId = user.sessionId;

    if (!sessionId) {
      return next(new AppError("User is not assigned to any session", 400));
    }

    const teams = await teamService.getTeamsBySessionId(sessionId);

    if (!teams || teams.length === 0) {
      return next(new AppError("No teams found for this session", 404));
    }

    const teamPlayersPromises = teams.map(async (team) => {
      const players = await playerService.getPlayersByTeamId(team._id);
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

export const getTeamById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { teamId } = req.query;
    if (!teamId) {
      return next(new AppError("Team ID is required", 400));
    }

    const teamService = new TeamService();
    const playerService = new PlayerService();

    const team = await teamService.getTeamById(teamId.toString());
    if (!team) {
      return next(new AppError("Team not found", 404));
    }

    const players = await playerService.getPlayersByTeamId(teamId.toString());

    res.status(200).json({
      message: "Team fetched successfully",
      data: {
        ...team.toObject(),
        players: players.map((player) => ({
          id: player._id,
          firstName: player.firstName,
          lastName: player.lastName,
          profileImage: player.profileImage,
        })),
      },
    });
  } catch (error) {
    next(new AppError("Failed to fetch team by ID", 500));
  }
};
