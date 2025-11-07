import type { Request } from "express";

//api-response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export type ApiRequest<T> = Request<{}, {}, T>;


// send-otp request
export interface SendOtpRequest {
  email: string;
}
// verify-otp request
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}




// verify-otp response

export interface VerifyOtpResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  sessionToken: string;
  expiresAt: Date;
}

