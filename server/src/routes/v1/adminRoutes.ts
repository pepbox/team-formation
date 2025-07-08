import express from "express";
import { adminSessionRouter } from "../../modules/session/routes/sessionRoutes";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

import * as adminController from "../../modules/admin/controllers/adminControllers";
import * as teamControllers from "../../modules/players/controllers/teamControllers";

const router = express.Router();

router.post("/create", adminController.createAdmin);
router.post("/login", adminController.loginAdmin);
router.post("/logout", adminController.logoutAdmin);

router.post(
  "/change-teamname",
  authenticateUser,
  authorizeRoles("ADMIN"),
  teamControllers.assignTeamName
);

router.get(
  "/fetch",
  authenticateUser,
  authorizeRoles("ADMIN"),
  adminController.fetchAdmin
);

router.use(
  "/session",
  authenticateUser,
  authorizeRoles("ADMIN"),
  adminSessionRouter
);

export default router;
