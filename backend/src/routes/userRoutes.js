import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  bookmarkArticle,
  removeBookmark,
  getBookmarks,
  checkBookmarkStatus,
  getRecommendations,
  getReadingHistory,
  getDashboard,
  updateInterests,
  subscribeDigest,
  unsubscribeDigest,
} from "../controllers/userController.js";

const router = express.Router();

// BOOKMARKS
router.post("/bookmarks", protect, bookmarkArticle);
router.delete("/bookmarks/:articleId", protect, removeBookmark);
router.get("/bookmarks", protect, getBookmarks);
router.get("/bookmarks/check/:articleId", protect, checkBookmarkStatus);

// RECOMMENDATIONS + HISTORY + DASHBOARD
router.get("/recommendations", protect, getRecommendations);
router.get("/history", protect, getReadingHistory);
router.get("/dashboard", protect, getDashboard);

// INTERESTS
router.patch("/interests", protect, updateInterests);

// DIGEST SUBSCRIPTION
router.patch("/digest/subscribe", protect, subscribeDigest);
router.patch("/digest/unsubscribe", protect, unsubscribeDigest);

export default router;