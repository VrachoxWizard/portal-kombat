import { PostTypeKey } from "./constants";

export interface ListingPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  type: PostTypeKey;
  publishedAt: Date | string | null;
  category: { name: string; slug: string } | null;
  author: { name: string; avatarUrl?: string | null };
  prediction?: {
    fighterA: string;
    fighterB: string;
    winner: string;
    method?: string;
    predictedRound?: string | null;
    confidenceScore?: number;
    keyReasoning?: string;
    isCorrect?: boolean | null;
  } | null;
  content?: string;
}
