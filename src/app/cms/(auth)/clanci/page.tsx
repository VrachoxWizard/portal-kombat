"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  createdAt: string;
  author: { name: string };
  category: { name: string } | null;
}

export default function CmsArticlesPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cms/posts");
      if (!res.ok) throw new Error("Neuspjelo dohvaćanje članaka");
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Pogreška pri učitavanju");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Jeste li sigurni da želite obrisati članak: "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/cms/posts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Brisanje nije uspjelo");
      }

      setSuccess("Članak uspješno obrisan!");
      setPosts(posts.filter((p) => p.id !== id));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Greška pri brisanju");
      setTimeout(() => setError(""), 4000);
    }
  };

  // Filter posts client-side for rapid response
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.slug.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || post.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold italic uppercase tracking-tight text-white font-display">
            Upravljanje Člancima
          </h1>
          <p className="text-sm text-slate-400 font-medium">Pregled, pretraga i uređivanje svih objava na portalu.</p>
        </div>
        <Link
          href="/cms/clanci/novi"
          className="inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-red-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white border border-red-500/20 transition-premium shadow-[var(--shadow-glow-sm)] cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} />
          Novi Članak
        </Link>
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

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-5 bg-surface-elevated rounded-xl border border-white/5">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute inset-y-0 left-3 my-auto text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Pretraži naslov ili slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 transition-premium outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg px-3 py-2 text-xs text-slate-300 transition-premium outline-none"
            >
              <option value="ALL">Sve Vrste</option>
              <option value="NEWS">Vijesti</option>
              <option value="BLOG">Kolumne</option>
              <option value="PREDICTION">Predikcije</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1 sm:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg px-3 py-2 text-xs text-slate-300 transition-premium outline-none"
            >
              <option value="ALL">Svi Statusi</option>
              <option value="PUBLISHED">Objavljeno</option>
              <option value="DRAFT">Skica (Draft)</option>
              <option value="REVIEW">Na reviziji</option>
              <option value="ARCHIVED">Arhivirano</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table block */}
      <div className="surface-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="animate-spin text-primary" size={24} />
            <p className="text-xs font-semibold uppercase tracking-wider">Učitavanje članaka...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="mx-auto text-slate-700 mb-3" size={32} />
            <p className="text-sm font-semibold">Nema pronađenih članaka koji odgovaraju kriterijima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider bg-black/20">
                  <th className="p-4 pl-6">Članak</th>
                  <th className="p-4">Vrsta</th>
                  <th className="p-4">Kategorija</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-4 pl-6 max-w-sm">
                      <div className="truncate">
                        <Link
                          href={`/cms/clanci/${post.id}/uredi`}
                          className="font-bold text-white hover:text-primary transition-premium truncate block"
                        >
                          {post.title}
                        </Link>
                        <span className="text-[10px] text-slate-500 font-medium font-mono mt-0.5 block truncate">
                          /{post.slug}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-800/40 border border-slate-700/20 px-2 py-0.5 rounded">
                        {post.type === "PREDICTION"
                          ? "Predikcija"
                          : post.type === "BLOG"
                          ? "Kolumna"
                          : "Vijest"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-400 font-medium">
                        {post.category?.name || "Nema"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded ${
                          post.status === "PUBLISHED"
                            ? "bg-emerald-950/20 text-emerald-400 border border-emerald-500/10"
                            : post.status === "DRAFT"
                            ? "bg-amber-950/20 text-amber-400 border border-amber-500/10"
                            : "bg-slate-900 text-slate-400 border border-slate-700/20"
                        }`}
                      >
                        {post.status === "PUBLISHED" ? "Objavljeno" : "Skica"}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 space-x-2 shrink-0">
                      <Link
                        href={`/cms/clanci/${post.id}/uredi`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-primary/40 hover:bg-primary/10 transition-premium cursor-pointer"
                        title="Uredi"
                      >
                        <Edit2 size={13} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 transition-premium cursor-pointer"
                        title="Obriši"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
