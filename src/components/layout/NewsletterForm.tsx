"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulacija slanja na server
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1500);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-emerald-400"
          >
            <CheckCircle2 className="flex-shrink-0 text-emerald-400 animate-bounce" size={20} />
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-white">Uspješna prijava!</p>
              <p className="text-emerald-300/80">Hvala vam na pretplati. Vijesti stižu uskoro!</p>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row max-w-sm gap-2"
          >
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Vaša email adresa..."
                disabled={status === "loading"}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 transition-all duration-200"
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading" || !email}
              className="rounded-lg bg-primary hover:bg-red-600 disabled:bg-primary/50 text-white font-bold text-sm px-5 py-2.5 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Slanje
                </>
              ) : (
                <>
                  <Send size={14} />
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
