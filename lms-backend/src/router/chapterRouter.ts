import { verifyAdmin } from './../middleware/verifyAdmin.js';
import { verifySession } from './../middleware/verifySession.js';
import express from "express";
import { createChapter, deleteChapter, reorderChapters } from "../controllers/chapterController.js";
const router = express.Router();

/* create - chapter */

router.post("/create", verifySession, verifyAdmin, createChapter);
router.put("/reorder", verifySession, verifyAdmin, reorderChapters)
router.delete("/delete/:chapterId",verifySession,verifyAdmin,deleteChapter)

export default router;
