import express from "express";
import playerRoutes from "../../modules/players/routes/playerRoutes";

const router = express.Router();

router.use("/player", playerRoutes);

export default router;
