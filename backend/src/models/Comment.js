import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // which article this comment belongs to
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },

    // who wrote it
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // the actual comment text
    body: {
      type: String,
      required: true,
      trim: true,        // removes leading/trailing spaces
      maxLength: 1000,   // max 1000 characters
    },

    // how many people liked it
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,   // adds createdAt and updatedAt automatically
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;