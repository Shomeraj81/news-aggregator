"use client";

import { useEffect, useState } from "react";

import api from "@/services/api";

interface Props {
  articleId: string;
}

const BookmarkButton = ({
  articleId,
}: Props) => {
  const [bookmarked, setBookmarked] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    if (token) {
      setIsLoggedIn(true);

      checkBookmarkStatus();
    }
  }, []);

  const checkBookmarkStatus =
    async () => {
      try {
        const response =
          await api.get(
            `/users/bookmarks/check/${articleId}`
          );

        setBookmarked(
          response.data.bookmarked
        );
      } catch (error) {
        console.error(error);
      }
    };

  const handleBookmark =
    async () => {
      try {
        setLoading(true);

        if (!bookmarked) {
          await api.post(
            "/users/bookmarks",
            {
              articleId,
            }
          );

          setBookmarked(true);
        } else {
          await api.delete(
            `/users/bookmarks/${articleId}`
          );

          setBookmarked(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <button
      onClick={handleBookmark}
      disabled={loading}
      className={`px-5 py-3 rounded-lg font-semibold transition-all ${
        bookmarked
          ? "bg-green-600 text-white"
          : "bg-black text-white"
      }`}
    >
      {loading
        ? "Loading..."
        : bookmarked
        ? "Bookmarked"
        : "Bookmark"}
    </button>
  );
};

export default BookmarkButton;