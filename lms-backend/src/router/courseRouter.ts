import express from "express";
import {
  createCourse,
  editCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  getMyCourses,
} from "../controllers/courseController.js";

import { verifySession } from "../middleware/verifySession.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/my/courses", verifySession,verifyAdmin, getMyCourses);


// Public Routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);



// Admin Routes
router.post("/", verifySession, verifyAdmin, createCourse);
router.put("/:id", verifySession, verifyAdmin, editCourse);
router.delete("/:id", verifySession, verifyAdmin, deleteCourse);

export default router;
