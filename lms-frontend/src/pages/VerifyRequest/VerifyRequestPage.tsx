import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyOtp } from "@/feautres/auth/authThunks";
import { useAppDispatch } from "@/hooks/dispatchHook";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const VerifyRequestPage = () => {
  const [otp, setOtp] = useState("");
 const email = decodeURIComponent(useParams().email as string);
 
  const [emailPending, startEmailTransition] = useTransition();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isOtpCompleted = otp.length === 6;
  const handleVerifyOtp = () => {
    if (!email ) {
      toast.error("Email is not defined");
    }
    startEmailTransition(async () => {
      try {
        const res = await dispatch(verifyOtp({email:email,otp:otp})).unwrap();
        console.log(res,"qrrived at page");
        if (res.status === "success") {
          toast.success(res.message);
          navigate("/")
        } else {
          toast.error(res.message);
        }
      } catch {
        toast.error("Something went wrong!");
      }
    });
  };
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          We have sent a verification email code to your email address. Please
          open the email and paste the code below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <InputOTP
            value={otp}
            maxLength={6}
            className="gap-2"
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email.
          </p>
        </div>
        <Button
          onClick={handleVerifyOtp}
          disabled={emailPending || !isOtpCompleted}
          className="w-full"
        >
          {emailPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />{" "}
              <span>Loading...</span>
            </>
          ) : (
            <> Verify Account</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
export default VerifyRequestPage;
