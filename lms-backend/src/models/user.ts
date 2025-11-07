import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Boolean, default: false },
    image: { type: String },
    role: { type: String,default:"USER" },
    banned: { type: Boolean, default: false },
    banReason: { type: String },
    banExpires: { type: Date },
  },
  { timestamps: true }
);

// Relations
userSchema.virtual("sessions", {
  ref: "Session",
  localField: "id",
  foreignField: "userId",
});

userSchema.virtual("accounts", {
  ref: "Account",
  localField: "id",
  foreignField: "userId",
});

userSchema.virtual("course", {
  ref: "Course",
  localField: "id",
  foreignField: "userId",
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);
export default User;
