import { createSlice } from "@reduxjs/toolkit";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getMyCourses,
  getCourseById,
} from "./courseThunk";
import type { Course } from "./courseTypes";

interface CourseState {
  courses: Course[];
  myCourses: Course[];
  selectedCourse?: Course | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: CourseState = {
  courses: [],
  myCourses: [],
  selectedCourse: null,
  loading: false,
  error: null,
  message: null,
};

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE COURSE
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        if (action.payload.data) state.courses.push(action.payload.data);
      })
      .addCase(createCourse.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // UPDATE COURSE
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        const updated = action.payload.data;
        if (updated) {
          const index = state.courses.findIndex((c) => c.id === updated.id);
          if (index !== -1) state.courses[index] = updated;
        }
      })

      // DELETE COURSE
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })

      // GET ALL COURSES
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data || [];
      })

      // GET MY COURSES
      .addCase(getMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.myCourses = action.payload.data || [];
      })

      // GET COURSE BY ID
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload.data || null;
      });
  },
});

export const { clearMessage } = courseSlice.actions;
export default courseSlice.reducer;
