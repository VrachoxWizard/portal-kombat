# Prediction Voting System (Glas Naroda) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully interactive Prediction Voting System ("Glas Naroda") that allows public visitors to vote on fight winners, displays live community sentiment statistics, and stores vote state locally.

**Architecture:** Extend the Prisma `Prediction` model with vote counters, write a Next.js 16 dynamic API route `/api/posts/[id]/vote/route.ts` to atomically increment selections, and implement a client-side `GlasNarodaWidget` for the homepage sidebar and integrated voting panels inside prediction articles. State is tracked via browser `localStorage`.

**Tech Stack:** Next.js 16 (App Router), React 19, Prisma ORM, PostgreSQL (Neon), Tailwind CSS v4, Framer Motion, Vitest, Lucide Icons.

## Global Constraints
- OPERATING_SYSTEM: Windows
- LANGUAGE: Croatian ("hr")
- CODING_STYLE: Explicit TypeScript types, zero use of `any`, preserve all unrelated JSDocs and JSDoc blocks.
- DRY: Import common slugification and fighters auto-linking utilities when needed.
- VERIFICATION: Project must compile with `pnpm build`, pass tests with `pnpm test`, and run clean with `pnpm lint`.

---

### Task 1: Database Schema & Seeding Upgrade

**Files:**
- Modify: [schema.prisma](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/schema.prisma)
- Modify: [seed.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed.ts)
- Modify: [seed-real-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed-real-data.ts)

**Interfaces:**
- Produces: Updated `Prediction` database model definitions including `votesFighterA` and `votesFighterB`.

- [ ] **Step 1: Modify schema.prisma**
  Modify [schema.prisma](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/schema.prisma):
  Add two fields to the `Prediction` model around line 108:
  ```prisma
    votesFighterA    Int @default(0)
    votesFighterB    Int @default(0)
  ```

- [ ] **Step 2: Modify seed.ts**
  Modify [seed.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed.ts):
  Update the prediction creation objects to explicitly set default values for vote counts.
  At lines 329-342 and lines 359-372, add:
  ```typescript
        votesFighterA: 45,
        votesFighterB: 15,
  ```

- [ ] **Step 3: Modify seed-real-data.ts**
  Modify [seed-real-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed-real-data.ts):
  Update prediction creation objects at lines 362-375 to add:
  ```typescript
        votesFighterA: 78,
        votesFighterB: 22,
  ```

- [ ] **Step 4: Push schema changes and regenerate Prisma Client**
  Run: `pnpm prisma db push`
  Expected: Schema changes applied successfully to the Neon database.
  Run: `pnpm prisma generate`
  Expected: Generated Prisma Client successfully.

- [ ] **Step 5: Run database seeds**
  Run: `pnpm tsx prisma/seed.ts`
  Expected: Standard seed executes successfully.
  Run: `pnpm tsx prisma/seed-real-data.ts`
  Expected: Real data seed executes successfully.

- [ ] **Step 6: Commit changes**
  Run:
  ```bash
  git add prisma/schema.prisma prisma/seed.ts prisma/seed-real-data.ts; git commit -m "db: add votesFighterA and votesFighterB columns to Prediction model and update seeds"
  ```

---

### Task 2: API Endpoint Integration

**Files:**
- Create: [src/app/api/posts/[id]/vote/route.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/api/posts/[id]/vote/route.ts)
- Create: [src/app/api/posts/[id]/vote/vote.test.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/api/posts/[id]/vote/vote.test.ts)

**Interfaces:**
- Produces: API dynamic endpoint `/api/posts/[id]/vote` returning `{ success: boolean, votesFighterA: number, votesFighterB: number }`.

- [ ] **Step 1: Create vote route.ts**
  Write code to [src/app/api/posts/[id]/vote/route.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/api/posts/[id]/vote/route.ts):
  ```typescript
  import { NextRequest, NextResponse } from "next/server";
  import { prisma } from "@/lib/prisma";

  export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const body = await request.json();
      const { fighter } = body;

      if (fighter !== "A" && fighter !== "B") {
        return NextResponse.json(
          { error: "Nevaljali kut borca. Mora biti 'A' ili 'B'." },
          { status: 400 }
        );
      }

      const prediction = await prisma.prediction.findUnique({
        where: { postId: id },
      });

      if (!prediction) {
        return NextResponse.json(
          { error: "Predikcija nije pronađena za ovu objavu." },
          { status: 404 }
        );
      }

      const updated = await prisma.prediction.update({
        where: { postId: id },
        data: {
          votesFighterA: fighter === "A" ? { increment: 1 } : undefined,
          votesFighterB: fighter === "B" ? { increment: 1 } : undefined,
        },
        select: {
          votesFighterA: true,
          votesFighterB: true,
        },
      });

      return NextResponse.json({
        success: true,
        votesFighterA: updated.votesFighterA,
        votesFighterB: updated.votesFighterB,
      });
    } catch (error) {
      console.error("Greška prilikom glasanja:", error);
      return NextResponse.json(
        { error: "Greška prilikom spremanja glasa u bazu." },
        { status: 500 }
      );
    }
  }
  ```

