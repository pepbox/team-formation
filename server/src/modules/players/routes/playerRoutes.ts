import { Router } from "express";
import * as playerControllers from "../controllers/playerController";
import * as teamControllers from "../controllers/teamControllers";

const protectedPlayerRouter = Router();
const publicPlayerRouter= Router();

publicPlayerRouter.post("/create", playerControllers.createPlayer);
protectedPlayerRouter.get("/fetch", playerControllers.fetchPlayer);
protectedPlayerRouter.get("/fetch-my-team", playerControllers.fetchMyTeam);
protectedPlayerRouter.post("/vote-for-leader", playerControllers.voteForLeader);


protectedPlayerRouter.post("/assign-teamname", teamControllers.assignTeamName);
protectedPlayerRouter.post("/fetch-all-teams", teamControllers.getAllTeamsData);


export { publicPlayerRouter,protectedPlayerRouter};
