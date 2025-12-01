
import express from "express";
import { createLesson, deleteLesson, reorderLessons } from "../controllers/lessonController.js";
import { verifySession } from "../middleware/verifySession.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
const router = express.Router();

router.post("/create",verifySession,verifyAdmin, createLesson);
router.put("/reorder", verifySession,verifyAdmin,reorderLessons)
router.delete("/delete/:lessonId",verifySession,verifyAdmin,deleteLesson)
export default router;