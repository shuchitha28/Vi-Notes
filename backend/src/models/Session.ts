import mongoose, { Document } from "mongoose";

interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  keystrokes: {
    keyInterval: number;
    timestamp: number;
  }[];
  pasteEvents: {
    length: number;
    timestamp: number;
  }[];
  analysis: {
    wasPasted: boolean;
    avgSpeed: number;
    pasteRatio: number;
    suspicionScore: number;
  };
  submitted: boolean; 
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new mongoose.Schema<ISession>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, default: "" },

    keystrokes: [
      {
        keyInterval: Number,
        timestamp: Number,
      },
    ],

    pasteEvents: [
      {
        length: Number,
        timestamp: Number,
      },
    ],

    analysis: {
      avgSpeed: { type: Number, default: 0 },
      pasteRatio: { type: Number, default: 0 },
      suspicionScore: { type: Number, default: 0 },
    },

    submitted: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export default mongoose.model<ISession>("Session", SessionSchema);