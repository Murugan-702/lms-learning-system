import type { Request, Response, NextFunction } from "express";
import Session from "../models/session.js";
import User from "../models/user.js";

export const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status : "error",
        message: "No session token provided",
      });
    }

    
    const token = authHeader.split(" ")[1];
    

  
    const session = await Session.findOne({ token });

    if (!session) {
      return res.status(401).json({
        status : "error",
        message: "Invalid or expired session token",
      });
    }
    
    
    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ _id: session._id });
      return res.status(401).json({
        status : "error",
        message: "Session expired. Please log in again.",
      });
    }
    
    
    const user = await User.findOne({_id: session.userId });
    
    
    if (!user) {
      
      await Session.deleteOne({ _id: session._id });
      return res.status(401).json({
        status :"error",
        message: "User associated with this session no longer exists.",
      });
      
      
      
    }
    

  
    req.user = user;
    req.session = session;

  
    next();
  } catch (err) {
    console.error("verifySession error:", err);
    res.status(500).json({
      status :"error",
      message: "Internal server error while verifying session",
    });
  }
};
