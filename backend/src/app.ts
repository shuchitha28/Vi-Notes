import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import sessionRoutes from "./routes/session.js";
import contactRoutes from "./routes/contact.js";

const app = express();

app.use(cors({
  origin: "https://vi-notes-sooty.vercel.app"
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/session", sessionRoutes);

export default app;
