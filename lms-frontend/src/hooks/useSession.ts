import { useEffect, useTransition } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/authHook";
import { verifySession } from "@/feautres/auth/authThunks";

export const useSession = () => {
  const dispatch = useAppDispatch();
  const { user, status, error, sessionToken } = useAppSelector(
    (state) => state.auth
  );

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!sessionToken) return;

    startTransition(() => {
      dispatch(verifySession());
    });
  }, [dispatch, sessionToken]);

  return { user, status, error, sessionToken, isPending };
};
