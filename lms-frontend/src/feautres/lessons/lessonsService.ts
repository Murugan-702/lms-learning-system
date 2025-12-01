
import type { ApiResponse } from "@/types/courseType";
import api from "@/utils/api";

export async function createLesson(values:{title: string , chapterId : string }) {
    const res = await api.post<ApiResponse>("/lesson/create", values);
    return res.data;
}

export async function reorderLessons(updates:{lessonId:string , position:number}[]) {
    const res = await api.put<ApiResponse>("/lesson/reorder", { updates });
    return res.data;
}
export async function deleteLessons(lessonId : string) {
    const res = await api.delete<ApiResponse>(`/lesson/delete/${lessonId}`);
    return res.data;
}