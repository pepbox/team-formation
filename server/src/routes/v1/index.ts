import express from "express";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);

export default router;
