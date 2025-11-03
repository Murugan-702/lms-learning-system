import express from "express";
import { sendOtp, verifyOtp, logout, githubLogin, getSession, githubCallback } from "../controllers/authController.js";
import { verifySession } from "../middleware/verifySession.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);
router.get("/github", githubLogin);
router.get("/callback/github", githubCallback);


router.get("/session", verifySession, getSession);
export default router;
