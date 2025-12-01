import type { Request, Response } from "express";
import Lesson from "../models/lesson.js";


export const createLesson = async (req: Request, res: Response) => {
  try {
    
    const { title, chapterId } = req.body;

      const maxLesson = await Lesson.findOne({ chapterId })
          .sort({ position: -1 }) // highest first
          .lean();
        const maxPosition = maxLesson ? maxLesson.position : 0;

    const lesson = await Lesson.create({
      title : title,
      chapterId: chapterId,
      position : maxPosition + 1
    });

    return res.status(201).json({
      status: "success",
      message: "Lesson created successfully",
      data: lesson,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to create lesson",
      data: error,
    });
  }
};



export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;

    await Lesson.findByIdAndDelete(lessonId);

    return res.status(200).json({
      status: "success",
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to delete lesson",
      data: error,
    });
  }
};

export const reorderLessons = async (req: Request, res: Response) => {
  try {
    const updates: { lessonId: string; position: number }[] = req.body.updates;
     
     if (!updates || !updates.length) {
      return res.status(400).json({
        status: "error",
        message: "No updates provided",
      });
    }
    const bulkOps = updates.map((item) => ({
      updateOne: {
        filter: { _id: item.lessonId },
        update: { position: item.position },
      },
    }));

    await Lesson.bulkWrite(bulkOps);

    return res.status(200).json({
      status: "success",
      message: "Lessons reordered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to reorder lessons",
      data: error,
    });
  }
};
