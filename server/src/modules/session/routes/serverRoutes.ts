import { Router } from "express";
import * as sessionController from "../controllers/sessionControllers";

const router = Router();

router.post("/create-session", sessionController.createSession);


export default router;