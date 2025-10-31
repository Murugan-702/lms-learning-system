import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    accountId: {
      type: String,
    },
    providerId: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    idToken: {
      type: String,
    },
    accessTokenExpiresAt: {
      type: Date,
    },
    refreshTokenExpiresAt: {
      type: Date,
    },
    scope: {
      type: String,
    },
    password: {
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

const Account = mongoose.model("Account", accountSchema);
export default Account;
