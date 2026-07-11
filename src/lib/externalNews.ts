export interface ExternalArticle {
  id: string;
  title: string;
  link: string;
  excerpt: string;
  publishedAt: string;
  featuredImage: string;
  source: string;
}

/**
 * Fetches external combat sports RSS feeds (MMA Junkie, Boxing News 24).
 * Parses items using regular expressions, extracts imagery from media tags,
 * and normalizes the output into standard ExternalArticle objects.
 * Saves results under server-side caching (revalidated every 5 minutes).
 * 
 * @returns A promise resolving to an array of normalized articles.
 */
export async function fetchExternalNews(): Promise<ExternalArticle[]> {
  const feeds = [
    { name: "MMA Junkie", url: "https://mmajunkie.usatoday.com/feed" },
    { name: "Boxing News 24", url: "https://www.boxingnews24.com/feed" }
  ];
  
  const articles: ExternalArticle[] = [];
  
  for (const feed of feeds) {
    try {
      // Add a user-agent header to avoid getting blocked by Cloudflare or anti-scraping
      const res = await fetch(feed.url, { 
        next: { revalidate: 300 }, // Cache on server for 5 minutes
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      
      if (!res.ok) {
        console.warn(`Failed to fetch RSS from ${feed.name}: ${res.statusText}`);
        continue;
      }
      
      const text = await res.text();
      
      // Basic regex parsing of XML RSS items
      const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
      
      for (const item of items.slice(0, 8)) {
        const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
        const linkMatch = item.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/);
        const descMatch = item.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
        const dateMatch = item.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/);
        
        if (!titleMatch || !linkMatch) continue;
        
        const title = decodeHtmlEntities(titleMatch[1].trim());
        const link = linkMatch[1].trim();
        let desc = descMatch ? decodeHtmlEntities(descMatch[1].trim()) : "";
        
        // Clean up any remaining HTML tags from the excerpt/description
        desc = desc.replace(/<[^>]*>/g, "").trim();
        if (desc.length > 150) {
          desc = desc.substring(0, 150) + "...";
        }
        
        // Find image source in enclosure or media tags
        let featuredImage = "";
        
        // Try enclosure tag
        const enclosureMatch = item.match(/<enclosure[^>]*url="([^"]*)"/);
        if (enclosureMatch) {
          featuredImage = enclosureMatch[1];
        }
        
        // Try media content tag
        if (!featuredImage) {
          const mediaMatch = item.match(/<(?:media|content)[^>]*url="([^"]*)"/);
          if (mediaMatch) {
            featuredImage = mediaMatch[1];
          }
        }

        // Try to parse img src from description html if we can
        if (!featuredImage && descMatch) {
          const imgMatch = descMatch[1].match(/<img[^>]*src="([^"]*)"/);
          if (imgMatch) {
            featuredImage = imgMatch[1];
          }
        }
        
        // Fallbacks
        if (!featuredImage) {
          if (feed.name === "MMA Junkie") {
            featuredImage = "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=600&q=80"; // MMA action fallback
          } else {
            featuredImage = "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=600&q=80"; // Boxing gloves fallback
          }
        }
        
        articles.push({
          id: link,
          title,
          link,
          excerpt: desc,
          publishedAt: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
          featuredImage,
          source: feed.name
        });
      }
    } catch (err) {
      console.error(`Error fetching feed ${feed.name}:`, err);
    }
  }
  
  return articles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6);
}

/**
 * Decodes standard HTML entities and unicode numeric character references
 * into their corresponding UTF-8 string symbols.
 * 
 * @param str The string containing HTML entities.
 * @returns The decoded plain string.
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}
