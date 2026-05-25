"use client";

import Link from "next/link";

import {
  Search,
  Bookmark,
  LogOut,
  Newspaper,
} from "lucide-react";

import { useRouter }
from "next/navigation";

import api from "@/services/api";

import { useAuth }
from "@/context/AuthContext";

const Navbar = () => {
  const router = useRouter();

  const {
    isLoggedIn,
    user,
    setIsLoggedIn,
    setUser,
  } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      localStorage.removeItem(
        "accessToken"
      );

      setUser(null);

      setIsLoggedIn(false);

      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/70 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/home"
          className="flex items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Newspaper className="w-5 h-5 text-blue-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              News Aggregator
            </h1>

            <p className="text-xs text-zinc-500">
              Personalized Intelligence
            </p>
          </div>
        </Link>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6">
          <Link
            href="/search"
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
          >
            <Search className="w-4 h-4" />

            Search
          </Link>

          {isLoggedIn && (
            <Link
              href="/bookmarks"
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
            >
              <Bookmark className="w-4 h-4" />

              Bookmarks
            </Link>
          )}

          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-zinc-300 hover:text-white transition-colors"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-xl text-white font-medium"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-white">
                  {user?.username}
                </span>

                <span className="text-xs text-zinc-500">
                  Welcome back
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 hover:border-zinc-500 transition-all text-zinc-300 hover:text-white"
              >
                <LogOut className="w-4 h-4" />

                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;