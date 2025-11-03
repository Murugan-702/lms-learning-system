import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import axios from "axios";
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface GithubLoginResponse {
  success: boolean;
  message: string;
  sessionToken: string;
  user: User;
}

export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email: string) => {
    const { data } = await api.post("/auth/send-otp", { email });
    return data;
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }: { email: string; otp: string }) => {
    console.log(email, otp);
   const { data } = await api.post("/auth/verify-otp", { email, otp });
    localStorage.setItem("sessionToken", data.sessionToken);
    return data;
  }
);


export const verifySession = createAsyncThunk("auth/verifySession", async () => {

  const { data } = await api.get("/auth/session");
  
  return data;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  const token = localStorage.getItem("sessionToken");
  if (!token) throw new Error("No token");
  const { data } = await api.post("/auth/logout");
  localStorage.removeItem("sessionToken");
  return data;
});

export const githubLogin = createAsyncThunk<
  GithubLoginResponse,
  void,
  { rejectValue: string }
>(
  "auth/githubLogin",
  async (_, { rejectWithValue }) => {
    try {
      // Step 1️⃣: Get GitHub auth URL from backend
      const { data } = await axios.get("http://localhost:7000/api/auth/github");

      // Step 2️⃣: Open popup
      const popup = window.open(data.url, "githubLogin", "width=600,height=700");
      if (!popup) {
        return rejectWithValue("Popup blocked. Please allow popups.");
      }

      // Step 3️⃣: Wait for message from backend callback
      const githubResponse: GithubLoginResponse = await new Promise((resolve, reject) => {
        const listener = (event: MessageEvent) => {
          // only accept messages from backend origin
          if (event.origin !== "http://localhost:7000") return;
          const { success, message, sessionToken, user } = event.data;

          if (success && sessionToken) {
            localStorage.setItem("sessionToken", sessionToken);
            window.removeEventListener("message", listener);
            resolve({ success, message, sessionToken, user });
          } else {
            window.removeEventListener("message", listener);
            reject(rejectWithValue(message || "GitHub login failed"));
          }
        };

        window.addEventListener("message", listener);
      });

      return githubResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || "GitHub login failed");
    }
  }
);
