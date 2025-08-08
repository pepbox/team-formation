import { NextFunction, Request, Response } from "express";
import AppError from "../../../utils/appError";
import PlayerService from "../services/playerService";
import { generateAccessToken } from "../../../utils/jwtUtils";
import TeamService from "../services/teamService";
import SessionService from "../../session/services/sessionService";
import FileService from "../../files/services/fileService";
import { SessionStates } from "../../session/types/sessionStates";
import { deleteFromS3 } from "../../../services/fileUpload";
import { SessionEmitters } from "../../../services/socket/sessionEmitters";
import { ServerToUserEvents } from "../../../services/socket/enums/UserEvents";
import { Session } from "inspector/promises";
import { ServerToAllEvents } from "../../../services/socket/enums/SharedEvents";
import axios from "axios";
import { ITeam } from "../types/team";
import { ServerToAdminEvents } from "../../../services/socket/enums/AdminEvents";

export const createPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, sessionId } = req.body;

  if (!req.file) {
    return next(new AppError("Profile image is required.", 400));
  }

  if (!firstName || !lastName || !sessionId) {
    deleteFromS3(req.file.key!);
    return next(
      new AppError("First name ,last name and sessionId are required.", 400)
    );
  }

  try {
    const sessionService = new SessionService();
    const playerService = new PlayerService();
    const fileService = new FileService();

    const session = await sessionService.fetchSessionById(sessionId);
    if (!session) {
      deleteFromS3(req.file.key!);
      return next(new AppError("Session not found.", 404));
    }
    if (session.state !== SessionStates.TEAM_JOINING) {
      deleteFromS3(req.file.key!);
      return next(
        new AppError("Team formation is started, you cannot join now", 400)
      );
    }

    const existingPlayer = await playerService.getPlayerBySessionIdAndName(
      sessionId,
      firstName,
      lastName
    );

    if (existingPlayer) {
      deleteFromS3(req.file.key!);
      return next(
        new AppError(
          `Player with name ${firstName} ${lastName} already exists in this session.`,
          400
        )
      );
    }

    const profileImageInfo = {
      originalName: req.file.originalname!,
      fileName: req.file.key!,
      size: req.file.size!,
      mimetype: req.file.mimetype!,
      location: req.file.location!,
      bucket: req.file.bucket!,
      etag: req.file.etag!,
    };

    const profileImage = await fileService.uploadFile(profileImageInfo);

    const player = await playerService.createPlayer({
      firstName,
      lastName,
      sessionId: session._id,
      profileImage: profileImage._id,
      teamId: req.body.teamId,
    });

    // Get player count for the session
    const playerCount = await playerService.countPlayersBySessionId(session._id);

    const payload = {
      gameSessionId: session._id,
      totalPlayers: playerCount,
    };

    try {
      await axios.post(`${process.env.SUPER_ADMIN_SERVER_URL}/update`, payload);
    } catch (axiosError) {
      console.error('Error sending session data:', axiosError);
    }

    const token = generateAccessToken({
      id: player._id.toString(),
      role: "USER",
      sessionId,
    });

    SessionEmitters.toSessionAdmins(
      sessionId,
      ServerToAdminEvents.PLAYERS_UPDATE,
      {}
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Player created successfully.",
      data: {
        player,
      },
    });
  } catch (error) {
    console.error("Error creating player:", error);
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
    const playerService = new PlayerService();

    const player = await playerService.getPlayerById(playerId);

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

export const logoutPlayer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({
      message: "Player logged out successfully.",
    });
  } catch (error) {
    next(new AppError("Failed to logout player.", 500));
  }
};

export const fetchMyTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const playerId = req.user.id;
    const playerService = new PlayerService();
    const teamService = new TeamService();

    const player = await playerService.getPlayerById(playerId);

    if (!player) {
      return next(new AppError("Player not found.", 404));
    }

    if (!player.teamId) {
      return next(new AppError("Player is not assigned to any team.", 400));
    }

    const teamPlayers = await playerService.getPlayersByTeamId(player.teamId);
    const teamInfo = await teamService.getTeamById(player.teamId);

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
    console.error(error);
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
    const playerService = new PlayerService();

    const currentPlayer = await playerService.getPlayerById(playerId);
    if (!currentPlayer) {
      return next(new AppError("Player not found.", 404));
    }

    const votedLeader = await playerService.getPlayerById(votedLeaderId);
    if (!votedLeader) {
      return next(new AppError("Voted leader not found.", 404));
    }

    if (currentPlayer.teamId?.toString() !== votedLeader.teamId?.toString()) {
      return next(
        new AppError("You can only vote for players in your team.", 400)
      );
    }

    const updatedPlayer = await playerService.updatePlayer({
      playerId: playerId,
      votedLeader: votedLeader._id,
    });

    if (!updatedPlayer) {
      return next(new AppError("Failed to update player vote.", 500));
    }

    SessionEmitters.toTeam(
      updatedPlayer.sessionId?.toString() ?? "",
      updatedPlayer.teamId?.toString() ?? "",
      ServerToUserEvents.TEAMPLAYER_VOTE_UPDATE,
      {}
    );

    SessionEmitters.toSessionAdmins(
      updatedPlayer.sessionId?.toString() ?? "",
      ServerToAdminEvents.PLAYERS_UPDATE,
      {}
    );

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

