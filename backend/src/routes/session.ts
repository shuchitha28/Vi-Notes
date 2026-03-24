import express from "express";
import { deleteSession, getSessions, saveSession, submitSession } from "../controllers/sessionController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", verifyToken, getSessions);
router.post("/", verifyToken,saveSession);
router.put("/:id", verifyToken, saveSession);
router.post("/submit", verifyToken, submitSession);
router.delete("/:sessionId", verifyToken, deleteSession);

export default router;