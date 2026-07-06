import { Prisma, PostType } from "@prisma/client";
import { prisma } from "./prisma";
import { getMockPosts } from "./mockData";
import { PAGE_SIZE } from "./constants";
import type { PostTypeKey } from "./constants";
import type { ListingPost } from "./post-types";

// ─── Query options ──────────────────────────────────────────────
export interface PostListingOptions {
  type?: PostTypeKey;
  search?: string;
  category?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
}

// ─── Return shape ───────────────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Main listing query (server-side pagination) ────────────────
export async function getPostListing(
  options: PostListingOptions = {}
): Promise<PaginatedResult<ListingPost>> {
  const {
    type,
    search,
    category,
    tag,
    page = 1,
    pageSize = PAGE_SIZE,
  } = options;

  const resolved = { type, search, category, tag, page, pageSize };

  try {
    const result = await queryDatabase(resolved);
    return result;
  } catch (error) {
    console.warn("Database unavailable, using mock data:", error instanceof Error ? error.message : error);
    return queryMockData(resolved);
  }
}

// ─── Resolved options (page + pageSize guaranteed) ──────────────
interface ResolvedOptions {
  type?: PostTypeKey;
  search?: string;
  category?: string;
  tag?: string;
  page: number;
  pageSize: number;
}

// ─── Database query with true LIMIT/OFFSET ──────────────────────
async function queryDatabase(
  options: ResolvedOptions
): Promise<PaginatedResult<ListingPost>> {
  const { type, search, category, tag, page, pageSize } = options;

  const whereClause: Prisma.PostWhereInput = {
    status: "PUBLISHED",
  };

  if (type) {
    whereClause.type = type as PostType;
  }

  if (category) {
    whereClause.category = { slug: category };
  }

  if (tag) {
    whereClause.tags = { some: { slug: tag } };
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  // Run count and data queries in parallel for efficiency
  const [total, posts] = await Promise.all([
    prisma.post.count({ where: whereClause }),
    prisma.post.findMany({
      where: whereClause,
      include: {
        author: true,
        category: true,
        prediction: type === "PREDICTION" || !type ? true : undefined,
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  // If DB returned zero results and there's no filter, fall back to mock data
  if (total === 0 && !search && !category && !tag) {
    return queryMockData({ type, search, category, tag, page, pageSize });
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  return {
    items: posts as ListingPost[],
    total,
    totalPages,
    currentPage,
    pageSize,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

// ─── Mock data fallback (filtered + paginated in memory) ────────
function queryMockData(
  options: ResolvedOptions
): PaginatedResult<ListingPost> {
  const { type, search, category, tag, page, pageSize } = options;

  const allMock = getMockPosts({
    type: type ? (type as PostType) : undefined,
    search: search || undefined,
    category: category || undefined,
    tag: tag || undefined,
  }) as ListingPost[];

  const total = allMock.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: allMock.slice(start, start + pageSize),
    total,
    totalPages,
    currentPage,
    pageSize,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

// ─── Convenience: parse page param from searchParams ────────────
export function parsePageParam(page?: string): number {
  const parsed = Number.parseInt(page ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
