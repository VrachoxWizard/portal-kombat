/**
 * @module ServerOnly
 * Caching layer for database queries using Next.js 16 `"use cache"` directive.
 * Configures cache tags and expiration times to optimize page load speeds.
 */

import { getPredictionStats } from "@/lib/predictions";
import { cacheLife, cacheTag } from "next/cache";

/**
 * Retrieves cached statistics for fighter predictions.
 * Configured with a 5-minute revalidation time and 1-hour hard expiration.
 * 
 * @param authorId Optional author ID to filter stats.
 * @param year Optional year to filter stats.
 * @returns An object containing predictions statistics (correct count, total, percentage).
 */
export async function getCachedPredictionStats(authorId?: string, year?: number) {
  "use cache";
  cacheLife({ revalidate: 300, expire: 3600 });
  cacheTag("predictions");
  return getPredictionStats({ authorId, year });
}

/**
 * Retrieves cached tags with post counts for the portal sidebar.
 * Tags are sorted by popularity (number of associated posts) descending.
 * 
 * @returns Array of tags with name, slug, and count properties.
 */
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

/**
 * Retrieves the top 5 most recently created upcoming events.
 * Relies on the Next.js cache layer to prevent redundant database lookups.
 * 
 * @returns Upcoming events database rows with associated fighter relations.
 */
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

