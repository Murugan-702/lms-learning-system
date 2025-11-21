import { useEffect, useState, useTransition } from "react";
import { fetchSession } from "../feautres/auth/authService"; // the plain function version

export const useSession = () => {
  const [user, setUser] = useState<unknown>(null);
  const [session, setSession] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const token = typeof window !== "undefined"
    ? localStorage.getItem("sessionToken")
    : null;

  useEffect(() => {
    if (!token) return;

    startTransition(async () => {
      try {
        const res = await fetchSession(token);
        setSession(res);
        setUser(res?.user || null);
      } catch (error:any) {
        setError(error?.message);
      }
    });
  }, [token]);

  return { user, session, error, token, isPending };
};
