import { Prisma, PostType, PublishStatus } from "@prisma/client";
import { prisma } from "./prisma";
import { getMockPosts, getMockArticleBySlug } from "./mockData";
import { PAGE_SIZE } from "./constants";
import type { PostTypeKey } from "./constants";
import type { ListingPost } from "./post-types";
import { shouldUseMockData } from "./env";

const publicPostInclude = {
  author: true,
  category: true,
  prediction: true,
  tags: true,
} as const;

export type PublicPost = Prisma.PostGetPayload<{
  include: typeof publicPostInclude;
}>;

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

// ─── Public article fetch (published only, optional preview) ────
export async function getPublicPost(
  slug: string,
  options?: { previewToken?: string }
): Promise<PublicPost | null> {
  const previewSlug =
    options?.previewToken
      ? (await import("./preview")).verifyPreviewToken(options.previewToken)
      : null;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: publicPostInclude,
    });

    if (post) {
      if (post.status === "PUBLISHED") return post;
      if (previewSlug === slug) return post;
      return null;
    }
  } catch (error) {
    console.warn("DB not accessible for article:", slug, error);
  }

  if (!shouldUseMockData()) return null;

  const mock = getMockArticleBySlug(slug);
  return mock as PublicPost | null;
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
    return await queryDatabase(resolved);
  } catch (error) {
    console.warn(
      "Database unavailable:",
      error instanceof Error ? error.message : error
    );
    if (shouldUseMockData()) {
      return queryMockData(resolved);
    }
    return emptyPaginated(resolved);
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

function emptyPaginated(options: ResolvedOptions): PaginatedResult<ListingPost> {
  return {
    items: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: options.pageSize,
    hasNext: false,
    hasPrev: false,
  };
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
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

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

  if (total === 0 && !search && !category && !tag && shouldUseMockData()) {
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

export { PublishStatus };
