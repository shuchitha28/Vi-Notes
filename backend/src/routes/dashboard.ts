import express from "express";
import { getDashboard } from "../controllers/dashboardController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/dashboard", verifyToken, getDashboard);

export default router;