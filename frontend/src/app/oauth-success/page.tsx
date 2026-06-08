"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const OAuthHandler = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setIsLoggedIn } = useAuth();

  useEffect(() => {
    const handleOAuth = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setUser(null);
        setIsLoggedIn(false);

        router.replace("/login");
        return;
      }

      localStorage.setItem("accessToken", token);

      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
        setIsLoggedIn(true);
        router.replace("/home");
      } catch {
        localStorage.removeItem(
          "accessToken"
        );

        setUser(null);
        setIsLoggedIn(false);

        router.replace("/login");
      }
    };

    handleOAuth();
  }, [router, searchParams, setUser, setIsLoggedIn]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="w-10 h-10 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin mb-4" />

      <p className="text-zinc-400">
        Signing you in...
      </p>
    </div>
  );
};

export default function OAuthSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-zinc-700 border-t-blue-500 rounded-full animate-spin mb-4" />

        <p className="text-zinc-400">
          Signing you in...
        </p>
      </div>
    }>
      <OAuthHandler />
    </Suspense>
  );
}