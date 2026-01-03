import { Router } from "express";
import * as sessionController from "../controllers/sessionControllers";

const router = Router();

router.post("/create-session", sessionController.createSession);
router.post("/update-session", sessionController.updateSession);

export default router;