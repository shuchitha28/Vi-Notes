import { Response } from "express";
import Session from "../models/Session";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";
import { Types, Collection, Connection, Error, Schema } from "mongoose";

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

    const { sessionId, content = "", keystrokes = [], pasteEvents = [] } = req.body;

    const totalChars = content.length;

    const totalTimeMinutes =
      keystrokes.reduce((sum: number, k: { keyInterval: number }) => sum + k.keyInterval, 0) /
      1000 /
      60;

    const avgSpeed = totalTimeMinutes > 0 ? totalChars / 5 / totalTimeMinutes : 0;

    const pasteRatio = pasteEvents.length;
    const wasPasted = pasteEvents.length > 0;

    let suspicionScore = 0;
    if (avgSpeed < 20) suspicionScore += 1; // very slow
    if (pasteRatio > 0) suspicionScore += 2; // pasted

    const analysis = { avgSpeed, pasteRatio, suspicionScore, wasPasted };

    let session;

    if (sessionId) {
      session = await Session.findOneAndUpdate(
        { _id: sessionId, userId: req.userId },
        { content, keystrokes, pasteEvents, analysis, submitted: false },
        { returnDocument: "after" }
      );
    } else {
      session = await Session.create({
        userId: req.userId,
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

    const { sessionId, content = "", keystrokes = [], pasteEvents = [] } = req.body;

    const totalChars = content.length;
    const totalTimeMinutes =
      keystrokes.reduce((sum: number, k: { keyInterval: number }) => sum + k.keyInterval, 0) /
      1000 /
      60;

    const avgSpeed = totalTimeMinutes > 0 ? totalChars / 5 / totalTimeMinutes : 0;
    const pasteRatio = pasteEvents.length;
    const wasPasted = pasteEvents.length > 0;

    const suspicionScore = pasteRatio * 0.7 + (avgSpeed < 30 ? 0.3 : 0);

    const analysis = { avgSpeed, pasteRatio, suspicionScore, wasPasted };

    let session;

    if (sessionId) {
      session = await Session.findOneAndUpdate(
        { _id: sessionId, userId: req.userId },
        { content, keystrokes, pasteEvents, analysis, submitted: true },
        { returnDocument: "after" }
      );
    } else {
      session = await Session.create({
        userId: req.userId,
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