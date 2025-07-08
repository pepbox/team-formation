import { Router } from "express";
import * as sessionController from "../controllers/sessionControllers";

const adminSessionRouter = Router();
const commonSessionRouter = Router();

commonSessionRouter.get(
  "/fetch-session-state",
  sessionController.fetchSessionState
);
commonSessionRouter.get("/fetch-all-players", sessionController.fetchAllPlayers);
commonSessionRouter.get("/fetch-all-teams", sessionController.fetchAllTeams);


adminSessionRouter.post(
  "/start-team-formation",
  sessionController.startTeamFormation
);
adminSessionRouter.post(
  "/start-leader-voting",
  sessionController.startLeaderVoting
);


adminSessionRouter.post("/finish-session", sessionController.finishSession);

export { adminSessionRouter, commonSessionRouter };
