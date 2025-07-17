import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import SessionService from "../services/sessionService";
import AppError from "../../../utils/appError";
import { SessionStates } from "../types/sessionStates";
import PlayerService from "../../players/services/playerService";
import TeamService from "../../players/services/teamService";
import { SessionEmitters } from "../../../services/socket/sessionEmitters";
import { ServerToAllEvents } from "../../../services/socket/enums/SharedEvents";
import { roomManager } from "../../../services/socket/roomManager";
import axios from "axios";
import AdminServices from "../../admin/services/adminServices";
import { TeamType } from "../types/session";
import { Team } from "../../players/models/team";

export const createSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, adminName, adminPin: password, gameConfig } = req.body;
  const { gameSessionId, gameLink, gameServerUrl, gameAdminLink, gameLinked, teamType } =
    gameConfig;

  const adminService = new AdminServices();

  try {
    const sessionService = new SessionService();
    const session = await sessionService.createSession({
      sessionName: name,
      gameSessionId,
      gameLink,
      gameServerUrl,
      gameAdminLink,
      gameLinked: gameLinked || false,
      teamType,
      state: SessionStates.TEAM_JOINING,
    });

    const playerLink = `${process.env.FRONTEND_URL}/user/${session._id}/login`;
    const adminLink = `${process.env.FRONTEND_URL}/admin/${session._id}/login`;

    await adminService.createAdmin({
      name: adminName,
      sessionId: session._id.toString(),
      password,
    });

    res.status(201).json({
      success: true,
      data: {
        ...session,
        playerLink,
        adminLink,
        sessionId: session._id.toString(),
      },
    });
  } catch (error) {
    console.error("Error creating session:", error);
    next(new AppError("Failed to create session.", 500));
  }
};

export const fetchSessionState = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.user.sessionId;

    if (!sessionId) {
      return next(new AppError("Session ID is required.", 400));
    }

    const sessionService = new SessionService();
    const session = await sessionService.fetchSessionById(sessionId);

    if (!session) {
      return next(new AppError("Session not found.", 404));
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error fetching session state:", error);
    next(new AppError("Failed to fetch session state.", 500));
  }
};

export const startTeamFormation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sessionId } = req.user;
  const { numberOfTeams } = req.body;

  if (typeof numberOfTeams !== "number" || numberOfTeams <= 0) {
    return next(new AppError("Invalid number of teams.", 400));
  }
  if (!sessionId) {
    return next(new AppError("Session ID is required.", 400));
  }

  const mongoSession = await mongoose.startSession();

  try {
    await mongoSession.withTransaction(async () => {
      const sessionService = new SessionService(mongoSession);
      const playerService = new PlayerService(mongoSession);
      const teamService = new TeamService(mongoSession);

      const players = await playerService.getPlayersBySessionId(sessionId);

      if (players.length < numberOfTeams) {
        throw new AppError(
          `Not enough players in the session. Required: ${numberOfTeams}, Available: ${players.length}`,
          400
        );
      }

      const teams = await teamService.createNTeams(numberOfTeams, sessionId);

      if (!teams || teams.length !== numberOfTeams) {
        throw new AppError("Failed to create teams.", 500);
      }

      // Shuffle players and distribute them among teams
      const shuffledPlayers = players.sort(() => Math.random() - 0.5);
      const playersPerTeam = Math.floor(shuffledPlayers.length / numberOfTeams);
      const remainingPlayers = shuffledPlayers.length % numberOfTeams;

      // Create team assignments map for room manager
      const teamAssignments = new Map<string, string>();

      let playerIndex = 0;
      for (let i = 0; i < numberOfTeams; i++) {
        const teamPlayersCount =
          playersPerTeam + (i < remainingPlayers ? 1 : 0);
        const teamPlayers = shuffledPlayers.slice(
          playerIndex,
          playerIndex + teamPlayersCount
        );
        const playerIds = teamPlayers.map((player) => player._id);

        await playerService.assignPlayersToTeams(playerIds, teams[i]._id);

        // Add to team assignments map for room manager
        teamPlayers.forEach((player) => {
          teamAssignments.set(player._id.toString(), teams[i]._id.toString());
        });

        playerIndex += teamPlayersCount;
      }

      // Update session state
      const session = await sessionService.updateSessionById(sessionId, {
        state: SessionStates.TEAM_FORMATION,
        numberOfTeams: numberOfTeams,
      });

      // Update room manager with team assignments
      roomManager.assignPlayersToTeams(sessionId, teamAssignments);

      return session;
    });

    const updatedSession = await SessionService.fetchSessionById(sessionId);

    SessionEmitters.toSession(sessionId, ServerToAllEvents.SESSION_UPDATE, {
      state: SessionStates.TEAM_FORMATION,
    });

    res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (error) {
    console.error("Error starting team formation:", error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to start team formation.", 500));
  } finally {
    await mongoSession.endSession();
  }
};

export const startLeaderVoting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.user;
    const { votingDuration } = req.body; // in seconds

    if (!sessionId || !votingDuration) {
      return next(
        new AppError("Voting Duration and sessionid are required", 400)
      );
    }

    const sessionService = new SessionService();

    const session = await sessionService.fetchSessionById(sessionId);

    if (session.state !== SessionStates.TEAM_FORMATION) {
      return next(new AppError("Session is not in team formation state.", 400));
    }
    const updatedSession = await sessionService.updateSessionById(sessionId, {
      state: SessionStates.LEADER_VOTING,
      votingDuration: votingDuration || 120,
      votingStartTime: new Date(),
    });

    SessionEmitters.toSession(sessionId, ServerToAllEvents.SESSION_UPDATE, {
      state: SessionStates.LEADER_VOTING,
      votingStartTime: updatedSession.votingStartTime,
      votingDuration: updatedSession.votingDuration,
    });

    res.status(200).json({
      success: true,
      data: updatedSession,
    });
  } catch (error) {
    console.error("Error starting leader voting:", error);
    if (error instanceof AppError) {
      return next(error);
    }
  }
};

