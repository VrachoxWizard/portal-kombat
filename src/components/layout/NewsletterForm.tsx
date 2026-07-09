"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/lib/hooks";

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const prefersReducedMotion = useSafeReducedMotion();
  const inputId = "newsletter-email";
  const errorId = "newsletter-error";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setStatus("error");
      setErrorMessage("Unesite ispravnu email adresu.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Došlo je do pogreške. Pokušajte ponovno.");
      }

      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Povezivanje nije uspjelo.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="w-full" aria-live="polite">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-emerald-950/20 border-2 border-emerald-500/35 rounded-none p-4 text-emerald-400 shadow-[var(--shadow-card)]"
            role="status"
          >
            <CheckCircle2 className="flex-shrink-0 text-emerald-400" size={20} aria-hidden="true" />
            <div className="text-xs sm:text-sm">
              <p className="font-black text-white uppercase tracking-wider text-xs">Uspješna prijava!</p>
              <p className="text-emerald-300/80 font-bold mt-0.5">Hvala vam na pretplati. Vijesti stižu uskoro!</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row max-w-sm gap-2"
            noValidate
          >
            <div className="relative flex-1">
              <label htmlFor={inputId} className="sr-only">
                Email adresa za newsletter
              </label>
              <input
                id={inputId}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Vaša email adresa..."
                disabled={status === "loading"}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? errorId : undefined}
                className="w-full rounded-none bg-black/60 border-2 border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary disabled:opacity-50 transition-premium font-bold"
                required
              />
              {status === "error" && (
                <p id={errorId} className="mt-1.5 text-[11px] text-red-400 font-bold" role="alert">
                  {errorMessage}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="rounded-none bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-white font-black text-xs uppercase tracking-widest px-5 py-2.5 flex items-center justify-center gap-2 cursor-pointer border-2 border-primary transition-premium shadow-[var(--shadow-brutalist)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#ffffff]"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Slanje
                </>
              ) : (
                <>
                  <Send size={14} aria-hidden="true" />
                  Prijava
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsletterForm;
