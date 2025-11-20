export interface Lesson {
  _id: string;
  title: string;
  content?: string;
  position: number;
  chapterId: string;
}

export interface Chapter {
  _id: string;
  title: string;
  position: number;
  courseId: string;
  lessons: Lesson[];
}