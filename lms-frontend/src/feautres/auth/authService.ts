// authApi.ts

import {
  sendOtpService,
  verifyOtpService,
  getSessionService,
  logoutService,
  githubLoginService,
} from "@/services/authServices";
import type {User, Session} from "@/types/authTypes";

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  user: User;
  session: Session;
  token: string;
}

// SEND OTP
export async function sendOtp(email: string) {
  try {
    return await sendOtpService(email);
  } catch (err:any) {
    throw new Error(err?.response?.data || err.message);
  }
}

// VERIFY OTP
export async function verifyOtp({ email, otp }: VerifyOtpPayload) {
  try {
    return await verifyOtpService(email, otp);
  } catch (err: any) {
    throw new Error(err.response?.data || err.message);
  }
}

// FETCH SESSION
export async function fetchSession(token: string) {
  try {
    const res = await getSessionService(token);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data || err.message);
  }
}

// LOGOUT
export async function logout(token: string) {
  try {
    return await logoutService(token);
  } catch (err: any) {
    throw new Error(err.response?.data || err.message);
  }
}

// GITHUB LOGIN
export async function githubLogin() {
  const res = await githubLoginService();

  if (res.status === "error") {
    throw new Error(res.message);
  }

  return res;
}
