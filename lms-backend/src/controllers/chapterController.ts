import type { Request, Response } from "express";
import Chapter from "../models/chapter.js";
import Lesson from "../models/lesson.js";

// CREATE chapter
export const createChapter = async (req: Request, res: Response) => {
  try {
    
    const {name , courseId } = req.body;
    

    const maxChapter = await Chapter.findOne({ courseId })
      .sort({ position: -1 }) // highest first
      .lean();
    const maxPosition = maxChapter ? maxChapter.position : 0;
    

    const chapter = await Chapter.create({
      title: name,
      position: maxPosition + 1,
      courseId,
    });
    await chapter.save();

    return res.status(201).json({
      status: "success",
      message: "Chapter created successfully",
      data: chapter,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create chapter",
      data: error,
    });
  }
};

// DELETE chapter + lessons
export const deleteChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;

    await Lesson.deleteMany({ chapterId });
    await Chapter.findByIdAndDelete(chapterId);

    return res.status(200).json({
      status: "success",
      message: "Chapter and related lessons deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to delete chapter",
      data: error,
    });
  }
};
// REORDER chapters

export const reorderChapters = async (req: Request, res: Response) => {
  try {
    const updates: { chapterId: string; position: number }[] = req.body.updates;

    if (!updates || !updates.length) {
      return res.status(400).json({
        status: "error",
        message: "No updates provided",
      });
    }

    // Prepare bulk operations
    const bulkOps = updates.map((item) => ({
      updateOne: {
        filter: { _id: item.chapterId },
        update: { $set: { position: item.position } },
      },
    }));

    // Execute bulkWrite
    const result = await Chapter.bulkWrite(bulkOps);
    console.log(result);
    return res.status(200).json({
      status: "success",
      message: "Chapters reordered successfully",
    });
  } catch (error) {
    console.error("Reorder chapters error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to reorder chapters",
      data: error,
    });
  }
};
