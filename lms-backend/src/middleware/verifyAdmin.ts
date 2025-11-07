
export const verifyAdmin = async (req, res, next) => {
  try {
    // Ensure the session middleware ran first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Check if the user is banned
    if (req.user.banned) {
      return res.status(403).json({
        success: false,
        message: "User is banned",
      });
    }

    // Check admin role
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    // Continue to next handler
    next();
  } catch (err) {
    console.error("verifyAdmin error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while verifying admin privileges",
    });
  }
};