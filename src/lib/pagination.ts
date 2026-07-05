import { PAGE_SIZE } from "./constants";
import type { ListingPost } from "./post-types";

export function paginate<T extends ListingPost>(items: T[], page: number, pageSize = PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    total,
    totalPages,
    currentPage,
    pageSize,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export function parsePageParam(page?: string): number {
  const parsed = Number.parseInt(page ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}
