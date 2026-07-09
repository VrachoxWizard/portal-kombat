import { getPredictionStats } from "@/lib/predictions";
import { cacheLife, cacheTag } from "next/cache";

export async function getCachedPredictionStats(authorId?: string, year?: number) {
  "use cache";
  cacheLife({ revalidate: 300, expire: 3600 });
  cacheTag("predictions");
  return getPredictionStats({ authorId, year });
}

export async function getCachedSidebarTags() {
  "use cache";
  cacheLife({ revalidate: 300, expire: 3600 });
  cacheTag("sidebar");
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
}

export async function getCachedUpcomingEvents() {
  "use cache";
  cacheLife({ revalidate: 300, expire: 3600 });
  cacheTag("events");
  const { prisma } = await import("./prisma");
  return prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { fighterARel: true, fighterBRel: true },
  });
}
