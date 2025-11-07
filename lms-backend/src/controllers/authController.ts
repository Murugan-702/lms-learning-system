import express from "express";
import Verification from "../models/verification.js";
import User from "../models/user.js";
import Session from "../models/session.js";
import { sendOtpEmail } from "../utils/emailService.js";
import crypto from "crypto";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import type { InferSchemaType } from "mongoose";
import type {
  ApiRequest,
  ApiResponse,
  SendOtpRequest,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "../types/admin/authTypes.js";
import Account from "../models/account.js";
dotenv.config();
type UserDocument = InferSchemaType<typeof User.schema> & { _id: any };

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // or appropriate type
      session?: any; // define proper session type if available
    }
  }
}

const generateOtp = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ------------------- SEND OTP -----------------------------------//

export const sendOtp = async (
  req: ApiRequest<SendOtpRequest>,
  res: Response<ApiResponse>
): Promise<Response<ApiResponse>> => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      });
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    await Verification.deleteMany({ identifier: email });

    await Verification.create({
      identifier: email,
      value: otp,
      expiresAt,
    });

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({
      success: false,
      message: "Error sending OTP",
    });
  }
};

// ----------------VERIFY OTP ----------------------------//

export const verifyOtp = async (
  req: ApiRequest<VerifyOtpRequest>,
  res: Response<ApiResponse<VerifyOtpResponse>>
): Promise<Response<ApiResponse<VerifyOtpResponse>>> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    const record = await Verification.findOne({ identifier: email });
    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or already used",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (record.value !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: email.split("@")[0],
        emailVerified: true,
      });
    } else if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await Session.create({
      userId: user._id,
      token,
      expiresAt,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await Verification.deleteMany({ identifier: email });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
        sessionToken: token,
        expiresAt,
      },
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({
      success: false,
      message: "Error verifying OTP",
    });
  }
};

export const logout = async (
  req: express.Request,
  res: express.Response
): Promise<Response<ApiResponse>> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });
    }

    const deleted = await Session.deleteOne({ token });
    if (!deleted.deletedCount) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error logging out" });
  }
};

export const getSession = async (
  req: Request,
  res: Response<ApiResponse>
): Promise<Response<ApiResponse>> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No session token provided" });

    // ✅ Find session by token
    const session = await Session.findOne({ token });
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    // ✅ Find the user linked to this session
    const user = await User.findOne({ id: session.userId });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found for session" });

    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });
      return res
        .status(401)
        .json({ success: false, message: "Session expired" });
    }

    return res.status(200).json({
      success: true,
      message: "Session fetched successfully",
      data: {
        user: user,
        session: session,
      },
    });
  } catch (err) {
    console.error("Error getting session:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error getting session" });
  }
};

export const githubLogin = (req: express.Request, res: express.Response) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user:email`;
  res.json({ url: githubAuthUrl });
};

export const githubCallback = async (
  req: express.Request,
  res: express.Response
) => {
  const { code } = req.query;
  if (!code) {
    return res
      .status(400)
      .send(
        "<script>window.opener.postMessage({ success:false, message:'Missing code' }, '*'); window.close();</script>"
      );
  }

  try {
    // Exchange code for access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) throw new Error("Missing access token");

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email = emailRes.data.find((e: any) => e.primary)?.email;
    const { id: githubId, login, avatar_url } = userRes.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: login,
        image: avatar_url,
        githubId,
      });
    }
     let account = await Account.findOne({
      providerId: "github",
      userId: user.id,
    });

    if (!account) {
      account = await Account.create({
        accountId: githubId.toString(),
        providerId: "github",
        userId: user.id,
        accessToken,
        scope: "read:user,user:email",
      });
    } else {
      // Update tokens if account already exists
      account.accessToken = accessToken;
      account.scope = "read:user,user:email";
      await account.save();
    }

    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await Session.create({
      token: sessionToken,
      userId: user.id,
      expiresAt,
    });

    const payload = JSON.stringify({
      success: true,
      message: "Login Successfully Redirected to Home",
      sessionToken,
      user,
    });

    res.send(`
      <script>
        window.opener.postMessage(${payload}, "*");
        window.close();
      </script>
    `);
  } catch (err) {
    console.error("GitHub OAuth Error:", err);
    res.send(`
      <script>
        window.opener.postMessage({ success:false, message:'GitHub login failed' }, "*");
        window.close();
      </script>
    `);
  }
};
