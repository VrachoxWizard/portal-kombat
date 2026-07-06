import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CombatPortal HR",
    short_name: "CombatPortal",
    description: "Borilačke vijesti, analize i predikcije",
    start_url: "/",
    display: "standalone",
    background_color: "#060810",
    theme_color: "#ef4444",
    lang: "hr",
  };
}
