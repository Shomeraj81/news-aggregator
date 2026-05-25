"use client";

import { useEffect, useState } from "react";

import api from "@/services/api";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import FeedSection from "@/components/FeedSection";
import toast from "react-hot-toast";

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] =
    useState([]);

  useEffect(() => {
    const fetchBookmarks =
      async () => {
        try {
          const response =
            await api.get(
              "/users/bookmarks"
            );

          setBookmarks(
            response.data
          );
        } catch (error) {
          toast.error("Failed to fetch bookmarks");
        }
      };

    fetchBookmarks();
  }, []);

  return (
    <ProtectedRoute>
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <FeedSection
          title="Saved Articles"
          articles={bookmarks}
        />
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default BookmarksPage;