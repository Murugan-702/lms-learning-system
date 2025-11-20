import type {Request,Response, NextFunction } from "express";

export const verifyAdmin = async (req:Request, res:Response, next:NextFunction) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({
        status:"error",
        message: "User not authenticated",
      });
    }

  
    if (req.user.banned) {
      return res.status(403).json({
        status:"error",
        message: "User is banned",
      });
    }


    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        status : "error",
        message: "Access denied. Admins only.",
      });
    }

    
    next();
  } catch (err) {
    console.error("verifyAdmin error:", err);
    res.status(500).json({
      status:"error",
      message: "Internal server error while verifying admin privileges",
    });
  }
};