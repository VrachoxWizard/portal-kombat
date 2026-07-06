"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { PREDICTION_METHODS } from "@/lib/prediction-constants";

export interface PredictionFormState {
  eventId: string;
  fighterA: string;
  fighterB: string;
  winner: string;
  method: string;
  predictedRound: string;
  confidenceScore: number;
  keyReasoning: string;
  actualWinner: string;
  actualMethod: string;
  actualRound: string;
  resolve: boolean;
  clearResolution: boolean;
}

interface EventOption {
  id: string;
  fighterA: string;
  fighterB: string;
  event: string;
  date: string;
}

interface PredictionFormFieldsProps {
  value: PredictionFormState;
  onChange: (value: PredictionFormState) => void;
  showResolution?: boolean;
}

export function PredictionFormFields({
  value,
  onChange,
  showResolution = false,
}: PredictionFormFieldsProps) {
  const [events, setEvents] = useState<EventOption[]>([]);

  useEffect(() => {
    fetch("/api/cms/events")
      .then((r) => (r.ok ? r.json() : []))
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  const set = (patch: Partial<PredictionFormState>) =>
    onChange({ ...value, ...patch });

  const winnerOptions = [value.fighterA, value.fighterB].filter(Boolean);

  return (
    <div className="surface-card p-6 space-y-4 border border-emerald-500/10">
      <h2 className="font-display font-bold text-emerald-400 text-base uppercase border-l-4 border-emerald-500 pl-3 mb-2 flex items-center gap-2">
        <TrendingUp size={18} />
        Prognoza i Analiza Sraza
      </h2>

      {events.length > 0 && (
        <div className="space-y-1">
          <label htmlFor="eventId" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Poveži s događajem (opcionalno)
          </label>
          <select
            id="eventId"
            value={value.eventId}
            onChange={(e) => {
              const ev = events.find((x) => x.id === e.target.value);
              if (ev) {
                set({
                  eventId: ev.id,
                  fighterA: ev.fighterA,
                  fighterB: ev.fighterB,
                });
              } else {
                set({ eventId: "" });
              }
            }}
            className="w-full bg-slate-900 border border-white/5 rounded-lg p-3 text-xs text-slate-300 outline-none"
          >
            <option value="">— Odaberi događaj —</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.event}: {ev.fighterA} vs {ev.fighterB} ({ev.date})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label htmlFor="fighterA" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Borac A
          </label>
          <input
            id="fighterA"
            value={value.fighterA}
            onChange={(e) => set({ fighterA: e.target.value })}
            className="w-full bg-slate-900/60 border border-white/5 rounded-lg p-3 text-sm text-slate-200 outline-none"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="fighterB" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Borac B
          </label>
          <input
            id="fighterB"
            value={value.fighterB}
            onChange={(e) => set({ fighterB: e.target.value })}
            className="w-full bg-slate-900/60 border border-white/5 rounded-lg p-3 text-sm text-slate-200 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="winner" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Predviđeni pobjednik
          </label>
          <select
            id="winner"
            value={value.winner}
            onChange={(e) => set({ winner: e.target.value })}
            className="w-full bg-slate-900 border border-white/5 rounded-lg p-3 text-sm text-slate-200 outline-none"
          >
            <option value="">— Odaberi —</option>
            {winnerOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="method" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Metoda pobjede
          </label>
          <select
            id="method"
            value={value.method}
            onChange={(e) => set({ method: e.target.value })}
            className="w-full bg-slate-900 border border-white/5 rounded-lg p-3 text-sm text-slate-200 outline-none"
          >
            <option value="">— Odaberi —</option>
            {PREDICTION_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="predictedRound" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Runda završetka
          </label>
          <input
            id="predictedRound"
            value={value.predictedRound}
            onChange={(e) => set({ predictedRound: e.target.value })}
            className="w-full bg-slate-900/60 border border-white/5 rounded-lg p-3 text-sm text-slate-200 outline-none"
            placeholder="npr. 3. runda"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Pouzdanost prognoze</span>
          <span className="text-emerald-400 font-extrabold">{value.confidenceScore}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={value.confidenceScore}
          onChange={(e) => set({ confidenceScore: Number(e.target.value) })}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="keyReasoning" className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
          Ključno obrazloženje
        </label>
        <textarea
          id="keyReasoning"
          rows={3}
          value={value.keyReasoning}
          onChange={(e) => set({ keyReasoning: e.target.value })}
          className="w-full bg-slate-900/60 border border-white/5 rounded-lg p-3 text-sm text-slate-200 outline-none resize-none italic"
        />
      </div>

      {showResolution && (
        <div className="border-t border-white/10 pt-4 space-y-3">
          <h3 className="text-xs font-extrabold uppercase text-amber-400 tracking-wider">
            Označi stvarni ishod
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={value.actualWinner}
              onChange={(e) =>
                set({ actualWinner: e.target.value, resolve: !!e.target.value })
              }
              className="bg-slate-900 border border-white/5 rounded-lg p-2 text-sm text-slate-200"
            >
              <option value="">Stvarni pobjednik</option>
              {winnerOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={value.actualMethod}
              onChange={(e) => set({ actualMethod: e.target.value })}
              className="bg-slate-900 border border-white/5 rounded-lg p-2 text-sm text-slate-200"
            >
              <option value="">Metoda</option>
              {PREDICTION_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              value={value.actualRound}
              onChange={(e) => set({ actualRound: e.target.value })}
              placeholder="Runda"
              className="bg-slate-900/60 border border-white/5 rounded-lg p-2 text-sm text-slate-200"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              set({
                actualWinner: "",
                actualMethod: "",
                actualRound: "",
                resolve: false,
                clearResolution: true,
              })
            }
            className="text-xs text-slate-500 hover:text-red-400"
          >
            Ukloni označeni ishod
          </button>
        </div>
      )}
    </div>
  );
}

export const defaultPredictionFormState: PredictionFormState = {
  eventId: "",
  fighterA: "",
  fighterB: "",
  winner: "",
  method: "",
  predictedRound: "",
  confidenceScore: 70,
  keyReasoning: "",
  actualWinner: "",
  actualMethod: "",
  actualRound: "",
  resolve: false,
  clearResolution: false,
};
