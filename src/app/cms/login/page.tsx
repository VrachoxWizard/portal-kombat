"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Swords, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function CmsLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Prijava nije uspjela");
      }

      // Successful login
      router.push("/cms");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Nešto je pošlo po zlu");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-canvas px-4 py-12 relative overflow-hidden font-sans">
      {/* Decorative Arena Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[20%] left-[20%] w-[35vw] h-[35vw] rounded-full arena-glow-red blur-[120px] opacity-80" />
        <div className="absolute bottom-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full arena-glow-indigo blur-[110px] opacity-50" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 shadow-[var(--shadow-glow-sm)]">
              <Swords size={24} className="text-primary" />
            </div>
          </div>
          <span className="text-3xl font-extrabold italic tracking-tighter font-display">
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-red-600 bg-clip-text text-transparent text-glow-red">
              COMBAT
            </span>
            <span className="text-white">PORTAL</span>
          </span>
          <p className="mt-2 text-sm text-slate-400 font-medium">Urednički CMS sustav za upravljanje portalom</p>
        </div>

        <div className="glass rounded-2xl border border-white/5 p-8 shadow-[var(--shadow-card)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-red-950/20 border border-red-500/20 p-4 text-xs font-semibold text-red-400 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Urednički E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg pl-10 pr-3 py-3 text-sm text-slate-200 placeholder-slate-600 transition-premium outline-none"
                  placeholder="unesite email adresu"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Lozinka
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg pl-10 pr-3 py-3 text-sm text-slate-200 placeholder-slate-600 transition-premium outline-none"
                  placeholder="unesite lozinku"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-red-600 py-3 text-xs font-extrabold uppercase tracking-widest text-white border border-red-500/20 shadow-[var(--shadow-glow-sm)] transition-premium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Prijavljivanje...
                  </>
                ) : (
                  "Prijavi se"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
