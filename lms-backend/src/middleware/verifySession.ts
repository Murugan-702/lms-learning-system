import Session from "../models/session.js";
import User from "../models/user.js";

export const verifySession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No session token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    
    const session = await Session.findOne({ token }).populate("user");
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session token",
      });
    }

    
    if (session.expiresAt < new Date()) {
      
      await Session.deleteOne({ _id: session._id });
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    
    req.user = await User.findOne({ id: session.userId });
    
    req.session = session;

  
    next();
  } catch (err) {
    console.error("verifySession error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while verifying session",
    });
  }
};


