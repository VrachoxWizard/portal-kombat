"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface EventItem {
  id: string;
  fighterA: string;
  fighterB: string;
  event: string;
  date: string;
  createdAt: string;
}

export default function CmsEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form Fields
  const [fighterA, setFighterA] = useState("");
  const [fighterB, setFighterB] = useState("");
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cms/events");
      if (!res.ok) throw new Error("Neuspjelo dohvaćanje borbi");
      const data = await res.json();
      setEvents(data);
    } catch (err: any) {
      setError(err.message || "Greška pri učitavanju");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/cms/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fighterA,
          fighterB,
          event: eventName,
          date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Spremanje nije uspjelo");
      }

      setSuccess("Borba uspješno dodana!");
      setEvents([data, ...events]);
      // Reset form
      setFighterA("");
      setFighterB("");
      setEventName("");
      setDate("");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Nešto je pošlo po zlu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, match: string) => {
    if (!confirm(`Jeste li sigurni da želite obrisati borbu: "${match}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/cms/events/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Brisanje nije uspjelo");
      }

      setSuccess("Borba uspješno obrisana!");
      setEvents(events.filter((e) => e.id !== id));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Greška pri brisanju");
      setTimeout(() => setError(""), 4000);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold italic uppercase tracking-tight text-white font-display">
          Nadolazeće Borbe (Sidebar)
        </h1>
        <p className="text-sm text-slate-400 font-medium">Upravljajte borilačkim parovima koji se prikazuju u bočnoj traci.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="surface-card p-6 space-y-4">
            <h2 className="font-display font-bold text-white text-base uppercase border-l-4 border-primary pl-3 mb-2">
              Dodaj Borbu
            </h2>

            <div className="space-y-1">
              <label htmlFor="fighterA" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Borac A
              </label>
              <input
                type="text"
                id="fighterA"
                required
                value={fighterA}
                onChange={(e) => setFighterA(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-200 transition-premium outline-none"
                placeholder="npr. Anthony Joshua"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="fighterB" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Borac B
              </label>
              <input
                type="text"
                id="fighterB"
                required
                value={fighterB}
                onChange={(e) => setFighterB(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-200 transition-premium outline-none"
                placeholder="npr. Tyson Fury"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="eventName" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Kategorija / Naziv Događaja
              </label>
              <input
                type="text"
                id="eventName"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-200 transition-premium outline-none"
                placeholder="npr. Boks: Riyadh Season"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="date" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Datum Borbe
              </label>
              <input
                type="text"
                id="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-lg p-3 text-xs text-slate-200 transition-premium outline-none"
                placeholder="npr. 25. srpnja"
              />
            </div>

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
                  <Plus size={14} />
                  Dodaj borbu
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Fights Listing */}
        <div className="lg:col-span-2 surface-card p-6 space-y-4">
          <h2 className="font-display font-bold text-white text-base uppercase border-l-4 border-primary pl-3 mb-2">
            Aktivne Borbe na Portalu
          </h2>

          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center gap-2 text-slate-500">
              <Loader2 className="animate-spin text-primary" size={20} />
              <p className="text-[10px] font-bold uppercase tracking-wider">Učitavanje borbi...</p>
            </div>
          ) : events.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-4 text-center">Nema unesenih nadolazećih borbi. Prikazuju se zadane (mock) borbe.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {events.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-display font-bold text-sm text-white">
                      {item.fighterA} <span className="text-red-500">VS</span> {item.fighterB}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <span className="text-primary">{item.event}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id, `${item.fighterA} VS ${item.fighterB}`)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 transition-premium cursor-pointer shrink-0"
                    title="Obriši"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
