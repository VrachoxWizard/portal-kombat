/**
 * Converts a string into a URL-friendly slug.
 * Replaces Croatian diacritics (Đ/Š/Ć/Č/Ž) with standard English letters,
 * strips special characters, replaces whitespaces with hyphens, and trims margins.
 * 
 * @param text The input string to convert.
 * @returns The generated slug.
 */
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

