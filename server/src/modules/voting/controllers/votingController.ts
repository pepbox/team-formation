import { Request, Response, NextFunction } from "express";
import VotingManager from "../../../services/voting/VotingManager";
import AppError from "../../../utils/appError";

export const getVotingStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.user.sessionId;

    if (!sessionId) {
      return next(new AppError("Session ID is required.", 400));
    }

    const votingManager = VotingManager.getInstance();
    const isVotingActive = votingManager.isVotingActive(sessionId);
    const remainingTime = votingManager.getRemainingTime(sessionId);

    res.status(200).json({
      success: true,
      data: {
        isVotingActive,
        remainingTime,
        sessionId,
      },
    });
  } catch (error) {
    console.error("Error getting voting status:", error);
    next(new AppError("Failed to get voting status.", 500));
  }
};
