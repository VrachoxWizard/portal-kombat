/** Croatian-aware slugify for headings and URLs. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[đ|Đ]/g, "d")
    .replace(/[š|Š]/g, "s")
    .replace(/[ć|Ć|č|Č]/g, "c")
    .replace(/[ž|Ž]/g, "z")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
