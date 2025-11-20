import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY!);


export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Your OTP Code",
        html : `<div style="font-family: sans-serif; padding: 20px;">
          <h2>Account Verification</h2>
          <p>Please use the following code to complete your verification:</p>
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="font-size: 24px; font-weight: bold; text-align: center;">${otp}</p>
          </div>
          <p>This code is valid for 10 minutes.</p>
        </div>`
    });

  
  } catch (error) {
    
    throw new Error("Unable to send OTP email due to service error");
  }
};
