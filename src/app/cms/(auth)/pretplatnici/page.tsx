"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Trash2,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface SubscriberItem {
  id: string;
  email: string;
  createdAt: string;
}

export default function CmsSubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSubscribers = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cms/subscribers");
      if (!res.ok) throw new Error("Neuspjelo dohvaćanje pretplatnika");
      const data = await res.json();
      setSubscribers(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Greška pri učitavanju";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubscribers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchSubscribers]);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Jeste li sigurni da želite ukloniti pretplatnika: "${email}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/cms/subscribers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Brisanje nije uspjelo");
      }

      setSuccess("Pretplatnik uspješno uklonjen!");
      setSubscribers(subscribers.filter((s) => s.id !== id));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Greška pri brisanju";
      setError(message);
      setTimeout(() => setError(""), 4000);
    }
  };

  const exportToCSV = () => {
    if (subscribers.length === 0) return;

    // Build CSV content
    const headers = ["ID", "Email", "Datum Prijave"];
    const rows = subscribers.map((s) => [
      s.id,
      s.email,
      new Date(s.createdAt).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `combatportal_newsletter_pretplatnici_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold italic uppercase tracking-tight text-white font-display">
            Pretplatnici na Newsletter
          </h1>
          <p className="text-sm text-slate-400 font-medium">Pregled i preuzimanje baze e-mail pretplatnika.</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/20 hover:text-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-300 disabled:hover:border-white/10 transition-premium cursor-pointer self-start sm:self-auto"
        >
          <Download size={14} />
          Preuzmi CSV
        </button>
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

      {/* Table block */}
      <div className="surface-card overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="animate-spin text-primary" size={24} />
            <p className="text-xs font-semibold uppercase tracking-wider">Učitavanje pretplatnika...</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="mx-auto text-slate-700 mb-3" size={32} />
            <p className="text-sm font-semibold">Nema prijavljenih pretplatnika.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider bg-black/20">
                  <th className="p-4 pl-6">E-mail Adresa</th>
                  <th className="p-4">Datum Prijave</th>
                  <th className="p-4 text-right pr-6">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {subscribers.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="p-4 pl-6">
                      <span className="font-bold text-white">{item.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-400 font-medium">
                        {new Date(item.createdAt).toLocaleDateString("hr-HR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => handleDelete(item.id, item.email)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 transition-premium cursor-pointer"
                        title="Ukloni pretplatnika"
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
