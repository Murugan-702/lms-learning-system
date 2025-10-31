import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    expiresAt: {
      type: Date,
      required: true,
       index: { expires: 0 },
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
