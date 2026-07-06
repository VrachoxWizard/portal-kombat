import { describe, it, expect } from "vitest";
import { computePredictionCorrectness } from "./prediction-constants";

describe("computePredictionCorrectness", () => {
  it("matches winners case-insensitively", () => {
    expect(computePredictionCorrectness("Jon Jones", "jon jones")).toBe(true);
    expect(computePredictionCorrectness("Stipe Miočić", "Stipe Miocic")).toBe(false);
  });

  it("trims whitespace", () => {
    expect(computePredictionCorrectness("  Jones  ", "Jones")).toBe(true);
  });
});
