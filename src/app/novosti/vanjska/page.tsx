import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMockPosts } from "@/lib/mockData";
import type { ListingPost } from "@/lib/post-types";
import InterstitialClient from "@/components/article/InterstitialClient";

interface PageProps {
  searchParams: Promise<{
    url?: string;
    title?: string;
    excerpt?: string;
    image?: string;
    source?: string;
    date?: string;
  }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { title, source } = await searchParams;
  const decodedTitle = title ? decodeURIComponent(title) : "";
  const decodedSource = source ? decodeURIComponent(source) : "Vanjski izvor";

  return {
    title: decodedTitle 
      ? `${decodedTitle} | ${decodedSource} putem CombatPortal HR` 
      : "Preusmjeravanje | CombatPortal HR",
    description: "Pregledajte vanjski članak s borilačkih portala.",
  };
}

async function getRelatedArticles(): Promise<ListingPost[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 3,
    });

    if (posts.length === 0) {
      return getMockPosts().slice(0, 3) as ListingPost[];
    }

    return posts as ListingPost[];
  } catch (error) {
    console.warn("DB not accessible, falling back to mock posts for recommendations:", error);
    return getMockPosts().slice(0, 3) as ListingPost[];
  }
}

export default async function ExternalArticlePage({ searchParams }: PageProps) {
  const { url, title, excerpt, image, source, date } = await searchParams;

  if (!url) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles();

  return (
    <InterstitialClient
      url={url}
      title={title || ""}
      excerpt={excerpt || ""}
      image={image || ""}
      source={source || ""}
      date={date || ""}
      relatedArticles={relatedArticles}
    />
  );
}
