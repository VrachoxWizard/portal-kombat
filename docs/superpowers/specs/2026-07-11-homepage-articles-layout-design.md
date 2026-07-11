# Design Spec - Seeding New Articles to Complete Homepage Bento Grid

**Author:** Antigravity  
**Date:** 2026-07-11  

---

## 1. Goal

The portal's homepage articles section utilizes a 3-column bento layout grid. Currently, the real data seed file (`prisma/seed-real-data.ts`) only inserts 3 articles. Since the first article acts as the big top hero article, only 2 articles remain in the grid, leaving a blank spot (the third column) empty.

This design spec details adding 4 new highly relevant combat sports articles and their supporting events, categories, and fighters to [seed-real-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed-real-data.ts). This brings the total database count to 7 articles (1 Hero + 6 grid articles), which fills exactly two complete rows in the homepage grid and eliminates any empty space or layout gaps.

---

## 2. Proposed Changes

We will modify [seed-real-data.ts](file:///c:/Users/user1/OneDrive/Desktop/cupe-combat-blog/prisma/seed-real-data.ts) to:

### A. Create Additional Categories and Tags
Ensure that the "Boks" category and relevant tags are created in the database to associate with the new articles.
- Find or create `boksCat` (name: `"Boks"`, slug: `"boks"`)
- Find or create tags: `tagUfc` (`"UFC"`), `tagBoks` (`"Boks"`), `tagFnc` (`"FNC"`)

### B. Seed 5 New Fighters
Create realistic fighter profiles to link to the new events and predictions:
- **Anthony Joshua** (weightClass: `"Teška (Heavyweight)"`, record: `"28-3-0"`)
- **Kristian Prenga** (weightClass: `"Teška (Heavyweight)"`, record: `"15-1-0"`)
- **Filip Hrgović** (weightClass: `"Teška (Heavyweight)"`, record: `"17-1-0"`)
- **Moses Itauma** (weightClass: `"Teška (Heavyweight)"`, record: `"9-0-0"`)
- **Ivan Vitasović** (weightClass: `"Teška (Heavyweight)"`, record: `"13-6-1"`)

### C. Seed 3 New Events
- **Anthony Joshua vs. Kristian Prenga** (Event: `"Boks: Riyadh Season"`, Date: `"25. srpnja 2026."`)
- **Filip Hrgović vs. Moses Itauma** (Event: `"Boks: London"`, Date: `"29. kolovoza 2026."`)
- **Ivan Vitasović vs. TBA** (Event: `"FNC 33: Zagreb"`, Date: `"12. rujna 2026."`)

### D. Seed 4 New Articles (Posts)
1. **News Article 1: Filip Hrgović vs. Moses Itauma**
   - Title: `"Filip Hrgović se vraća u ring protiv mlade nade Mosesa Itaume u Londonu"`
   - Slug: `"filip-hrgovic-vs-moses-itauma-london"`
   - Excerpt: `"Hrvatski teškaš Filip Hrgović dogovorio je povratnički meč protiv izuzetno opasnog britanskog prospekta Mosesa Itaume krajem kolovoza u Londonu."`
   - Category: `boksCat`
   - Published: `new Date(Date.now() - 2 * 3600 * 1000)` (2 hours ago)
2. **News Article 2: Anthony Joshua vs. Kristian Prenga**
   - Title: `"Spektakl u Rijadu: Anthony Joshua protiv Kristiana Prenge predvodi ljetni mega-card"`
   - Slug: `"anthony-joshua-vs-kristian-prenga-rijad"`
   - Excerpt: `"Bivši svjetski prvak Anthony Joshua ukrstit će rukavice s albanskim teškašem Kristianom Prengom na spektakularnoj priredbi u Saudijskoj Arabiji."`
   - Category: `boksCat`
   - Published: `new Date(Date.now() - 3 * 3600 * 1000)` (3 hours ago)
3. **News Article 3: Ivan Vitasović Title Defense**
   - Title: `"FNC 33 stiže u Zagreb: Ivan Vitasović brani pojas u Areni protiv novog izazivača"`
   - Slug: `"fnc-33-zagreb-ivan-vitasovic-brani-naslov"`
   - Excerpt: `"Hrvatski teškaš i zvijezda domaćeg MMA-a Ivan Vitasović branit će svoj FNC pojas u zagrebačkoj Areni pred domaćom publikom ovog rujna."`
   - Category: `mmaCat`
   - Published: `new Date(Date.now() - 4 * 3600 * 1000)` (4 hours ago)
4. **Prediction Article & Model Entry: McGregor vs. Holloway 2**
   - Title: `"Predikcija: Conor McGregor vs. Max Holloway 2 - Tko slavi u megaborbi?"`
   - Slug: `"predikcija-conor-mcgregor-vs-max-holloway-2"`
   - Excerpt: `"Detaljna tehnička i taktička analiza povijesnog revanša između Conora McGregora i Maxa Hollowaya na UFC-u 329."`
   - Category: `mmaCat`
   - Published: `new Date(Date.now() - 6 * 3600 * 1000)` (6 hours ago)
   - Prediction Relations:
     - fighterAId: `mcgregr.id`
     - fighterBId: `holloway.id`
     - winner: `"Max Holloway"`
     - method: `"Jednoglasna odluka sudaca (UD)"`
     - predictedRound: `"5. runda"`
     - confidenceScore: `70`
     - keyReasoning: `"McGregorov dugi izostanak i Hollowayev nevjerojatan volumen i izdržljivost presudit će u kasnijim rundama. Holloway će nadvladati ranu agresiju i uzeti pobjedu jednoglasnom odlukom."`

---

## 3. Verification Plan

1. **Database Seed Success:**
   Run `npx tsx prisma/seed-real-data.ts` and verify it runs without errors and inserts the database objects.
2. **Homepage Layout Check:**
   Run the dev server (`pnpm dev`), open the homepage, and verify:
   - There are a total of 7 articles (1 Hero, 6 Grid cards).
   - The grid has exactly 2 rows of 3 articles, with no empty spots or layout gaps.
   - The filters (MMA, Boks) show the correct number of items.
   - The links to all pages work properly.
