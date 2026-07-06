import { revalidatePath } from "next/cache";

/** Revalidate public pages after CMS content changes. */
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

  if (type === "PREDICTION") {
    revalidatePath("/predikcije");
  }
}

export function revalidateFighterPaths(slug?: string) {
  revalidatePath("/borci");
  if (slug) {
    revalidatePath(`/borci/${slug}`);
  }
  revalidatePath("/sitemap.xml");
}
