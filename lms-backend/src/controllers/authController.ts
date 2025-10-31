import express from "express";
import Verification from "../models/verification.js";
import User from "../models/user.js"
import Session from "../models/session.js";
import { sendOtpEmail } from "../utils/emailService.js";
import crypto from "crypto";

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
        emailVerified: new Date(),
      });
    } else if (!user.emailVerified) {
      user.emailVerified = new Date();
      await user.save();
    }

    // ✅ Create session
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

    const session = await Session.create({
      user: user._id,
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
