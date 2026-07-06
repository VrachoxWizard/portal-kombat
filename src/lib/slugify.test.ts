import { describe, it, expect } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("handles Croatian diacritics", () => {
    expect(slugify("Miočić protiv Jonesa")).toBe("miocic-protiv-jonesa");
    expect(slugify("Šampion će pobijediti")).toBe("sampion-ce-pobijediti");
  });

  it("normalizes spaces and special chars", () => {
    expect(slugify("  Hello   World!  ")).toBe("hello-world");
  });
});
