import { Router } from "express";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middlewares/authMiddleware";
import {
  commonSessionRouter,
} from "../../modules/session/routes/sessionRoutes";

const router = Router();

router.use(
  "/session",
  authenticateUser,
  authorizeRoles("USER", "ADMIN"),
  commonSessionRouter
);



export default router;
