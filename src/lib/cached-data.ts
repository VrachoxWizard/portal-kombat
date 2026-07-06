import { getPredictionStats } from "@/lib/predictions";
import { unstable_cache } from "next/cache";

export function getCachedPredictionStats(authorId?: string, year?: number) {
  return unstable_cache(
    async () => getPredictionStats({ authorId, year }),
    ["prediction-stats", authorId ?? "all", String(year ?? "all")],
    { revalidate: 300, tags: ["predictions"] }
  )();
}

export const getCachedSidebarTags = unstable_cache(
  async () => {
    const { prisma } = await import("./prisma");
    const tagsFromDb = await prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
    });
    return tagsFromDb
      .map((t) => ({
        name: t.name,
        slug: t.slug,
        count: t._count.posts,
      }))
      .sort((a, b) => b.count - a.count);
  },
  ["sidebar-tags"],
  { revalidate: 300, tags: ["sidebar"] }
);

export const getCachedUpcomingEvents = unstable_cache(
  async () => {
    const { prisma } = await import("./prisma");
    return prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { fighterARel: true, fighterBRel: true },
    });
  },
  ["sidebar-events"],
  { revalidate: 300, tags: ["events"] }
);
