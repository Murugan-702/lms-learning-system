export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface AuthState {
  user: User | null;
  sessionToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
