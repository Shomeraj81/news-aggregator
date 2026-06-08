"use client";

import { useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

import api from "@/services/api";
import Navbar from "@/components/Navbar";

export default function ResetPasswordPage() {
  const { token } =
    useParams();

  const router =
    useRouter();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      password !==
      confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );

      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          `/auth/reset-password/${token}`,
          {
            password,
          }
        );

      toast.success(
        response.data.message
      );

      setTimeout(() => {
        router.push(
          "/login"
        );
      }, 2000);
    } catch (error: any) {
      toast.error(
        error.response?.data
          ?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-2">
            Reset Password
          </h1>

          <p className="text-zinc-500 mb-8">
            Enter your new password
            below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                New Password
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-zinc-950
                  border border-zinc-700
                  rounded-xl
                  px-4 py-3
                  focus:outline-none
                  focus:border-blue-500
                "
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={
                  confirmPassword
                }
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-zinc-950
                  border border-zinc-700
                  rounded-xl
                  px-4 py-3
                  focus:outline-none
                  focus:border-blue-500
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-blue-600
                hover:bg-blue-500
                disabled:opacity-50
                py-3
                rounded-xl
                font-medium
                transition-colors
              "
            >
              {loading
                ? "Updating..."
                : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}