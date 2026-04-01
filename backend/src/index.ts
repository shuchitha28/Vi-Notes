import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI as string;

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGODB_URI not defined");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error("GOOGLE_CLIENT_ID not defined");
    }

    const mongooseConnection = await mongoose.connect(MONGO_URI, {
      dbName: "vinotes", 
    });

    console.log(
      `✅ MongoDB connected: ${mongooseConnection.connection.host}`
    );

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