export const finishSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.user;
    if (!sessionId) {
      return next(new AppError("Session ID is required.", 400));
    }

    const sessionService = new SessionService();
    const teamsService = new TeamService();

    const session = await sessionService.fetchSessionById(sessionId);

    if (!session) {
      return next(new AppError("Session not found.", 404));
    }

    const updatedSession = await sessionService.updateSessionById(sessionId, {
      state: SessionStates.COMPLETED,
    });

    const teams = await teamsService.getTeamsBySessionId(sessionId);

    if (!teams || teams.length === 0) {
      return next(new AppError("No teams found in this session.", 404));
    }
    // Check if we have team leader and team Name for all the teams
    for (const team of teams) {
      if (!team.leaderId || !team.teamName) {
        return next(
          new AppError(`All teams must have a leader and a team name.`, 400)
        );
      }
    }

    const continueToGameResponse = await axios.post(
      `${updatedSession.gameServerUrl}/continue-to-game`,
      {
        sessionId: updatedSession.gameSessionId.toString(),
        teams: teams.map((team) => ({
          teamId: team._id.toString(),
          teamName: team.teamName,
        })),
      }
    );

    if (continueToGameResponse.status !== 201) {
      return next(new AppError("Failed to create teams on game server.", 500));
    }

    const token = continueToGameResponse.data?.data.adminToken;

    console.log("Continue to game response", continueToGameResponse);

    SessionEmitters.toSession(sessionId, ServerToAllEvents.SESSION_UPDATE, {
      state: SessionStates.COMPLETED,
    });

    const adminLink = `${updatedSession.gameAdminLink}?token=${token}`;

    res.status(200).json({
      success: true,
      message: "Session finished successfully.",
      data: {
        adminLink: adminLink,
      },
    });
  } catch (error) {
    console.error("Error finishing session:", error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to finish session.", 500));
  }
};

export const fetchAllPlayers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.user.sessionId;
  if (!sessionId) {
    return next(new AppError("Session ID is required.", 400));
  }

  const playerService = new PlayerService();

  const players = await playerService.getPlayersBySessionId(sessionId);

  if (!players || players.length === 0) {
    return next(new AppError("No players found for this session.", 404));
  }
  res.status(200).json({
    success: true,
    data: players,
  });
  try {
  } catch (error: any) {
    console.error("Error fetching players:", error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to fetch players.", 500));
  }
};

export const fetchAllTeams = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sessionId = req.user.sessionId;

  if (!sessionId) {
    return next(new AppError("Session ID is required.", 400));
  }

  const teamService = new TeamService();

  try {
    const teams = await teamService.getTeamsBySessionId(sessionId);

    if (!teams) {
      return next(new AppError("No Team found in this session", 404));
    }
    res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error: any) {
    console.error("Error fetching all teams", error);
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Failed to fetch teams.", 500));
  }
};
