import React from "react";
import { CheckCircle2, AlertTriangle, FileText, Link2 } from "lucide-react";

export type TrustLevel = "CONFIRMED" | "REPORT" | "RUMOR";

export interface Citation {
  name: string;
  url: string;
}

interface TrustIndicatorProps {
  trustLevel: TrustLevel;
  citations?: Citation[] | null | any;
}

export const TrustIndicator: React.FC<TrustIndicatorProps> = ({
  trustLevel,
  citations = [],
}) => {
  // Parse citations if it's passed as a JSON string or arbitrary DB object
  let parsedCitations: Citation[] = [];
  try {
    if (typeof citations === "string") {
      parsedCitations = JSON.parse(citations);
    } else if (Array.isArray(citations)) {
      parsedCitations = citations;
    }
  } catch (e) {
    console.error("Error parsing citations", e);
  }

  // Filter out empty URL citations
  parsedCitations = parsedCitations.filter(c => c && typeof c === "object" && typeof c.url === "string" && c.url.trim() !== "");

  const config = {
    CONFIRMED: {
      label: "Službeno Potvrđeno",
      description: "Informacija dobivena izravno od službenih izvora, boraca ili promocije.",
      colorClass: "border-emerald-500/20 bg-emerald-950/10 text-emerald-400",
      badgeColor: "bg-emerald-500/20 text-emerald-400",
      icon: <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />,
    },
    REPORT: {
      label: "Novinarski Izvještaj",
      description: "Članak se temelji na provjerenim novinarskim vijestima i relevantnim izvorima.",
      colorClass: "border-white/10 bg-slate-900/40 text-slate-300",
      badgeColor: "bg-white/10 text-slate-300",
      icon: <FileText size={16} className="text-slate-400 shrink-0" />,
    },
    RUMOR: {
      label: "Glasina / Špekulacija",
      description: "Nepotvrđene informacije i šaputanja iz borilačkih krugova. Čitajte s oprezom.",
      colorClass: "border-amber-500/20 bg-amber-950/10 text-amber-400",
      badgeColor: "bg-amber-500/20 text-amber-400",
      icon: <AlertTriangle size={16} className="text-amber-400 shrink-0" />,
    },
  }[trustLevel] || {
    label: "Izvještaj",
    description: "Provjeren borilački sadržaj.",
    colorClass: "border-white/10 bg-slate-900/40 text-slate-300",
    badgeColor: "bg-white/10 text-slate-300",
    icon: <FileText size={16} className="text-slate-400 shrink-0" />,
  };

  return (
    <div className={`p-4 border rounded-none font-sans space-y-3 transition-premium ${config.colorClass}`}>
      <div className="flex items-start gap-3">
        {config.icon}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 ${config.badgeColor}`}>
              {config.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>

      {parsedCitations.length > 0 && (
        <div className="border-t border-white/5 pt-2.5 mt-2">
          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mb-1.5">
            Vjerodostojni izvori i reference:
          </span>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {parsedCitations.map((citation, i) => (
              <a
                key={i}
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-primary transition-colors font-semibold"
              >
                <Link2 size={12} className="opacity-60" />
                {citation.name || "Izvor vijesti"}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustIndicator;
