import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendOtpService,
  verifyOtpService,
  getSessionService,
  logoutService,
  githubLoginService,
  type GithubLoginResponse,
} from "@/services/authServices";
import type { ApiResponse, User, Session } from "@/types/authTypes";

interface VerifyOtpPayload {
  email: string;
  otp: string;
}

interface VerifyOtpResponse {
  user: User;
  session: Session;
  token: string;
}

// SEND OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await sendOtpService(email);

      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// VERIFY OTP
export const verifyOtp = createAsyncThunk<
  ApiResponse<VerifyOtpResponse>,
  VerifyOtpPayload
>(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await verifyOtpService(email, otp);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// FETCH SESSION
export const fetchSession = createAsyncThunk(
  "auth/fetchSession",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await getSessionService(token);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// LOGOUT
export const logout = createAsyncThunk(
  "auth/logout",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await logoutService(token);
  
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// GITHUB LOGIN URL
export const githubLogin = createAsyncThunk<
  GithubLoginResponse,
  void,
  { rejectValue: string }
>("auth/githubLogin", async (_, { rejectWithValue }) => {
  const res = await githubLoginService();

  if (res.status === 'error') {
    return rejectWithValue(res.message);
  }

  return res;
});
