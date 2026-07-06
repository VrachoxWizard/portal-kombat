"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

interface Comment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

interface CommentsWidgetProps {
  postId: string;
}

export const CommentsWidget: React.FC<CommentsWidgetProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");

  const fetchComments = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (!res.ok) throw new Error("Neuspjelo učitavanje komentara");
      const data = await res.json();
      setComments(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Greška pri učitavanju komentara";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchComments();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorName, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Spremanje komentara nije uspjelo");
      }

      setSuccess("Komentar uspješno dodan!");
      setComments([data, ...comments]);
      setContent(""); // keep authorName for convenience

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Nešto je pošlo po zlu";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("hr-HR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="surface-card p-6 sm:p-8 space-y-8 border border-white/5 shadow-xl rounded-[var(--radius-card)]">
      <div className="flex items-center gap-2 border-l-4 border-primary pl-3">
        <MessageSquare className="text-primary" size={20} aria-hidden="true" />
        <h3 className="font-display font-black text-base uppercase text-white tracking-wide">
          Komentari ({comments.length})
        </h3>
      </div>

      {/* Messages */}
      {success && (
        <div className="rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-4 text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-950/20 border border-red-500/20 p-4 text-xs font-semibold text-red-400 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="comment-author" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Vaše ime / Nadimak
            </label>
            <input
              id="comment-author"
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-black/40 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-200 transition-premium outline-none font-medium"
              placeholder="npr. BorilačkiFan"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="comment-content" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Komentar
          </label>
          <textarea
            id="comment-content"
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-black/40 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-200 transition-premium outline-none font-medium resize-y"
            placeholder="Napišite svoje mišljenje ili analizu borbe..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-red-600 px-5 py-3 text-xs font-extrabold uppercase tracking-widest text-white border border-red-500/20 shadow-[var(--shadow-glow-sm)] transition-premium cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Slanje...
            </>
          ) : (
            <>
              <Send size={14} />
              Pošalji komentar
            </>
          )}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-6 pt-4 border-t border-white/5">
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500">
            <Loader2 className="animate-spin text-primary" size={20} />
            <p className="text-[10px] font-bold uppercase tracking-wider">Učitavanje komentara...</p>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-500 italic text-center py-4">
            Nema komentara. Budite prvi koji će komentirati!
          </p>
        ) : (
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="flex gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-premium"
                >
                  {/* Avatar Placeholder */}
                  <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary font-black shrink-0 shadow-sm">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                      <span className="font-extrabold text-sm text-white uppercase font-display truncate">
                        {comment.authorName}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider shrink-0">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsWidget;
