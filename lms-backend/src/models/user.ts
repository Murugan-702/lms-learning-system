import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Date,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: false, 
    },
  },
  { timestamps: true }
);


userSchema.virtual("sessions", {
  ref: "Session",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("accounts", {
  ref: "Account",
  localField: "_id",
  foreignField: "user",
});


userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

const User = mongoose.model("User", userSchema);
export default User;
