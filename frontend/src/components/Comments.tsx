"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Trash2 } from "lucide-react";

interface Comment {
  _id: string;
  body: string;
  author: { username: string; avatar: string };
  createdAt: string;
}

interface Props {
  articleId: string;
}

const Comments = ({ articleId }: Props) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // fetch comments when component loads
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/comments/${articleId}`);
        setComments(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [articleId]);

  // post a new comment
  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      setPosting(true);
      const response = await api.post(`/comments/${articleId}`, {
        body: newComment,
      });
      // add new comment to top of list without refetching
      setComments([response.data, ...comments]);
      setNewComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setPosting(false);
    }
  };

  // delete a comment
  const handleDelete = async (commentId: string) => {
    try {
      await api.delete(`/comments/${commentId}`);
      // remove from list without refetching
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-16 border-t border-zinc-800 pt-10">

      <h3 className="text-2xl font-bold text-white mb-8">
        Comments ({comments.length})
      </h3>

      {/* INPUT BOX — only show if logged in */}
      {user ? (
        <div className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl p-4 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              disabled={posting || !newComment.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl text-white font-medium text-sm"
            >
              {posting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-sm">
          <a href="/login" className="text-blue-400 hover:underline">Login</a> to leave a comment
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <p className="text-zinc-500 animate-pulse">Loading comments...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && comments.length === 0 && (
        <p className="text-zinc-500">No comments yet. Be the first!</p>
      )}

      {/* COMMENTS LIST */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">

              {/* AUTHOR */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {comment.author.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {comment.author.username}
                  </p>
                  <p className="text-zinc-500 text-xs">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* DELETE — only show if it's your comment */}
              {user && user.username === comment.author.username && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-zinc-300 text-sm leading-relaxed">
              {comment.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;