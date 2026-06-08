"use client";

import { useEffect } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function OAuthSuccess() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const {
    setUser,
    setIsLoggedIn,
  } = useAuth();

  useEffect(() => {
    const handleOAuth =
      async () => {
        const token =
          searchParams.get("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        localStorage.setItem(
          "accessToken",
          token
        );

        try {
          const response =
            await api.get(
              "/auth/me"
            );

          setUser(
            response.data
          );

          setIsLoggedIn(true);

          router.replace(
            "/home"
          );
        } catch {
          router.replace(
            "/login"
          );
        }
      };

    handleOAuth();
  }, [
    router,
    searchParams,
    setUser,
    setIsLoggedIn,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Signing you in...
    </div>
  );
}