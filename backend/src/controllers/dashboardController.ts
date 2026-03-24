import { Response } from "express";
import Session from "../models/Session";
import { AuthRequest } from "../middleware/authMiddleware";

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    // Fetch all submitted sessions
    const sessions = await Session.find({
      userId: req.userId,
      submitted: true,
    }).sort({ createdAt: 1 });

    // Only include genuine typing sessions (no pasting)
    const genuineSessions = sessions.filter(s => !s.analysis?.wasPasted);

    const totalSessions = genuineSessions.length;

    // Speeds and scores only for genuine sessions
    const speeds = genuineSessions.map(s => s.analysis?.avgSpeed || 0);
    const scores = genuineSessions.map(s => {
      const suspicion = s.analysis?.suspicionScore || 0;
      return (1 - suspicion) * 100;
    });

    const avgSpeed =
      speeds.length > 0
        ? speeds.reduce((a, b) => a + b, 0) / speeds.length
        : 0;

    const avgScore =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;

    // Build trend data: mark pasted sessions but include all for visualization
    const sessionTrends = sessions.map(s => ({
      date: new Date(s.createdAt).toLocaleDateString(),
      speed: s.analysis?.avgSpeed || 0,
      score: (1 - (s.analysis?.suspicionScore || 0)) * 100,
      pasted: s.analysis?.wasPasted || false,
    }));

    res.json({
      totalSessions,
      avgSpeed: Math.round(avgSpeed),
      avgScore: Math.round(avgScore),
      speedTrend: speeds,
      scoreTrend: scores,
      sessions: sessionTrends,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};