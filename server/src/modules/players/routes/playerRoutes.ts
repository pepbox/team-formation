import { Router } from "express";
import * as playerControllers from "../controllers/playerController";
import * as teamControllers from "../controllers/teamControllers";

const router = Router();

router.post("/create", playerControllers.createPlayer);
router.get("/fetch", playerControllers.fetchPlayer);
router.get("/fetch-my-team", playerControllers.fetchMyTeam);
router.post("/vote-for-leader", playerControllers.voteForLeader);


router.post("/assign-teamname", teamControllers.assignTeamName);
router.post("/fetch-all-teams", teamControllers.getAllTeamsData);


export default router;
