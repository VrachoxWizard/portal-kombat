import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMockPosts } from "@/lib/mockData";
import ArticleCard from "@/components/article/ArticleCard";
import Sidebar from "@/components/layout/Sidebar";
import { Hash } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getTagData(slug: string) {
  let posts: any[] = [];
  let tagName = "";

  try {
    const dbTag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        posts: {
          where: { status: "PUBLISHED" },
          include: {
            author: true,
            category: true,
          },
          orderBy: { publishedAt: "desc" },
        },
      },
    });

    if (dbTag) {
      tagName = dbTag.name;
      posts = dbTag.posts;
    } else {
      // Ako ne postoji u bazi, pokušaj s mock podacima
      const mockPosts = getMockPosts({ tag: slug });
      if (mockPosts.length > 0) {
        // Pronađi naziv taga iz mock objava
        const foundTag = mockPosts[0].tags.find((t) => t.slug === slug);
        tagName = foundTag ? foundTag.name : slug.toUpperCase();
        posts = mockPosts;
      }
    }
  } catch (error) {
    console.warn("DB not accessible. Using fallback for tag:", slug, error);
    const mockPosts = getMockPosts({ tag: slug });
    if (mockPosts.length > 0) {
      const foundTag = mockPosts[0].tags.find((t) => t.slug === slug);
      tagName = foundTag ? foundTag.name : slug.toUpperCase();
      posts = mockPosts;
    }
  }

  return { posts, tagName };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { tagName } = await getTagData(slug);
  
  if (!tagName) {
    return {
      title: "Oznaka nije pronađena | CombatPortal HR",
    };
  }

  return {
    title: `Objave označene s #${tagName} | CombatPortal HR`,
    description: `Pregled svih vijesti, kolumni i analiza označenih s ${tagName}.`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params;
  const { posts, tagName } = await getTagData(slug);

  if (!tagName) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Articles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-l-4 border-primary pl-3 mb-8 py-1 bg-muted/20 pr-4 rounded-r-lg">
            <Hash size={24} className="text-primary animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground uppercase">
              Oznaka: <span className="text-primary">#{tagName}</span>
            </h1>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
              Nema objavljenih članaka s ovom oznakom.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <ArticleCard
                  key={post.id}
                  title={post.title}
                  slug={post.slug}
                  excerpt={post.excerpt}
                  featuredImage={post.featuredImage}
                  type={post.type}
                  publishedAt={post.publishedAt}
                  category={post.category}
                  author={post.author}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right column: Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
