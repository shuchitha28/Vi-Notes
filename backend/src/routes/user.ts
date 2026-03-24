import express from "express";
import { getProfile, updateProfile, resetPassword } from "../controllers/profileController";
import { verifyToken } from "../middleware/authMiddleware";
import { getDashboard } from "../controllers/dashboardController";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken,  updateProfile);
router.put("/reset-password", verifyToken, resetPassword);
router.get("/dashboard", verifyToken, getDashboard);

export default router;