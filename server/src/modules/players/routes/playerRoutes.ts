import { Router } from "express";
import * as playerControllers from "../controllers/playerController";
import * as teamControllers from "../controllers/teamControllers";
import { uploadMiddleware } from "../../../services/fileUpload";

const protectedPlayerRouter = Router();
const publicPlayerRouter = Router();

publicPlayerRouter.post(
  "/create",
  uploadMiddleware.single("profilePicture", {
    allowedMimeTypes: ["image/jpeg", "image/png", "image/gif"],
    maxFileSize: 20 * 1024 * 1024,
    folder: "profile-pictures",
  }),
  playerControllers.createPlayer
);
protectedPlayerRouter.get("/fetch", playerControllers.fetchPlayer);
protectedPlayerRouter.get("/fetch-my-team", playerControllers.fetchMyTeam);
protectedPlayerRouter.post("/vote-for-leader", playerControllers.voteForLeader);
protectedPlayerRouter.post("/logoutPlayer", playerControllers.logoutPlayer);
protectedPlayerRouter.get(
  "/fetch-teamplayers-votes",
  playerControllers.fetchMyTeamPlayerVotes
);
protectedPlayerRouter.post(
  "/continue-to-game",
  playerControllers.continueToGame
);

protectedPlayerRouter.post("/assign-teamname", teamControllers.assignTeamName);
protectedPlayerRouter.get("/fetch-all-teams", teamControllers.getAllTeamsData);
protectedPlayerRouter.get(
  "/fetch-particular-team",
  teamControllers.getTeamById
);


export { publicPlayerRouter, protectedPlayerRouter };
