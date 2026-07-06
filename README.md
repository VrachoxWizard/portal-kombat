# CombatPortal HR

Hrvatski portal za borilačke sportove (MMA, boks, kickboks) s blogom, predikcijama, profilima boraca i ugrađenim CMS-om.

## Tech stack

- **Next.js 16** (App Router) + React 19
- **PostgreSQL** + Prisma 7
- **Tailwind CSS v4**
- Hrvatski jezik (`lang="hr"`), bez i18n biblioteke

## Lokalni razvoj

### Preduvjeti

- Node.js 20+
- pnpm
- PostgreSQL baza (lokalno ili Neon)

### Postavljanje

```bash
pnpm install
cp .env.example .env   # postavite DATABASE_URL i ostale varijable
pnpm prisma generate
pnpm prisma db push    # ili: pnpm prisma migrate deploy
pnpm prisma db seed
pnpm dev
```

Aplikacija: [http://localhost:3000](http://localhost:3000)  
CMS: [http://localhost:3000/cms/login](http://localhost:3000/cms/login)

### Okolišne varijable

| Varijabla | Opis |
|-----------|------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SYNC_SECRET` | Opcionalno — zaštita `/api/sync` |
| `PREVIEW_SECRET` | Tajna za potpisane URL-ove pregleda nacrta |
| `RESEND_API_KEY` | Za slanje kontakt forme e-poštom |
| `CONTACT_EMAIL` | Primatelj kontakt poruka (default: info@combatportal.hr) |
| `NEXT_PUBLIC_SITE_URL` | Javni URL (default: https://combatportal.hr) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics domena (opcionalno) |
| `USE_MOCK_DATA` | `true` za mock podatke u produkciji (ne preporučuje se) |

## CMS uloge

- **ADMIN** — može objavljivati, brisati članke/događaje/pretplatnike
- **EDITOR** — može kreirati i uređivati skice; objavljivanje zahtijeva ADMIN

## Ključne rute

| Javno | CMS |
|-------|-----|
| `/` Naslovnica | `/cms` Dashboard |
| `/novosti` | `/cms/clanci` |
| `/blog` | `/cms/dogadaji` |
| `/predikcije` | `/cms/pretplatnici` |
| `/borci` | |
| `/clanak/[slug]` | |
| `/feed.xml` RSS | |

## UFC sync

Pozovite `GET /api/sync` s headerom `Authorization: Bearer $SYNC_SECRET` ili oslonite se na automatski sync s naslovnice (max jednom na sat).

## Testovi

```bash
pnpm test
```

## Produkcija

```bash
pnpm build
pnpm start
```

Preporučeno: Vercel + Neon PostgreSQL. Postavite sve env varijable u produkcijskom okruženju.
