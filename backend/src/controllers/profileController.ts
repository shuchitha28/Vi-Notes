import { Response } from "express";
import User from "../models/User";
import Session from "../models/Session";
import { AuthRequest } from "../middleware/authMiddleware";
import bcrypt from "bcryptjs";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
   
    const sessions = await Session.find({
      userId: req.userId,
      submitted: true,
    });

    const completedSessions = sessions.length;

    const avgTypingSpeed =
      sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.analysis?.avgSpeed || 0), 0) /
          sessions.length
        : 0;

    const score = sessions.length > 0
      ? sessions.reduce((sum, s) => {
          const sScore = 1 - (s.analysis?.suspicionScore || 0);
          return sum + Math.min(Math.max(sScore, 0), 1);
        }, 0)
      : 0;

    res.json({
      ...user.toObject(),
      completedSessions,
      avgTypingSpeed: Math.round(avgTypingSpeed),
      score: Math.round(score * 100), 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const {
      username,
      email,
      bio,
      completedSessions,
      avgTypingSpeed,
      score,
      profilePic,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.completedSessions = completedSessions ?? user.completedSessions;
    user.avgTypingSpeed = avgTypingSpeed ?? user.avgTypingSpeed;
    user.score = score ?? user.score;

    if (profilePic) {
      user.profilePic = profilePic;
    }

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(currentPassword, user.password || "");
    if (!valid) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};