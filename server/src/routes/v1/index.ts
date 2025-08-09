import express from "express";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import commonRoutes from "./commonRoutes";
import serverRoutes from "../../modules/session/routes/serverRoutes"

const router = express.Router();

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/common",commonRoutes);

router.use("/server",serverRoutes);



export default router;
