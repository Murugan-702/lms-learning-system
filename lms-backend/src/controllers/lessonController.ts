import type { Request, Response } from "express";
import Lesson from "../models/lesson.js";


export const createLesson = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.params;
    const { title, description, thumbnailKey, videoUrl, position } = req.body;

    const lesson = await Lesson.create({
      title,
      description,
      thumbnailKey,
      videoUrl,
      position,
      chapterId,
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
    const updates: Array<{ lessonId: string; position: number }> = req.body;

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
