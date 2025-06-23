import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError";
import PlayerService from "../services/playerService";
import { generateAccessToken } from "../../../utils/jwtUtils";
import TeamService from "../services/teamService";
import SessionService from "../../session/services/sessionService";

export const createPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, sessionId } = req.body;

  if (!firstName || !lastName || !sessionId) {
    return next(
      new AppError("First name ,last name and sessionId are required.", 400)
    );
  }
  try {

    const session = await SessionService.fetchSessionById(sessionId);
    if (!session) {
      return next(new AppError("Session not found.", 404));
    }

    const player = await PlayerService.createPlayer({
      firstName,
      lastName,
      sessionId: session._id,
      profileImage: req.body.profileImage,
      teamId: req.body.teamId,
    });

    const token = generateAccessToken(player._id.toString(), "USER");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Player created successfully.",
      data: {
        player,
      },
    });
  } catch (error) {
    next(new AppError("Failed to create player.", 500));
  }
};

export const fetchPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const playerId = req.user.id;

    const player = await PlayerService.getPlayerById(playerId);

    if (!player) {
      return next(new AppError("Player not found.", 404));
    }

    res.status(200).json({
      message: "Player fetched successfully.",
      data: {
        player,
      },
    });
  } catch (error) {
    next(new AppError("Failed to fetch player.", 500));
  }
};

export const fetchMyTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const playerId = req.user.id;

    const player = await PlayerService.getPlayerById(playerId);

    if (!player) {
      return next(new AppError("Player not found.", 404));
    }

    if (!player.teamId) {
      return next(new AppError("Player is not assigned to any team.", 400));
    }

    const teamPlayers = await PlayerService.getPlayersByTeamId(player.teamId);
    const teamInfo = await TeamService.getTeamById(player.teamId);

    if (!teamInfo) {
      return next(new AppError("Team not found.", 404));
    }

    res.status(200).json({
      message: "Team players fetched successfully.",
      data: {
        teamPlayers,
        teamInfo,
      },
    });
  } catch (error) {
    next(new AppError("Failed to fetch team players.", 500));
  }
};

export const voteForLeader = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { votedLeaderId } = req.body;

  if (!votedLeaderId) {
    return next(new AppError("Voted leader ID is required.", 400));
  }

  try {
    const playerId = req.user.id;

    const currentPlayer = await PlayerService.getPlayerById(playerId);
    if (!currentPlayer) {
      return next(new AppError("Player not found.", 404));
    }

    const votedLeader = await PlayerService.getPlayerById(votedLeaderId);
    if (!votedLeader) {
      return next(new AppError("Voted leader not found.", 404));
    }

    if (currentPlayer.teamId?.toString() !== votedLeader.teamId?.toString()) {
      return next(
        new AppError("You can only vote for players in your team.", 400)
      );
    }

    const updatedPlayer = await PlayerService.updatePlayer({
      playerId: playerId,
      votedLeader: votedLeader._id,
    });

    if (!updatedPlayer) {
      return next(new AppError("Failed to update player vote.", 500));
    }

    res.status(200).json({
      message: "Vote for leader recorded successfully.",
      data: {
        player: updatedPlayer,
      },
    });
  } catch (error) {
    next(new AppError("Failed to vote for leader.", 500));
  }
};
