import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
   
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    token: { type: String, required: true, unique: true },
    ipAddress: { type: String },
    userAgent: { type: String },
    userId: { type: String, required: true },
    impersonatedBy: { type: String },
  },
  { timestamps: true }
);

sessionSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
