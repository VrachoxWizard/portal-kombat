export const PAGE_SIZE = 12;

export const CATEGORIES = [
  { slug: "mma", name: "MMA", label: "MMA / UFC" },
  { slug: "boks", name: "Boks", label: "Profesionalni Boks" },
  { slug: "kickboks", name: "Kickboks", label: "Kickboks / Glory" },
] as const;

export type PostTypeKey = "NEWS" | "BLOG" | "PREDICTION";

export const TYPE_LABELS: Record<PostTypeKey, string> = {
  NEWS: "Vijest",
  BLOG: "Blog",
  PREDICTION: "Predikcija",
};

export const TYPE_HERO_LABELS: Record<PostTypeKey, string> = {
  NEWS: "Vijest dana",
  BLOG: "Izdvojeni Blog",
  PREDICTION: "Prognoza meča",
};

export const TYPE_ROUTES: Record<PostTypeKey, string> = {
  NEWS: "/novosti",
  BLOG: "/blog",
  PREDICTION: "/predikcije",
};

export const TYPE_SECTION_NAMES: Record<PostTypeKey, string> = {
  NEWS: "Novosti",
  BLOG: "Blog",
  PREDICTION: "Predikcije",
};

export function getCategoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug.toUpperCase();
}
