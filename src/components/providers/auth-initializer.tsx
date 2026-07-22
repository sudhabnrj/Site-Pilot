"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store";
import { setCredentials, setInitialized } from "@/store/slices/auth-slice";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function initSession() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            dispatch(setCredentials({ user: data.user }));
            return;
          }
        }
      } catch (err) {
        console.error("Auth session initialization error:", err);
      } finally {
        dispatch(setInitialized(true));
      }
    }

    initSession();
  }, [dispatch]);

  return <>{children}</>;
}
