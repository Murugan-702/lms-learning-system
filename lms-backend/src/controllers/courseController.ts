import type{ Request, Response } from "express";
import Course from "../models/courses.js";
import slugifyLib from "slugify";
import type { ApiResponse } from "../types/admin/authTypes.js";
const slugify = slugifyLib.default || slugifyLib;


export const createCourse = async (req: Request, res: Response):Promise<Response<ApiResponse>> => {
  try {
    const user = (req as any).user;
    console.log(user)

    const { title,slug, description, fileKey, price, duration, level, category, smallDescription, status } = req.body;

    if (!title ||!slug || !description || !fileKey || !price || !duration || !category || !smallDescription||!status) {
      return res.status(400).json({ status :"error", message: "All required fields must be provided" });
    }

    const existing = await Course.findOne({ slug });
    if (existing) {
      return res.status(400).json({ status :"error", message: "A course with this title already exists" });
    }

    const newCourse = await Course.create({
      title,
      description,
      fileKey,
      price,
      duration,
      level,
      category,
      smallDescription,
      slug,
      status,
      userId: user.id,
    });
    console.log(newCourse)


    return res.status(201).json({
      status : "success",
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (err: any) {
    console.error("Create course error:", err);
    return res.status(500).json({ status:"error", message: "Failed to create course" });
  }
};


export const editCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Update slug if title changes
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (err: any) {
    console.error("Edit course error:", err);
    res.status(500).json({ success: false, message: "Failed to update course" });
  }
};


export const getAllCourses = async (_req: Request, res: Response):Promise<Response<ApiResponse>> => {
  try {
    const courses = await Course.find();
    return res.status(200).json({
      status: "success",
      message:"Courses fetched successfully",
      data: courses,
    });
  } catch (err: any) {
    console.error("Get all courses error:", err);
    return res.status(500).json({ status:"error", message: "Failed to fetch courses" });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    

    const course = await Course.findOne({ _id:id })  // your custom id field
      .populate({
        path: "chapters",
        options: { sort: { position: 1 } }, // sort chapters by position
        populate: {
          path: "lessons",
          options: { sort: { position: 1 } }, // sort lessons by position
        },
      })
      .populate("user"); 

    if (!course) {
      return res.status(404).json({
        status:"error",
        message: "Course not found",
      });
    }

    return res.status(200).json({
      status :"success",
      message: "Course fetched successfully",
      data: course,
    });
  } catch (err) {
    console.error("Get course error:", err);
    return res.status(500).json({
      status:"error",
      message: "Failed to fetch course",
    });
  }
};


export const deleteCourse = async (req: Request, res: Response):Promise<Response<ApiResponse>> => {
  try {
    const { id } = req.params;
    console.log(id);

    const course = await Course.findOne({_id : id})
    console.log(course);
    if (!course) {
      return res.status(404).json({ status:"error", message: "Course not found" });
    }

    await Course.findOneAndDelete({ _id: id });

    return res.status(200).json({
      status : "success",
      message: "Course deleted successfully",
    });
  } catch (err: any) {
    console.error("Delete course error:", err);
    return res.status(500).json({ status:"error", message: "Failed to delete course" });
  }
};



export const getMyCourses = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const courses = await Course.find({ userId:userId });

    res.status(200).json({
      success: true,
      message : "Courses Fetched successfully",
      data: courses,
    });
  } catch (err: any) {
    console.error("Get my courses error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your courses",
    });
  }
};
