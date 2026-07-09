"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Greška pri slanju poruke.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Mrežna greška. Pokušajte ponovo.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="min-h-[1.5rem]"
      >
        {status === "success" && (
          <p className="flex items-center gap-2 text-sm text-emerald-400 font-semibold">
            <CheckCircle size={16} aria-hidden="true" />
            Poruka je uspješno poslana. Javit ćemo vam se uskoro.
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center gap-2 text-sm text-red-400 font-semibold">
            <AlertCircle size={16} aria-hidden="true" />
            {errorMessage}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="contact-name"
          name="name"
          label="Ime i prezime"
          required
          placeholder="Vaše ime"
        />
        <Input
          id="contact-email"
          name="email"
          type="email"
          label="E-mail adresa"
          required
          placeholder="vas@email.hr"
        />
      </div>

      <Input
        id="contact-subject"
        name="subject"
        label="Predmet (opcionalno)"
        placeholder="O čemu se radi?"
      />

      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="text-xs font-bold uppercase tracking-wider text-slate-400"
        >
          Poruka
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Vaša poruka..."
          className="w-full rounded-none bg-black/60 border-2 border-white/10 px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-premium font-bold resize-y min-h-[120px]"
        />
      </div>

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Šaljem...
          </>
        ) : (
          <>
            <Send size={16} aria-hidden="true" />
            Pošalji Poruku
          </>
        )}
      </Button>
    </form>
  );
}
