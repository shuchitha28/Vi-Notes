import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  completedSessions: { type: Number, default: 0 },
  avgTypingSpeed: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  profilePic: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  }
},
{ timestamps: true }
);

export default mongoose.model("User", UserSchema);