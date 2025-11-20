import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { type Chapter } from "../../types/courseTypes";
import type { ApiResponse } from "@/types/authTypes";
import api from "@/utils/api";

interface ChaptersState {
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
}

const initialState: ChaptersState = {
  chapters: [],
  loading: false,
  error: null,
};

// GET ALL CHAPTERS WITH LESSONS
export const getChapters = createAsyncThunk(
  "chapters/getChapters",
  async (courseId: string) => {
    const res = await api.get<ApiResponse>(`/api/chapters/${courseId}`);
    return res.data;
  }
);

// CREATE CHAPTER
export const createChapter = createAsyncThunk(
  "chapters/createChapter",
  async ({ name , courseId }: { name:string , courseId:string }) => {
    const res = await api.post<ApiResponse>("/chapter/create", {
      name , courseId
    });
    console.log(res);
    return res.data;
  }
);

// DELETE CHAPTER
export const deleteChapter = createAsyncThunk(
  "chapters/deleteChapter",
  async (chapterId: string) => {
    const res = await api.delete<ApiResponse>(`/api/chapters/${chapterId}`);
    return res.data;
  }
);

// REORDER CHAPTERS
export const reorderChapters = createAsyncThunk(
  "chapters/reorderChapters",
  async (
    updates: { chapterId: string; position: number }[]
  ) => {
    const res = await api.put<ApiResponse>("/chapter/reorder", { updates });
    console.log(res.data);
    return res.data;
  }
);

// ======================================================
// SLICE
// ======================================================
const chaptersSlice = createSlice({
  name: "chapters",
  initialState,
  reducers: {
    // Local reducers (if needed later)
  },
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getChapters.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChapters.fulfilled, (state, action) => {
        state.chapters = action.payload;
        state.loading = false;
      })

      // CREATE
      .addCase(createChapter.fulfilled, (state, action) => {
        state.chapters.push(action.payload);
      })

      // DELETE
      .addCase(deleteChapter.fulfilled, (state, action) => {
        state.chapters = state.chapters.filter(
          (c) => c._id !== action.payload
        );
      })

      // REORDER
      .addCase(reorderChapters.fulfilled, (state, action) => {
        action.payload.forEach((u) => {
          const chapter = state.chapters.find((c) => c._id === u.chapterId);
          if (chapter) chapter.position = u.newPosition;
        });

        state.chapters.sort((a, b) => a.position - b.position);
      });
  },
});

export default chaptersSlice.reducer;
