import { prisma } from "./prisma";

export { computePredictionCorrectness, PREDICTION_METHODS } from "./prediction-constants";
export type { PredictionMethod } from "./prediction-constants";

export interface PredictionStats {
  total: number;
  resolved: number;
  correct: number;
  accuracy: number | null;
}

/**
 * Calculates correct/incorrect prediction statistics for a given author or year.
 * Aggregates prediction count, resolved predictions count, correct predictions, 
 * and computes accuracy percentage from database records.
 * 
 * @param options Optional filters (authorId and year).
 * @returns Prediction stats object including total, resolved, correct, and accuracy percentage.
 */
export async function getPredictionStats(options?: {
  authorId?: string;
  year?: number;
}): Promise<PredictionStats> {
  const where = {
    post: {
      type: "PREDICTION" as const,
      status: "PUBLISHED" as const,
      ...(options?.authorId ? { authorId: options.authorId } : {}),
      ...(options?.year
        ? {
            publishedAt: {
              gte: new Date(`${options.year}-01-01`),
              lt: new Date(`${options.year + 1}-01-01`),
            },
          }
        : {}),
    },
  };

  const [total, resolved, correct] = await Promise.all([
    prisma.prediction.count({ where }),
    prisma.prediction.count({
      where: { ...where, resolvedAt: { not: null } },
    }),
    prisma.prediction.count({
      where: { ...where, isCorrect: true },
    }),
  ]);

  return {
    total,
    resolved,
    correct,
    accuracy: resolved > 0 ? Math.round((correct / resolved) * 100) : null,
  };
}
