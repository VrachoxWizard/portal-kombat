import { revalidatePath, revalidateTag } from "next/cache";

/** Revalidate public pages and cache tags after CMS content changes. */
export function revalidatePostPaths(slug?: string, type?: string) {
  if (slug) {
    revalidatePath(`/clanak/${slug}`);
  }
  revalidatePath("/");
  revalidatePath("/novosti");
  revalidatePath("/blog");
  revalidatePath("/predikcije");
  revalidatePath("/pretraga");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");

  // Revalidate cache tags for Vercel optimization
  revalidateTag("sidebar", "max");

  if (type === "PREDICTION") {
    revalidatePath("/predikcije");
    revalidateTag("predictions", "max");
  }
}

export function revalidateFighterPaths(slug?: string) {
  revalidatePath("/borci");
  if (slug) {
    revalidatePath(`/borci/${slug}`);
  }
  revalidatePath("/sitemap.xml");
  revalidateTag("sidebar", "max");
}

export function revalidateEventPaths() {
  revalidateTag("events", "max");
  revalidatePath("/");
}
