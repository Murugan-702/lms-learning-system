import { useEffect, useTransition } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/dispatchHook";
import { fetchSession } from "@/feautres/auth/authThunks";

export const useSession = () => {
  const dispatch = useAppDispatch();
  const { user, session, error } = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("sessionToken");

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!token) return;

    startTransition(() => {
      dispatch(fetchSession(token));
    });
  }, [token, dispatch]);

  return { user, session, error, token, isPending };
};
