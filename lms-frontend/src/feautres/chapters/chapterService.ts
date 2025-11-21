import api from "@/utils/api";
import type { ApiResponse } from "@/types/authTypes";

// GET CHAPTERS
export async function getChapters(courseId: string) {
  const res = await api.get<ApiResponse>(`/api/chapters/${courseId}`);
  return res.data;
}

// CREATE CHAPTER
export async function createChapter(values:{name : string , courseId : string}) {
  const res = await api.post<ApiResponse>("/chapter/create", {values});
  return res.data;
}

// DELETE CHAPTER
export async function deleteChapter(chapterId: string) {
  const res = await api.delete<ApiResponse>(`/api/chapters/${chapterId}`);
  return res.data;
}

// REORDER CHAPTERS
export async function reorderChapters(
  updates: { chapterId: string; position: number }[]
) {
  const res = await api.put<ApiResponse>("/chapter/reorder", { updates });
  return res.data;
}
