
import express from "express";
import Verification from "../models/verification.js";
import User from "../models/user.js"
import Session from "../models/session.js";
import { sendOtpEmail } from "../utils/emailService.js";
import crypto from "crypto";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"
import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * @route POST /api/auth/send-otp
 */
export const sendOtp = async (req:express.Request, res:express.Response) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: "Email required" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Delete previous OTPs
    await Verification.deleteMany({ identifier: email });

    await Verification.create({
      identifier: email,
      value: otp,
      expiresAt,
    });

    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};

/**
 * @route POST /api/auth/verify-otp
 */
export const verifyOtp = async (req:express.Request, res:express.Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP required" });

    const record = await Verification.findOne({ identifier: email });

    if (!record)
      return res
        .status(400)
        .json({ success: false, message: "OTP not found or already used" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ success: false, message: "OTP expired" });

    if (record.value !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    // ✅ OTP valid → find or create user
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

    // ✅ Create session
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    const session = await Session.create({
      userId: user._id,
      token,
      expiresAt,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // ✅ Clean up OTP
    await Verification.deleteMany({ identifier: email });

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      sessionToken: token,
      expiresAt,
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
};

/**
 * @route POST /api/auth/logout
 */
export const logout = async (req:express.Request, res:express.Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "No token provided" });

    const deleted = await Session.deleteOne({ token });
    if (!deleted.deletedCount)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ success: false, message: "Error logging out" });
  }
};


/**
 * @route GET /api/auth/session
 * Verify session token and return user info
 */
export const getSession = async (req, res) => {
  try {
    const user = req.user;
    const session = req.session;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      session: {
        token: session.token,
        expiresAt: session.expiresAt,
      },
    });
  } catch (err) {
    console.error("Get session error:", err);
    res.status(500).json({ success: false, message: "Error getting session" });
  }
};





export const githubLogin = (req: express.Request, res: express.Response) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user:email`;
  res.json({ url: githubAuthUrl });
};

export const githubCallback = async (req: express.Request, res: express.Response) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("<script>window.opener.postMessage({ success:false, message:'Missing code' }, '*'); window.close();</script>");
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

    // Fetch user info
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const email = emailRes.data.find((e: any) => e.primary)?.email;
    const { id: githubId, login, avatar_url } = userRes.data;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: login,
        avatar: avatar_url,
        githubId,
      });
    }

    // Create session
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await Session.create({
      token: sessionToken,
      userId: user.id,
      expiresAt,
    });

    // Send result to popup → parent via postMessage
    const payload = JSON.stringify({
      success: true,
      message: "GitHub login successful",
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

