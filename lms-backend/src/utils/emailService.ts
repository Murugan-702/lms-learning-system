import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);
console.log(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Your OTP Code",
        html : `<p>Your OTP is <strong>${otp}</strong></p>`
    });

    console.log("✅ OTP sent successfully to:", to);
  } catch (error) {
    console.error("❌ Failed to send OTP:", error);
    throw new Error("Unable to send OTP email");
  }
};