- [ ] **Step 2: Create unit tests at vote.test.ts**
  Write test code to [src/app/api/posts/[id]/vote/vote.test.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/api/posts/[id]/vote/vote.test.ts):
  ```typescript
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
  ```

- [ ] **Step 3: Run Vitest tests**
  Run: `pnpm test`
  Expected: All tests pass.

- [ ] **Step 4: Commit changes**
  Run:
  ```bash
  git add src/app/api/posts/\[id\]/vote; git commit -m "feat: implement prediction voting API route and integration tests"
  ```

---

### Task 3: Sidebar "Glas Naroda" Widget Component

**Files:**
- Create: [src/components/layout/GlasNarodaWidget.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/layout/GlasNarodaWidget.tsx)
- Modify: [src/components/layout/Sidebar.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/layout/Sidebar.tsx)

**Interfaces:**
- Consumes: Prisma prediction data from [Sidebar.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/layout/Sidebar.tsx)
- Produces: Client-side interactive widget allowing voting and displaying real-time splits.

- [ ] **Step 1: Create GlasNarodaWidget.tsx**
  Write client component code to [src/components/layout/GlasNarodaWidget.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/layout/GlasNarodaWidget.tsx):
  ```typescript
  "use client";

  import React, { useState, useEffect } from "react";
  import Link from "next/link";
  import { motion, AnimatePresence } from "framer-motion";
  import { Swords, Award } from "lucide-react";

  interface GlasNarodaProps {
    predictionId: string;
    postId: string;
    fighterA: string;
    fighterB: string;
    initialVotesA: number;
    initialVotesB: number;
    postSlug: string;
    expertWinner: string;
  }

  export const GlasNarodaWidget: React.FC<GlasNarodaProps> = ({
    predictionId,
    postId,
    fighterA,
    fighterB,
    initialVotesA,
    initialVotesB,
    postSlug,
    expertWinner,
  }) => {
    const [hasVoted, setHasVoted] = useState(false);
    const [voteChoice, setVoteChoice] = useState<"A" | "B" | null>(null);
    const [votesA, setVotesA] = useState(initialVotesA);
    const [votesB, setVotesB] = useState(initialVotesB);
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
      const stored = localStorage.getItem(`cp-vote-${predictionId}`);
      if (stored === "A" || stored === "B") {
        setHasVoted(true);
        setVoteChoice(stored);
      }
    }, [predictionId]);

    const handleVote = async (choice: "A" | "B") => {
      if (hasVoted || isVoting) return;
      setIsVoting(true);

      // Optimistic UI updates
      if (choice === "A") setVotesA((prev) => prev + 1);
      if (choice === "B") setVotesB((prev) => prev + 1);
      setHasVoted(true);
      setVoteChoice(choice);
      localStorage.setItem(`cp-vote-${predictionId}`, choice);

      try {
        const res = await fetch(`/api/posts/${postId}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fighter: choice }),
        });
        if (res.ok) {
          const data = await res.json();
          setVotesA(data.votesFighterA);
          setVotesB(data.votesFighterB);
        }
      } catch (e) {
        console.error("Greška pri glasanju:", e);
      } finally {
        setIsVoting(false);
      }
    };

    const totalVotes = votesA + votesB;
    const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
    const pctB = totalVotes > 0 ? 100 - pctA : 50;

    const peopleWinner = pctA > pctB ? fighterA : pctA < pctB ? fighterB : "Izjednačeno";
    const consensusAligns =
      (pctA > pctB && expertWinner === fighterA) ||
      (pctB > pctA && expertWinner === fighterB);

    return (
      <div className="bezel-outer">
        <div className="bezel-inner p-6 bg-slate-950/90 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
            <h3 className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-1.5">
              <Swords size={12} className="text-primary animate-pulse" />
              ⚡ GLAS NARODA
            </h3>
            <span className="font-mono text-[8px] text-slate-500 font-extrabold uppercase tracking-widest">
              Aktivna anketa
            </span>
          </div>

          {/* Matchup names */}
          <div className="text-center mb-6">
            <Link
              href={`/clanak/${postSlug}`}
              className="font-display font-black italic text-base sm:text-lg text-white uppercase hover:text-primary transition-premium leading-tight tracking-tight block"
            >
              {fighterA} vs {fighterB}
            </Link>
            <span className="text-[9px] text-slate-500 font-mono font-semibold uppercase tracking-wider mt-1 block">
              Tko pobjeđuje? Glasajte i saznajte mišljenje javnosti
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!hasVoted ? (
              <motion.div
                key="vote-buttons"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-2 gap-3"
              >
                <button
                  onClick={() => handleVote("A")}
                  disabled={isVoting}
                  className="group relative flex flex-col items-center justify-center p-3 rounded-none border border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-premium cursor-pointer"
                >
                  <span className="font-display font-extrabold italic text-[11px] text-white uppercase truncate max-w-full">
                    {fighterA}
                  </span>
                  <span className="text-[8px] text-fighter-blue font-mono font-black tracking-widest mt-1">
                    PLAVI KUT
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-fighter-blue opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>

                <button
                  onClick={() => handleVote("B")}
                  disabled={isVoting}
                  className="group relative flex flex-col items-center justify-center p-3 rounded-none border border-white/10 bg-white/5 hover:border-red-500/40 hover:bg-red-500/5 transition-premium cursor-pointer"
                >
                  <span className="font-display font-extrabold italic text-[11px] text-white uppercase truncate max-w-full">
                    {fighterB}
                  </span>
                  <span className="text-[8px] text-fighter-red font-mono font-black tracking-widest mt-1">
                    CRVENI KUT
                  </span>
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-fighter-red opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="vote-results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="space-y-4"
              >
                {/* Horizontal split-bar */}
                <div className="relative w-full h-6 bg-slate-900 border border-white/10 overflow-hidden flex">
                  {pctA > 0 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pctA}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-fighter-blue flex items-center pl-3 text-white font-mono text-[10px] font-black shrink-0 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                      {pctA}%
                    </motion.div>
                  )}
                  {pctB > 0 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pctB}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-fighter-red flex items-center justify-end pr-3 text-white font-mono text-[10px] font-black ml-auto shrink-0 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-l from-white/10 to-transparent" />
                      {pctB}%
                    </motion.div>
                  )}
                </div>

                {/* Vote stats info */}
                <div className="bg-black/40 border border-white/5 p-3 space-y-1.5 text-[9px] font-mono font-bold tracking-wider text-slate-400">
                  <div className="flex justify-between items-center text-white">
                    <span>NAROD BIRA:</span>
                    <span className={pctA > pctB ? "text-fighter-blue" : pctB > pctA ? "text-fighter-red" : "text-slate-300"}>
                      {peopleWinner}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>PORTAL BIRA:</span>
                    <span className={expertWinner === fighterA ? "text-fighter-blue" : "text-fighter-red"}>
                      {expertWinner}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-white/5">
                    <span>PODUDARANJE:</span>
                    <span className={consensusAligns ? "text-emerald-400" : "text-amber-400"}>
                      {consensusAligns ? "SLAGANJE ✓" : "RAZILAŽENJE ✗"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 font-extrabold uppercase tracking-widest pt-1">
                  <span>Ukupno glasova: {totalVotes}</span>
                  <Link href={`/clanak/${postSlug}`} className="text-primary hover:text-red-400 transition-premium">
                    Detaljna analiza &rarr;
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  export default GlasNarodaWidget;
  ```

- [ ] **Step 2: Integrate GlasNarodaWidget in Sidebar.tsx**
  Modify [Sidebar.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/layout/Sidebar.tsx):
  1. Add imports at the top:
     ```typescript
     import GlasNarodaWidget from "./GlasNarodaWidget";
     ```
  2. Fetch the active prediction inside `getSidebarData()`:
     Add active prediction query:
     ```typescript
     let activePrediction: any = null;
     try {
       popularTags = await getCachedSidebarTags();
       const eventsFromDb = await getCachedUpcomingEvents();
       upcomingFights = eventsFromDb.map((e) => ({
         id: e.id,
         fighterA: e.fighterA,
         fighterB: e.fighterB,
         fighterASlug: e.fighterARel?.slug || null,
         fighterBSlug: e.fighterBRel?.slug || null,
         event: e.event,
         date: e.date,
       }));

       // Fetch active prediction
       activePrediction = await prisma.prediction.findFirst({
         where: {
           isCorrect: null,
         },
         include: {
           post: {
             select: {
               slug: true,
               title: true,
             },
           },
         },
         orderBy: {
           post: {
             publishedAt: "desc",
           },
         },
       });
     } catch (error) {
       console.warn("Sidebar data error:", error);
     }
     ```
  3. Include `activePrediction` in the returned object:
     ```typescript
     return { popularTags, upcomingFights, activePrediction };
     ```
  4. Render the `GlasNarodaWidget` in the JSX:
     Add it directly inside the main `Sidebar` render block, immediately below the `<SearchWidget />` section (before upcoming fights):
     ```typescript
     export const Sidebar: React.FC = async () => {
       const { popularTags, upcomingFights, activePrediction } = await getSidebarData();

       return (
         <aside className="space-y-8">
           <Suspense fallback={<SearchSkeleton />}>
             <SearchWidget />
           </Suspense>

           {activePrediction && (
             <GlasNarodaWidget
               predictionId={activePrediction.id}
               postId={activePrediction.postId}
               fighterA={activePrediction.fighterA}
               fighterB={activePrediction.fighterB}
               initialVotesA={activePrediction.votesFighterA}
               initialVotesB={activePrediction.votesFighterB}
               postSlug={activePrediction.post.slug}
               expertWinner={activePrediction.winner}
             />
           )}

           <div className="bezel-outer">
             {/* Remaining elements ... */}
     ```

- [ ] **Step 3: Run build to verify TypeScript compilation**
  Run: `pnpm build`
  Expected: Build finishes successfully without warnings or compilation errors.

- [ ] **Step 4: Commit changes**
  Run:
  ```bash
  git add src/components/layout/GlasNarodaWidget.tsx src/components/layout/Sidebar.tsx; git commit -m "feat: build GlasNarodaWidget and integrate it into homepage Sidebar"
  ```

---

### Task 4: In-Article Voting Widget Integration

**Files:**
- Modify: [PredictionWidget.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/prediction/PredictionWidget.tsx)
- Modify: [src/app/clanak/[slug]/page.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/clanak/[slug]/page.tsx)

**Interfaces:**
- Consumes: Article prediction metadata and vote counts.
- Produces: Enhanced inline prediction widget that supports voting and renders comparison metrics.

- [ ] **Step 1: Upgrade PredictionWidget.tsx**
  Modify [PredictionWidget.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/prediction/PredictionWidget.tsx):
  1. Extend `PredictionProps` interface:
     ```typescript
     interface PredictionProps {
       fighterA: string;
       fighterB: string;
       winner: string;
       method: string;
       predictedRound?: string | null;
       confidenceScore: number;
       keyReasoning: string;
       actualWinner?: string | null;
       actualMethod?: string | null;
       actualRound?: string | null;
       isCorrect?: boolean | null;
       resolvedAt?: Date | string | null;
       
       // NEW fields
       predictionId?: string;
       postId?: string;
       initialVotesA?: number;
       initialVotesB?: number;
     }
     ```
  2. Implement client state and voting logic inside the component body:
     Replace lines 37-90 in [PredictionWidget.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/components/prediction/PredictionWidget.tsx):
     ```typescript
       const prefersReducedMotion = useSafeReducedMotion();

       const [hasVoted, setHasVoted] = useState(false);
       const [voteChoice, setVoteChoice] = useState<"A" | "B" | null>(null);
       const [votesA, setVotesA] = useState(initialVotesA || 0);
       const [votesB, setVotesB] = useState(initialVotesB || 0);
       const [isVoting, setIsVoting] = useState(false);

       useEffect(() => {
         if (!predictionId) return;
         const stored = localStorage.getItem(`cp-vote-${predictionId}`);
         if (stored === "A" || stored === "B") {
           setHasVoted(true);
           setVoteChoice(stored);
         }
       }, [predictionId]);

       const handleVote = async (choice: "A" | "B") => {
         if (!predictionId || !postId || hasVoted || isVoting) return;
         setIsVoting(true);

         if (choice === "A") setVotesA((prev) => prev + 1);
         if (choice === "B") setVotesB((prev) => prev + 1);
         setHasVoted(true);
         setVoteChoice(choice);
         localStorage.setItem(`cp-vote-${predictionId}`, choice);

         try {
           const res = await fetch(`/api/posts/${postId}/vote`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ fighter: choice }),
           });
           if (res.ok) {
             const data = await res.json();
             setVotesA(data.votesFighterA);
             setVotesB(data.votesFighterB);
           }
         } catch (e) {
           console.error("Greška pri glasanju:", e);
         } finally {
           setIsVoting(false);
         }
       };

       const isWinnerA = winner === fighterA;
       const barColorClass = isWinnerA ? "bg-fighter-blue" : "bg-fighter-red";
       const glowColorClass = isWinnerA ? "shadow-[0_0_10px_rgba(59,130,246,0.4)]" : "shadow-[0_0_10px_rgba(239,68,68,0.4)]";

       const totalVotes = votesA + votesB;
       const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
       const pctB = totalVotes > 0 ? 100 - pctA : 50;
       const communityWinner = pctA > pctB ? fighterA : pctA < pctB ? fighterB : "Izjednačeno";

       const methodLower = method.toLowerCase();
       let methodColorClass = "bg-white/5 border-white/10 text-slate-300";
       let methodLabel = "METODA";
       if (methodLower.includes("ko") || methodLower.includes("tko") || methodLower.includes("nokaut")) {
         methodColorClass = "bg-red-500/10 border-red-500/20 text-red-400";
         methodLabel = "KO/TKO";
       } else if (methodLower.includes("sub") || methodLower.includes("gušenje") || methodLower.includes("poluga") || methodLower.includes("prisila")) {
         methodColorClass = "bg-blue-500/10 border-blue-500/20 text-blue-400";
         methodLabel = "PREDAJA";
       } else if (methodLower.includes("dec") || methodLower.includes("odluka") || methodLower.includes("bodov")) {
         methodColorClass = "bg-amber-500/10 border-amber-500/20 text-amber-400";
         methodLabel = "ODLUKA";
       }

       const showVoting = predictionId && postId && !resolvedAt;
     ```
  3. Update rendering layout in `PredictionWidget.tsx`:
     Replace the Matchup display block (lines 92-120 in the original file) to support interactive voting buttons:
     ```typescript
             <div className="grid grid-cols-12 gap-0 bezel-outer max-w-2xl mx-auto overflow-hidden">
               {/* Fighter A - Blue corner */}
               {showVoting && !hasVoted ? (
                 <button
                   onClick={() => handleVote("A")}
                   disabled={isVoting}
                   className="col-span-5 bg-fighter-blue/10 hover:bg-fighter-blue/20 p-4 text-left border-r border-white/5 flex flex-col justify-center min-h-[80px] group/btn cursor-pointer transition-premium relative overflow-hidden"
                 >
                   <span className="font-display font-bold italic text-base sm:text-2xl text-white uppercase tracking-tight leading-none truncate block group-hover/btn:text-blue-400">{fighterA}</span>
                   <span className="text-[9px] text-fighter-blue/80 font-mono font-bold uppercase tracking-widest mt-1.5 block">Kut glasaj &uarr;</span>
                 </button>
               ) : (
                 <div className="col-span-5 bg-fighter-blue/15 p-4 text-left border-r border-white/5 flex flex-col justify-center min-h-[80px]">
                   <span className="font-display font-bold italic text-base sm:text-2xl text-white uppercase tracking-tight leading-none truncate block">{fighterA}</span>
                   <span className="text-[9px] text-fighter-blue/80 font-mono font-bold uppercase tracking-widest mt-1.5 block">Plavi kut</span>
                 </div>
               )}
               
               {/* VS Divider */}
               <div className="col-span-2 flex items-center justify-center font-display font-black text-sm sm:text-lg text-primary bg-background border-r border-white/5 py-4 shrink-0 italic select-none">
                 VS
               </div>
               
               {/* Fighter B - Red corner */}
               {showVoting && !hasVoted ? (
                 <button
                   onClick={() => handleVote("B")}
                   disabled={isVoting}
                   className="col-span-5 bg-fighter-red/10 hover:bg-fighter-red/20 p-4 text-right flex flex-col justify-center min-h-[80px] group/btn cursor-pointer transition-premium relative overflow-hidden"
                 >
                   <span className="font-display font-bold italic text-base sm:text-2xl text-white uppercase tracking-tight leading-none truncate block group-hover/btn:text-red-400">{fighterB}</span>
                   <span className="text-[9px] text-fighter-red/80 font-mono font-bold uppercase tracking-widest mt-1.5 block">Kut glasaj &uarr;</span>
                 </button>
               ) : (
                 <div className="col-span-5 bg-fighter-red/15 p-4 text-right flex flex-col justify-center min-h-[80px]">
                   <span className="font-display font-bold italic text-base sm:text-2xl text-white uppercase tracking-tight leading-none truncate block">{fighterB}</span>
                   <span className="text-[9px] text-fighter-red/80 font-mono font-bold uppercase tracking-widest mt-1.5 block">Crveni kut</span>
                 </div>
               )}
             </div>
     ```
  4. Render the Community votes Split-bar:
     Insert the Community vote split results display inside the JSX immediately below the predictions row (after the closing `</div>` of the winner/method grid cards, around line 134 in the original file):
     ```typescript
             {/* Community split poll results */}
             {predictionId && (
               <div className="mb-6 bg-black/50 border border-white/10 p-4 rounded-none space-y-3">
                 <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                   <span className="flex items-center gap-1.5">
                     ⚡ Glas Naroda (Javno mišljenje)
                   </span>
                   <span className="font-mono font-bold text-white">
                     {hasVoted ? `${pctA}% vs ${pctB}%` : "Aktivno glasanje"}
                   </span>
                 </div>
                 
                 {hasVoted ? (
                   <div className="space-y-3">
                     <div className="relative w-full h-5 bg-slate-950 border border-white/10 overflow-hidden flex">
                       {pctA > 0 && (
                         <div className="h-full bg-fighter-blue flex items-center pl-3 text-white font-mono text-[9px] font-black shrink-0" style={{ width: `${pctA}%` }}>
                           {pctA}%
                         </div>
                       )}
                       {pctB > 0 && (
                         <div className="h-full bg-fighter-red flex items-center justify-end pr-3 text-white font-mono text-[9px] font-black ml-auto shrink-0" style={{ width: `${pctB}%` }}>
                           {pctB}%
                         </div>
                       )}
                     </div>
                     <p className="text-[10px] text-slate-400 font-bold leading-normal">
                       Čitatelji predviđaju pobjedu borca <span className={pctA > pctB ? "text-fighter-blue" : pctB > pctA ? "text-fighter-red" : "text-white"}>{communityWinner}</span> (Ukupno glasova: <span className="font-mono text-white">{totalVotes}</span>).
                       {resolvedAt ? "" : ` Portal prognozira pobjedu borca ${winner}.`}
                     </p>
                   </div>
                 ) : (
                   <p className="text-[10px] text-slate-400 font-bold italic">
                     Kliknite na plavi ili crveni kut iznad kako biste dali svoj glas i vidjeli rezultate ostalih čitatelja.
                   </p>
                 )}
               </div>
             )}
     ```

- [ ] **Step 2: Modify clanak/[slug]/page.tsx**
  Modify [page.tsx](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/src/app/clanak/[slug]/page.tsx):
  Pass the new voting parameters to the `PredictionWidget` component render call:
  Around lines 380-394, update the `<PredictionWidget ... />` component invocation:
  ```typescript
            {article.type === "PREDICTION" && article.prediction && (
              <ScrollAnimationWrapper>
                <PredictionWidget
                  predictionId={article.prediction.id}
                  postId={article.id}
                  initialVotesA={article.prediction.votesFighterA}
                  initialVotesB={article.prediction.votesFighterB}
                  fighterA={article.prediction.fighterA}
                  fighterB={article.prediction.fighterB}
                  winner={article.prediction.winner}
                  method={article.prediction.method}
                  predictedRound={article.prediction.predictedRound}
                  confidenceScore={article.prediction.confidenceScore}
                  keyReasoning={article.prediction.keyReasoning}
                  actualWinner={article.prediction.actualWinner}
                  actualMethod={article.prediction.actualMethod}
                  actualRound={article.prediction.actualRound}
                  isCorrect={article.prediction.isCorrect}
                  resolvedAt={article.prediction.resolvedAt}
                />
              </ScrollAnimationWrapper>
            )}
  ```

- [ ] **Step 3: Run linters and tests to verify correctness**
  Run: `pnpm lint`
  Expected: Clean run, zero errors.
  Run: `pnpm test`
  Expected: All tests pass.
  Run: `pnpm build`
  Expected: Compilation passes.

- [ ] **Step 4: Commit changes**
  Run:
  ```bash
  git add src/components/prediction/PredictionWidget.tsx src/app/clanak/\[slug\]/page.tsx; git commit -m "feat: upgrade PredictionWidget to support dynamic voting inside articles"
  ```
