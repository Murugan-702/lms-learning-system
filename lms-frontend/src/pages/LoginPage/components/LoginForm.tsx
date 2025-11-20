import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GithubIcon, Loader, Loader2, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";

import {githubLogin, sendOtp } from "../../../feautres/auth/authThunks";
import { useAppDispatch, useAppSelector } from "@/hooks/dispatchHook";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [emailPending, startEmailTransition] = useTransition();
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  
    const [gitHubPending, startGithubTransition] = useTransition();
 const handleGithubLogin = () => {
    startGithubTransition(async () => {
      try {
        const res = await dispatch(githubLogin()).unwrap();
        console.log(res);
        
        toast.success(res.message || "GitHub login successful!");
        navigate("/"); // success redirect

      } catch (err: any) {
        toast.error(err || "GitHub login failed!");
      }
    });
  };
 


 const signWithEmail = () => {
  if (!email) {
    toast.error("Please enter the email.");
    return;
  }

  startEmailTransition(async () => {
    try {
      const res = await dispatch(sendOtp(email)).unwrap();
    

    
      if (res.status === 'success') {
        toast.success(res.message);
        navigate(`/verify-request/${encodeURIComponent(email)}`);
      } else {
        toast.error(res.message || "Failed to send OTP.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
    }
  });
};


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome back!</CardTitle>
        <CardDescription>Login with your Github Email</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={handleGithubLogin}
          disabled={gitHubPending }
        >
          {gitHubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <GithubIcon className="size-4" />
              Sign with Github
            </>
          )}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
          </div>
          <Button onClick={signWithEmail} disabled={emailPending}>
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Continue with Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default LoginForm;
