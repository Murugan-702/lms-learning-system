

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: string;
  banned: boolean;
  banReason?: string;
  banExpires?: string | Date;

  createdAt: string | Date;
  updatedAt: string | Date;

  
  sessions?: Session[];
}

export interface Session {
  id: string;
  expiresAt: string | Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  impersonatedBy?: string;

  createdAt: string | Date;
  updatedAt: string | Date;

  user?: User; 
}

export interface ApiResponse<T = unknown> {

  status: "success" | "error";
  message: string;
  data?: T;
}
