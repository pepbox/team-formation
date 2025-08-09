import express from "express";
import userRoutes from "./userRoutes";
import adminRoutes from "./adminRoutes";
import commonRoutes from "./commonRoutes";
import serverRoutes from "../../modules/session/routes/serverRoutes"

const router = express.Router();

// Health check endpoint for load testing
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: 'Server is healthy'
  });
});

router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/common",commonRoutes);

router.use("/server",serverRoutes);



export default router;
