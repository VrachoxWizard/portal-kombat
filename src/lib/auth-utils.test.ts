import { describe, it, expect } from "vitest";
import { isAdmin, ROLES } from "./auth-utils";

describe("auth-utils roles", () => {
  it("identifies admin role", () => {
    expect(isAdmin(ROLES.ADMIN)).toBe(true);
    expect(isAdmin(ROLES.EDITOR)).toBe(false);
  });
});
