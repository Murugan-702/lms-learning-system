import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  sendOtp,
  verifyOtp,
  fetchSession,
  logout,
  githubLogin,
} from "./authThunks";

import type { User, Session } from "@/types/authTypes";


interface AuthState {
  user: User | null;
  session: Session | null;
  status: "success" | "error";
  token: string | null;
  loading: boolean;
  error: string | null;
  
}

const initialState: AuthState = {
  user: null,
  session: null,
  status: "error",
  token: null,
  loading: false,
  error: null,
  
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
  },

  extraReducers: (builder) => {
    // SEND OTP
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        state.status = "success";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = "error";
      });

    // VERIFY OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        const data = action.payload.data;
        state.loading = false;
        state.user = data?.user ?? null;
        state.session = data?.session ?? null;
        state.token = data?.token ?? null;
        state.status = "success";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = "error";
      });

    // FETCH SESSION
    builder
      .addCase(fetchSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user ?? null;
        state.session = action.payload?.session ?? null;
        state.status = "success";
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status = "error";
      });

    // LOGOUT
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.session = null;
      state.token = null;
      state.status = "success";
    });

    // GITHUB URL
    builder.addCase(githubLogin.fulfilled, (state, action) => {
       state.user = action.payload.user;
    state.token = action.payload?.sessionToken as string;
    state.status = "success";
    });
  },
});

export const { clearError, setToken } = authSlice.actions;
export default authSlice.reducer;
