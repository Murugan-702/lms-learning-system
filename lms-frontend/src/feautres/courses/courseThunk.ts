import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import type { ApiResponse, Course } from "./courseTypes";


export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (payload: Partial<Course>, { rejectWithValue }) => {
    try {
      const res = await api.post("/courses", payload);
      return res.data as ApiResponse<Course>;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Create failed" });
    }
  }
);


export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, updates }: { id: string; updates: Partial<Course> }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/courses/${id}`, updates);
      return res.data as ApiResponse<Course>;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Update failed" });
    }
  }
);


export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log(id);
      const res = await api.delete(`/courses/${id}`);
      console.log("res from thunk", res);
      return res.data as ApiResponse<null>;
    } catch (err:any) {
      return rejectWithValue(err.response?.data || { message: "Delete failed" });
    }
  }
);


export const getAllCourses = createAsyncThunk(
  "courses/getAllCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/courses");
      return res.data as ApiResponse<Course[]>;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Fetch failed" });
    }
  }
);


export const getMyCourses = createAsyncThunk(
  "courses/getMyCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/courses/my/courses");
      return res.data as ApiResponse<Course[]>;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Fetch failed" });
    }
  }
);

export const getCourseById = createAsyncThunk(
  "courses/getCourseById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/courses/${id}`);
      return res.data as ApiResponse<Course>;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: "Fetch failed" });
    }
  }
);