export const fetchMyTeamPlayerVotes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const playerId = req.user.id;
    const sessionId = req.user.sessionId;
    const playerService = new PlayerService();
    const teamService = new TeamService();

    const player = await playerService.getPlayerById(playerId);
    const sessionService = new SessionService();

    if (!sessionId) {
      return next(new AppError("Session ID is required.", 400));
    }
    if (!player) {
      return next(new AppError("Player not found.", 404));
    }

    if (!player.teamId) {
      return next(new AppError("Player is not assigned to any team.", 400));
    }

    const session = await sessionService.fetchSessionById(sessionId);

    if (!session) {
      return next(new AppError("Session not found.", 404));
    }

    const votingStartTime = session.votingStartTime;
    const votingDuration = session.votingDuration;

    if (!votingStartTime || !votingDuration) {
      return next(new AppError("Voting has not started yet.", 400));
    }

    const votingEndTime = new Date(
      votingStartTime.getTime() + votingDuration * 1000
    );
    const isVotingEnded = new Date() >= votingEndTime;

    const teamPlayers = await playerService.getPlayersByTeamId(player.teamId);
    const teamPlayersWithVotes = teamPlayers.map((teamPlayer) => {
      const votes = teamPlayers.filter(
        (p) => p.votedLeader?.toString() === teamPlayer._id.toString()
      ).length;

      return {
        ...teamPlayer,
        votes,
        myVoted: teamPlayer.votedLeader?.toString() === playerId,
      };
    });

    let responseData: any = {
      teamPlayersWithVotes,
      isVotingEnded,
    };

    if (isVotingEnded) {
      const team = await teamService.getTeamById(player.teamId);

      if (!team) {
        return next(new AppError("Team not found.", 404));
      }

      // If winners are already calculated and stored, use them
      if (team.winners && team.winners.length > 0 && team.leaderId) {
        const maxVotes = Math.max(...team.winners.map(w => w.votes));
        const chosenLeader = team.winners.find(w =>
          w._id.toString() === team.leaderId?.toString()
        ) || team.winners[0];

        responseData = {
          ...responseData,
          winners: team.winners,
          chosenLeader,
          maxVotes,
          leaderAlreadyAssigned: true,
        };
      } else {
        const maxVotes = Math.max(...teamPlayersWithVotes.map((p) => p.votes));
        const winners = teamPlayersWithVotes.filter((p) => p.votes === maxVotes);

        responseData = {
          ...responseData,
          winners: winners.map((w) => ({
            _id: w._id,
            name: w.firstName + " " + w.lastName,
            votes: w.votes,
          })),
          maxVotes,
          leaderAlreadyAssigned: false,
        };
      }
    }

    res.status(200).json({
      message: isVotingEnded
        ? "Voting has ended. Team leader determined successfully."
        : "Team players votes fetched successfully.",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching team players votes:", error);
    next(new AppError("Failed to fetch team players votes.", 500));
  }
};
export const continueToGame = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sessionId, id } = req.user;

  const sessionService = new SessionService();
  const playerService = new PlayerService();

  try {
    if (!sessionId) {
      return next(new AppError("Session ID is required.", 400));
    }

    const session = await sessionService.fetchSessionById(sessionId);
    if (!session) {
      return next(new AppError("Session not found.", 404));
    }

    if (session.state !== SessionStates.COMPLETED) {
      return next(
        new AppError(
          "Session is not in COMPLETED state, cannot continue to game.",
          400
        )
      );
    }

    const player = await playerService.getPlayerById(id);

    if (!player) {
      return next(new AppError("Player not found.", 404));
    }

    const createPlayerResposne = await axios.post(
      `${session.gameServerUrl}/create-player`,
      {
        teamId: player.teamId._id,
        playerName: player.firstName + " " + player.lastName,
        isLeader: player.teamId._id === (player.teamId as any).leaderId,
      }
    );

    if (createPlayerResposne.status != 201) {
      return next(new AppError("Failed to create player on game server.", 500));
    }

    const token = createPlayerResposne.data.token;

    const gameUrl = session.gameLink + `?token=${token}`;

    res.status(200).json({
      message: "Successfully continued to game.",
      data: {
        gameUrl,
      },
    });
  } catch (error) {
    console.error("Error continuing to game:", error);
    next(new AppError("Failed to continue to game.", 500));
  }
};
