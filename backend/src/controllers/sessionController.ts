import { Response } from "express";
import Session from "../models/Session";
import { AuthRequest } from "../middleware/authMiddleware";

// GET all sessions
export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
    
    const sessions = await Session.find({ userId: req.userId })
      .populate({ path: "userId", select: "username" }) 
      .sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// SAVE or UPDATE draft
export const saveSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const { sessionId, title = "Untitled Session", content = "", keystrokes = [], pasteEvents = [] } = req.body;

    const totalTimeMinutes =
      keystrokes.reduce((sum: number, k: { keyInterval: number }) => sum + k.keyInterval, 0) /
      1000 /
      60;

    const wordsArray = content.trim().split(/\s+/);
    const totalWords = wordsArray.filter((w: string | any[]) => w.length > 0).length;

    const avgSpeed = totalTimeMinutes > 0 ? totalWords / totalTimeMinutes : 0;
    const pasteRatio = pasteEvents.length;
    const wasPasted = pasteEvents.length > 0;

    let suspicionScore = pasteRatio * 0.7 + (avgSpeed < 30 ? 0.3 : 0);
    suspicionScore = Math.min(Math.max(suspicionScore, 0), 1);

    const analysis = { avgSpeed, pasteRatio, suspicionScore, wasPasted };

    let session;

    if (sessionId) {
      session = await Session.findOneAndUpdate(
        { _id: sessionId, userId: req.userId },
        { title, content, keystrokes, pasteEvents, analysis, submitted: false },
        { returnDocument: "after" }
      );
    } else {
      session = await Session.create({
        userId: req.userId,
        title,
        content,
        keystrokes,
        pasteEvents,
        analysis,
        submitted: false,
      });
    }

    res.status(201).json(session);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// SUBMIT session
export const submitSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const { sessionId, title = "Untitled Session", content = "", keystrokes = [], pasteEvents = [] } = req.body;

    const totalTimeMinutes =
      keystrokes.reduce((sum: number, k: { keyInterval: number }) => sum + k.keyInterval, 0) /
      1000 /
      60;

    const wordsArray = content.trim().split(/\s+/);
    const totalWords = wordsArray.filter((w: string | any[]) => w.length > 0).length;

    const avgSpeed = totalTimeMinutes > 0 ? totalWords / totalTimeMinutes : 0;
    const pasteRatio = pasteEvents.length;
    const wasPasted = pasteEvents.length > 0;

    let suspicionScore = pasteRatio * 0.7 + (avgSpeed < 30 ? 0.3 : 0);
    suspicionScore = Math.min(Math.max(suspicionScore, 0), 1);

    const analysis = { avgSpeed, pasteRatio, suspicionScore, wasPasted };

    let session;

    if (sessionId) {
      session = await Session.findOneAndUpdate(
        { _id: sessionId, userId: req.userId },
        { title, content, keystrokes, pasteEvents, analysis, submitted: true },
        { returnDocument: "after" }
      );
    } else {
      session = await Session.create({
        userId: req.userId,
        title,
        content,
        keystrokes,
        pasteEvents,
        analysis,
        submitted: true,
      });
    }

    res.status(201).json({ message: "Submission saved!", session });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// DELETE session
export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { sessionId } = req.params;

    const deleted = await Session.findOneAndDelete({
      _id: sessionId,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(200).json({
        message: "Session already deleted or not found",
      });
    }

    return res.status(200).json({
      message: "Session deleted successfully",
    });

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "Server error",
    });
  }
};