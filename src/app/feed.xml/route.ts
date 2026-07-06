import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/env";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts: Array<{
    title: string;
    slug: string;
    excerpt: string | null;
    publishedAt: Date | null;
    author: { name: string };
    category: { name: string } | null;
  }> = [];

  try {
    posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 30,
    });
  } catch (error) {
    console.warn("RSS feed: DB unavailable", error);
  }

  const items = posts
    .map((post) => {
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString();
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/clanak/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/clanak/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt ?? "")}</description>
      <author>${escapeXml(post.author.name)}</author>
      ${post.category ? `<category>${escapeXml(post.category.name)}</category>` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>CombatPortal HR</title>
    <link>${SITE_URL}</link>
    <description>Vodeći hrvatski portal za MMA, boks i kickboks</description>
    <language>hr-HR</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
