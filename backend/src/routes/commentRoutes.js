import express from "express";
import {
  getComments,
  addComment,
  deleteComment,
} from "../controllers/commentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/comments/:articleId  → get all comments for an article
router.get("/:articleId", getComments);

// POST /api/comments/:articleId → add a comment (must be logged in)
router.post("/:articleId", protect, addComment);

// DELETE /api/comments/:commentId → delete a comment (must be logged in)
router.delete("/:commentId", protect, deleteComment);

export default router;