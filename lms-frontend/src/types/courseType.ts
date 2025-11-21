


export interface Course {
  id: string;
  title: string;
  description: string;
  smallDescription: string;
  price: number;
  duration: number;
  level: string;
  category: string;
  slug: string;
  status: string;
  fileKey: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCourseSingularType {
  _id: string;
  title: string;
  description: string;
  fileKey: string;
  price: number;
  duration: number;
  level: string;
  status: string;
  slug: string;
  smallDescription: string;
  category: string;

  chapters: {
    id: string;
    title: string;
    position: number;

    lessons: {
      id: string;
      title: string;
      description: string;
      thumbnailKey: string;
      position: number;
      videoUrl: string;
    }[];
  }[];
}

export interface ApiResponse<T> {
  status: "success"| "error"
  message: string;
  data?: T;
}
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