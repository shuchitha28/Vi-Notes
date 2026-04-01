import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import sessionRoutes from "./routes/session";
import contactRoutes from "./routes/contact";

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
