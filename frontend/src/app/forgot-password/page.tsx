"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import api from "@/services/api";
import Navbar from "@/components/Navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response =
        await api.post(
          "/auth/forgot-password",
          {
            email,
          }
        );

      toast.success(
        response.data.message
      );

      setEmail("");
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
            Forgot Password
          </h1>

          <p className="text-zinc-500 mb-8">
            Enter your email and we'll
            send you a password reset
            link.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="you@example.com"
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
                ? "Sending..."
                : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white text-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}