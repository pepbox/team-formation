import express from 'express';
import sessionRoutes from "../../modules/session/routes/sessionRoutes"

const router = express.Router();

router.use("/session",sessionRoutes)

export default router;