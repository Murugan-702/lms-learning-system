export interface AdminCourseType {
  id: string;
  title: string;
  smallDescription: string;
  duration: string;
  level: string;
  status: string;
  price: number;
  fileKey: string | null;
  slug: string;
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

