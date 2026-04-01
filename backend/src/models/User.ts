import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  authProvider: "local" | "google";
  googleId?: string;
  bio?: string;
  completedSessions?: number;
  avgTypingSpeed?: number;
  score?: number;
  profilePic?: string;
}
const UserSchema = new mongoose.Schema<IUser>(
  {
    username: { 
      type: String, 
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, 
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },

    password: {
      type: String,
      required: function (this: IUser) { // <-- tell TS the type of `this`
        return this.authProvider === "local";
      },
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      sparse: true, 
    },

    bio: { 
      type: String, 
      default: "",
      maxlength: 200,
    },

    completedSessions: { type: Number, default: 0 },
    avgTypingSpeed: { type: Number, default: 0 },
    score: { type: Number, default: 0 },

    profilePic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
