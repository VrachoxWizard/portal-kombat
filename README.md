# CombatPortal HR

Hrvatski portal za borilačke sportove (MMA, boks, kickboks) s blogom, predikcijama, profilima boraca i ugrađenim CMS-om.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-7.8-2d3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql)

---

## 🏗️ Struktura projekta

```
src/
├── app/                  # Next.js App Router (Rute, Stranice, API)
│   ├── api/              # API rute (sinkronizacija, CMS, pretraga, komentari)
│   ├── borci/            # Javni profili i baza boraca
│   ├── cms/              # CMS administracija i sučelje
│   ├── novosti/          # Domaće i vanjske borilačke novosti
│   ├── predikcije/       # Analize i predikcije borbi
│   └── layout.tsx        # Globalni izgled s 3D ambientom
├── components/           # Reupotrebljive React komponente
│   ├── article/          # Komponente vezane uz članke i komentare
│   ├── cms/              # CMS forme i specifična polja
│   ├── layout/           # Zaglavlje, podnožje, sidebar i ticker
│   └── ui/               # Globalni UI elementi (3D arene, gumbi, badgevi)
└── lib/                  # Biblioteke i pomoćne funkcije
    ├── auth-utils.ts     # Autentifikacija i CMS autorizacija
    ├── prisma.ts         # Prisma klijent baza
    ├── cached-data.ts    # Next.js 16 caching sloj ("use cache")
    └── sync.ts           # Sinkronizacija događaja s UFC kalendarom
```

---

## 🗄️ Baza podataka (Entity Data Model)

Aplikacija koristi PostgreSQL s Prismom. Glavne relacije:
*   **User**: CMS korisnici s ulogama (`ADMIN`, `EDITOR`). Imaju profile i autore su članaka/predikcija.
*   **Post**: Članci koji mogu biti tipa `NEWS`, `BLOG` ili `PREDICTION`. Povezani su s autorom (`User`), kategorijom (`Category`) i tagovima (`Tag`).
*   **Fighter**: Baza boraca s omjerima (npr. "22-6-0") i detaljima.
*   **Event**: UFC i ostali borilački događaji, sinkronizirani iz ICS kalendara. Povezani s dva borca (`Fighter`).
*   **Prediction**: Povezane s postovima tipa `PREDICTION`. Sadrže podatke o borbi, prognoziranom pobjedniku, točnosti prognoze te **interaktivne glasove čitatelja (Glas Naroda)**.

---

## ⚡ Glas Naroda (Sustav Glasanja Čitatelja)

Portal sadrži interaktivni sustav glasanja koji omogućuje posjetiteljima da prognoziraju ishod nadolazećih borbi:
*   **Glasanje na Naslovnici**: Glavni aktivni meč istaknut je u desnom stupcu (Sidebar) unutar widgeta "GLAS NARODA" s brzim gumbima za odabir plavog ili crvenog kuta.
*   **Glasanje unutar Članka**: Svaka aktivna predikcija sadrži gumbe za glasanje izravno unutar detaljne analize borbe.
*   **Usporedba s Portalom**: Nakon glasanja, čitateljima se prikazuje postotni omjer glasova zajednice ("Glas Naroda") nasuprot službene stručne analize portala.
*   **Trajnost**: Odabir se sprema lokalno (`localStorage`) kako bi se spriječilo višestruko glasanje i osigurao trenutni prikaz rezultata pri ponovnom posjetu.

---

## 🔑 CMS Uloge i Pristup

CMS sustavu možete pristupiti na ruti `/cms/login`. Predefinirani lokalni računi:

| Korisnički račun (E-mail) | Lozinka | Uloga | Opis |
| :--- | :--- | :--- | :--- |
| `mvukusic67@gmail.com` | `Passwod2026!` | `ADMIN` | Glavni administrator |
| `marko.horvat@combatportal.hr` | `marko1234` | `ADMIN` | Urednik / MMA analitičar |
| `ivan.kovacevic@combatportal.hr` | `ivan1234` | `EDITOR` | Novinar (kreira skice članaka) |

*   **ADMIN**: Može objavljivati članke, brisati komentare, dodavati pretplatnike i sinkronizirati UFC podatke.
*   **EDITOR**: Može pisati i uređivati skice članaka, ali ne može direktno objavljivati na portal (zahtijeva odobrenje admina).

---

## 🚀 Lokalno postavljanje i pokretanje

1.  **Instalacija paketa**:
    ```bash
    pnpm install
    ```
2.  **Okolišne varijable**:
    Kopirajte `.env.example` u `.env` i podesite vezu na bazu podataka:
    ```bash
    DATABASE_URL="postgresql://user:password@localhost:5432/combatportal?sslmode=disable"
    ```
3.  **Priprema baze**:
    Pokrenite migracije i uvezite standardni seed (korisnike i bazu boraca):
    ```bash
    pnpm prisma db push
    pnpm prisma db seed
    ```
4.  **Uvoz stvarnih podataka iz 2026. godine**:
    ```bash
    pnpm tsx prisma/seed-real-data.ts
    ```
5.  **Pokretanje razvojnog poslužitelja**:
    ```bash
    pnpm dev
    ```
    Otvorite [http://localhost:3000](http://localhost:3000) u pregledniku.
