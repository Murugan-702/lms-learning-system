// courseApi.ts

import api from "../../utils/api";
import type { AdminCourseSingularType, ApiResponse, Course } from "../../types/courseType";

// CREATE COURSE
export async function createCourse(payload: Partial<Course>) {
  try {
    const res = await api.post("/courses", payload);
    return res.data as ApiResponse<Course>;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Create failed");
  }
}

// UPDATE COURSE
export async function updateCourse(
  id: string,
  updates: Partial<Course>
) {
  try {
    const res = await api.put(`/courses/${id}`, updates);
    return res.data as ApiResponse<Course>;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Update failed");
  }
}

// DELETE COURSE
export async function deleteCourse(id: string) {
  try {
    const res = await api.delete(`/courses/${id}`);
    return res.data as ApiResponse<null>;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Delete failed");
  }
}

// GET ALL COURSES
export async function getAllCourses() {
  try {
    const res = await api.get("/courses");
    return res.data as ApiResponse<Course[]>;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Fetch failed");
  }
}

// GET MY COURSES
export async function getMyCourses() {
  try {
    const res = await api.get("/courses/my/courses");
    return res.data as ApiResponse<Course[]>;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Fetch failed");
  }
}

// GET COURSE BY ID
export async function getCourseById(id: string) {
  try {
    const res = await api.get(`/courses/${id}`);
    return res.data as ApiResponse<AdminCourseSingularType>;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Fetch failed");
  }
}
