import Session from "../models/session.js";
import User from "../models/user.js";

/**
 * Middleware to verify user's active session
 * Checks Bearer token, validates session expiry, and attaches user to req
 */
export const verifySession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🛑 1. Check for token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No session token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // 🔍 2. Find session in DB
    const session = await Session.findOne({ token }).populate("user");
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session token",
      });
    }

    // ⏰ 3. Check expiration
    if (session.expiresAt < new Date()) {
      // Clean up expired session
      await Session.deleteOne({ _id: session._id });
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    // ✅ 4. Attach user + session to request
    req.user = session.user;
    req.session = session;

    // Continue to next route/controller
    next();
  } catch (err) {
    console.error("verifySession error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while verifying session",
    });
  }
};
