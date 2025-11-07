import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import courseReducer from "./courses/courseSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course :courseReducer
  },
});

// ✅ Export these types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
