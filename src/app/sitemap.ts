import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/novosti`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/predikcije`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/borci`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/o-nama`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/kontakt`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/pretraga`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.4,
    },
  ];

  let articlePages: MetadataRoute.Sitemap = [];
  let tagPages: MetadataRoute.Sitemap = [];
  let fighterPages: MetadataRoute.Sitemap = [];
  let authorPages: MetadataRoute.Sitemap = [];

  try {
    const [posts, tags, fighters, authors] = await Promise.all([
      prisma.post.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.tag.findMany({ select: { slug: true } }),
      prisma.fighter.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.user.findMany({
        where: { posts: { some: { status: "PUBLISHED" } } },
        select: { id: true },
      }),
    ]);

    articlePages = posts.map((post) => ({
      url: `${SITE_URL}/clanak/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    tagPages = tags.map((tag) => ({
      url: `${SITE_URL}/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    fighterPages = fighters.map((fighter) => ({
      url: `${SITE_URL}/borci/${fighter.slug}`,
      lastModified: fighter.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    authorPages = authors.map((author) => ({
      url: `${SITE_URL}/autor/${author.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
  } catch (error) {
    console.warn(
      "Could not fetch dynamic URLs for sitemap:",
      error instanceof Error ? error.message : error
    );
  }

  return [
    ...staticPages,
    ...articlePages,
    ...tagPages,
    ...fighterPages,
    ...authorPages,
  ];
}
