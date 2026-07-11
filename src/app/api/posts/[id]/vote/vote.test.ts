import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    prediction: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("POST /api/posts/[id]/vote", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when fighter corner is invalid", async () => {
    const request = new NextRequest("http://localhost/api/posts/123/vote", {
      method: "POST",
      body: JSON.stringify({ fighter: "C" }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: "123" }) });
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Nevaljali kut");
  });

  it("returns 404 when prediction is not found", async () => {
    vi.mocked(prisma.prediction.findUnique).mockResolvedValue(null);
    const request = new NextRequest("http://localhost/api/posts/123/vote", {
      method: "POST",
      body: JSON.stringify({ fighter: "A" }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: "123" }) });
    expect(response.status).toBe(404);
  });

  it("increments fighter votes and returns 200 when successful", async () => {
    vi.mocked(prisma.prediction.findUnique).mockResolvedValue({
      id: "pred-1",
      postId: "123",
      fighterA: "Conor McGregor",
      fighterB: "Max Holloway",
      winner: "Max Holloway",
      method: "KO",
      predictedRound: "3",
      confidenceScore: 70,
      keyReasoning: "reason",
      votesFighterA: 10,
      votesFighterB: 20,
      actualWinner: null,
      actualMethod: null,
      actualRound: null,
      isCorrect: null,
      resolvedAt: null,
    });

    vi.mocked(prisma.prediction.update).mockResolvedValue({
      votesFighterA: 11,
      votesFighterB: 20,
    } as any);

    const request = new NextRequest("http://localhost/api/posts/123/vote", {
      method: "POST",
      body: JSON.stringify({ fighter: "A" }),
    });
    const response = await POST(request, { params: Promise.resolve({ id: "123" }) });
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.votesFighterA).toBe(11);
  });
});
