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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
