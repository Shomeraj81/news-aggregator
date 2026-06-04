import Comment from "../models/Comment.js";

// GET all comments for an article
export const getComments = async (req, res) => {
  try {
    const { articleId } = req.params;

    const comments = await Comment.find({ article: articleId })
      .populate("author", "username avatar")
      // populate replaces author ID with { username, avatar }
      .sort({ createdAt: -1 });
      // newest first

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new comment
export const addComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { body } = req.body;

    if (!body || body.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const comment = await Comment.create({
      article: articleId,
      author: req.user._id,  // req.user set by auth middleware
      body,
    });

    // populate author before sending back
    await comment.populate("author", "username avatar");

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // only the author can delete their own comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};