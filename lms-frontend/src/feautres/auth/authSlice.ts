import { createSlice, } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import {
  sendOtp,
  verifyOtp,
  
  verifySession,
  logout,
  githubLogin,
} from "./authThunks";

const initialState: AuthState = {
  user: null,
  sessionToken: localStorage.getItem("sessionToken"),
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

    
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.sessionToken = action.payload.sessionToken;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
    
    builder
      .addCase(verifySession.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifySession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
      })
      .addCase(verifySession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });

  
    builder
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.sessionToken = null;
        state.status = "succeeded";
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
    
  
    builder
      .addCase(githubLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(githubLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.sessionToken = action.payload.sessionToken;
        localStorage.setItem("sessionToken", action.payload.sessionToken);
      })
      .addCase(githubLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "GitHub login failed";
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
