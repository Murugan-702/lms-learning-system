import axios from "axios";
import type { ApiResponse, User, Session } from "../types/authTypes";
import api from "@/utils/api";



// ---------- SEND OTP ----------
export const sendOtpService = async (email: string) => {
  const res = await api.post<ApiResponse>(`/auth/send-otp`, { email });
  return res.data;
};

// ---------- VERIFY OTP ----------
export const verifyOtpService = async (email: string, otp: string) => {
  console.log(email, otp);
  const res = await api.post<ApiResponse<{ user: User; session: Session }>>(
    `/auth/verify-otp`,
    { email, otp }
  );
  localStorage.setItem("sessionToken", res.data?.data?.session?.token as string);
  console.log(res,"arrivbed at service")
  return res.data;
};

// ---------- GET SESSION ----------
export const getSessionService = async (token: string) => {
  const res = await api.get<ApiResponse<{ user: User; session: Session }>>(
    `/auth/session`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// ---------- LOGOUT ----------
export const logoutService = async (token: string) => {
    const res = await api.post<ApiResponse>(`/auth/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};



export interface GithubLoginResponse {
  status : "success" | "error";
  message: string;
  sessionToken?: string;
  user?: any;
}
export const githubLoginService = async (): Promise<GithubLoginResponse> => {
  try {
    // 1. Request GitHub URL
    const { data } = await axios.get("http://localhost:7000/api/auth/github");

    // 2. Open popup
    const popup = window.open(
      data.url,
      "githubLogin",
      "width=600,height=700"
    );

    if (!popup) {
      return {
        status: "error",
        message: "Popup blocked. Please enable popups.",
      };
    }

    // 3. Listen to backend callback
    return await new Promise((resolve) => {
      const listener = (event: MessageEvent) => {
        // Must accept any origin (your backend sends "*")
        // If needed, filter by: if (!event.origin.includes("localhost:7000")) return;

        const payload = event.data;

        // Because backend sends:
        // { status, message, data: { user, sessionToken } }
        const success =
          payload.status === "success" || payload.status === true;

        const sessionToken = payload.data?.sessionToken;
        const user = payload.data?.user;

        window.removeEventListener("message", listener);

        if (success && sessionToken) {
          localStorage.setItem("sessionToken", sessionToken);

          resolve({
            status: "success",
            message: payload.message,
            sessionToken,
            user,
          });
        } else {
          resolve({
            status: "error",
            message: payload.message || "GitHub login failed",
          });
        }
      };

      window.addEventListener("message", listener);
    });
  } catch{
    return {
      status: "error",
      message: "GitHub login failed (exception)",
    };
  }
};


