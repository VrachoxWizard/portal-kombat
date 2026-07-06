export const PREDICTION_METHODS = [
  "KO/TKO",
  "SUB",
  "DEC",
  "TKO (liječnik)",
  "Diskvalifikacija",
  "Ostalo",
] as const;

export type PredictionMethod = (typeof PREDICTION_METHODS)[number];

export function computePredictionCorrectness(
  predictedWinner: string,
  actualWinner: string
): boolean {
  return (
    predictedWinner.trim().toLowerCase() === actualWinner.trim().toLowerCase()
  );
}
