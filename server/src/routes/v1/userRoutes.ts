import express from "express";
import {
  protectedPlayerRouter,
  publicPlayerRouter,
} from "../../modules/players/routes/playerRoutes";
import {
  authenticateUser,
  authorizeRoles,
} from "../../middlewares/authMiddleware";

const router = express.Router();

router.use("/player", publicPlayerRouter);
router.use(
  "/player",
  authenticateUser,
  authorizeRoles("USER"),
  protectedPlayerRouter
);

export default router;
