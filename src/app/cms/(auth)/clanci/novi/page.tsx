"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function CmsNewArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "NEWS";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Article Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [type, setType] = useState(initialType);
  const [status, setStatus] = useState("DRAFT");
  const [categoryId, setCategoryId] = useState("");
  const [tagsInput, setTagsInput] = useState(""); // Comma-separated

  // Prediction Fields
  const [fighterA, setFighterA] = useState("");
  const [fighterB, setFighterB] = useState("");
  const [winner, setWinner] = useState("");
  const [method, setMethod] = useState("");
  const [predictedRound, setPredictedRound] = useState("");
  const [confidenceScore, setConfidenceScore] = useState(70);
  const [keyReasoning, setKeyReasoning] = useState("");

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await fetch("/api/cms/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoadingCats(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  // Helper to slugify Croatian text
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[đ|Đ]/g, "d")
      .replace(/[š|Š]/g, "s")
      .replace(/[ć|Ć|č|Č]/g, "c")
      .replace(/[ž|Ž]/g, "z")
      .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/-+/g, "-") // Replace multiple - with single -
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Split tags by comma
    const tagNames = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const postPayload: Record<string, unknown> = {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      type,
      status,
      categoryId,
      tagNames,
    };

    if (type === "PREDICTION") {
      postPayload.prediction = {
        fighterA,
        fighterB,
        winner,
        method,
        predictedRound,
        confidenceScore,
        keyReasoning,
      };
    }

    try {
      const res = await fetch("/api/cms/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Spremanje nije uspjelo");
      }

      router.push("/cms/clanci");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Nešto je pošlo po zlu";
      setError(message);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Header section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/cms/clanci")}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-premium cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold italic uppercase tracking-tight text-white font-display">
            Novi Članak
          </h1>
          <p className="text-sm text-slate-400 font-medium">Napišite i objavite novi sadržaj na portalu.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-950/20 border border-red-500/20 p-4 text-xs font-semibold text-red-400 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="surface-card p-6 space-y-4">
            <h2 className="font-display font-bold text-white text-base uppercase border-l-4 border-primary pl-3 mb-2">
              Sadržaj Članka
            </h2>

            <div className="space-y-1">
              <label htmlFor="title" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Naslov Članka
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={handleTitleChange}
                className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 transition-premium outline-none"
                placeholder="npr. Stipe Miočić najavljuje meč karijere"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="slug" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                URL Putanja (Slug)
              </label>
              <input
                type="text"
                id="slug"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 transition-premium outline-none font-mono text-xs"
                placeholder="stipe-miocic-najavljuje-mec"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="excerpt" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Kratak sažetak (Excerpt)
              </label>
              <textarea
                id="excerpt"
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 transition-premium outline-none resize-none"
                placeholder="Ukratko opišite o čemu se radi u članku..."
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="content" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Glavni Tekst (Podržava Markdown format)
                </label>
                <span className="text-[9px] text-slate-500 font-bold uppercase">
                  Podržano: ## Naslov, **podebljano**, *kurziv*, - lista, &gt; citat
                </span>
              </div>
              <textarea
                id="content"
                required
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 transition-premium outline-none font-mono text-xs"
                placeholder="## Prvo poglavlje&#10;Napišite tekst ovdje. Možete koristiti **bold** za naglašavanje."
              />
            </div>
          </div>

          {/* Prediction sub-form (visible only if type === PREDICTION) */}
          {type === "PREDICTION" && (
            <div className="surface-card p-6 space-y-4 border border-emerald-500/10">
              <h2 className="font-display font-bold text-emerald-400 text-base uppercase border-l-4 border-emerald-500 pl-3 mb-2 flex items-center gap-2">
                <TrendingUp size={18} />
                Prognoza i Analiza Sraza
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="fighterA" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Borac A
                  </label>
                  <input
                    type="text"
                    id="fighterA"
                    value={fighterA}
                    onChange={(e) => setFighterA(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm text-slate-200 transition-premium outline-none"
                    placeholder="npr. Jon Jones"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="fighterB" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Borac B
                  </label>
                  <input
                    type="text"
                    id="fighterB"
                    value={fighterB}
                    onChange={(e) => setFighterB(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm text-slate-200 transition-premium outline-none"
                    placeholder="npr. Stipe Miočić"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="winner" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Predviđeni pobjednik
                  </label>
                  <input
                    type="text"
                    id="winner"
                    value={winner}
                    onChange={(e) => setWinner(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm text-slate-200 transition-premium outline-none"
                    placeholder="npr. Jon Jones"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="method" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Metoda pobjede
                  </label>
                  <input
                    type="text"
                    id="method"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm text-slate-200 transition-premium outline-none"
                    placeholder="npr. TKO (Ground and Pound)"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="predictedRound" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Runda završetka
                  </label>
                  <input
                    type="text"
                    id="predictedRound"
                    value={predictedRound}
                    onChange={(e) => setPredictedRound(e.target.value)}
                    className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm text-slate-200 transition-premium outline-none"
                    placeholder="npr. 3. runda"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>Pouzdanost prognoze</span>
                  <span className="text-emerald-400 font-extrabold">{confidenceScore}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={confidenceScore}
                  onChange={(e) => setConfidenceScore(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="keyReasoning" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Ključno obrazloženje (Key Reasoning)
                </label>
                <textarea
                  id="keyReasoning"
                  rows={3}
                  value={keyReasoning}
                  onChange={(e) => setKeyReasoning(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-600 transition-premium outline-none resize-none italic"
                  placeholder="Kratko sumirajte zašto ste predvidjeli ovakav ishod..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar settings columns */}
        <div className="space-y-6">
          <div className="surface-card p-6 space-y-4">
            <h3 className="font-display font-bold text-white text-sm uppercase border-l-4 border-primary pl-3">
              Postavke Objave
            </h3>

            {/* Type Selection */}
            <div className="space-y-1">
              <label htmlFor="type" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Vrsta članka
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-300 transition-premium outline-none"
              >
                <option value="NEWS">Vijest dana</option>
                <option value="BLOG">Kolumna / Blog</option>
                <option value="PREDICTION">Analiza i Predikcija</option>
              </select>
            </div>

            {/* Category selection */}
            <div className="space-y-1">
              <label htmlFor="category" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Kategorija sporta
              </label>
              {loadingCats ? (
                <div className="text-xs text-slate-500 py-2">Učitavanje...</div>
              ) : (
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-300 transition-premium outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Image URL selection */}
            <div className="space-y-1">
              <label htmlFor="featuredImage" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                URL Istaknute slike
              </label>
              <input
                type="url"
                id="featuredImage"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 transition-premium outline-none"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            {/* Tag Names Input */}
            <div className="space-y-1">
              <label htmlFor="tags" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Oznake (odvojite zarezom)
              </label>
              <input
                type="text"
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-600 transition-premium outline-none"
                placeholder="npr. UFC, Stipe Miocic, Teška kategorija"
              />
            </div>

            {/* Status selection */}
            <div className="space-y-1">
              <label htmlFor="status" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Status objave
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-900 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-300 transition-premium outline-none"
              >
                <option value="DRAFT">Skica (Draft)</option>
                <option value="PUBLISHED">Objavi odmah (Published)</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-red-600 py-3 text-xs font-extrabold uppercase tracking-widest text-white border border-red-500/20 shadow-[var(--shadow-glow-sm)] transition-premium cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Spremanje...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Spremi članak
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
