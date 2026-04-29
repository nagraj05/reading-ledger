<div align="center">

```
██████╗ ███████╗ █████╗ ██████╗ ██╗███╗   ██╗ ██████╗
██╔══██╗██╔════╝██╔══██╗██╔══██╗██║████╗  ██║██╔════╝
██████╔╝█████╗  ███████║██║  ██║██║██╔██╗ ██║██║  ███╗
██╔══██╗██╔══╝  ██╔══██║██║  ██║██║██║╚██╗██║██║   ██║
██║  ██║███████╗██║  ██║██████╔╝██║██║ ╚████║╚██████╔╝
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝

██╗     ███████╗██████╗  ██████╗ ███████╗██████╗
██║     ██╔════╝██╔══██╗██╔════╝ ██╔════╝██╔══██╗
██║     █████╗  ██║  ██║██║  ███╗█████╗  ██████╔╝
██║     ██╔══╝  ██║  ██║██║   ██║██╔══╝  ██╔══██╗
███████╗███████╗██████╔╝╚██████╔╝███████╗██║  ██║
╚══════╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝
```

**An unhurried shelf of authors worth returning to.**  
Track the books you mean to finish, *eventually*.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-Postgres-00E5BF?style=flat-square&logo=postgresql&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## ✦ What is Reading Ledger?

Reading Ledger is a minimal personal reading tracker built around authors, not individual books. Pick the writers you love, browse everything they've published, and check off what you've read. No social feeds, no ratings, no noise — just your shelf.

---

## ✦ Features

| | |
|---|---|
| 🔐 **Auth out of the box** | Sign up and sign in with Clerk — email, Google, or social |
| 🧭 **Smart onboarding** | Search and select your favourite authors on first login |
| 📚 **Author-first tracking** | Every author gets a card showing their full catalogue |
| ✅ **Read / unread toggles** | Mark books as read per author with a single click |
| 📊 **Live KPI ring** | See your reading progress at a glance on the dashboard |
| 🎨 **Full theme control** | Switch accents, font pairings, and density — all persisted locally |
| ⚡ **Edge-fast data** | Neon serverless Postgres + Hardcover API for book metadata |

---

## ✦ Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 App Router |
| Language | TypeScript |
| Auth | Clerk |
| Database | Neon (serverless Postgres) |
| Book Data | Hardcover GraphQL API |
| Styling | Tailwind CSS v4 + CSS variables |
| Fonts | Fraunces, Playfair, EB Garamond, Crimson Text + sans pairs |

---

## ✦ Requirements

- **Node.js v18+** → [nodejs.org](https://nodejs.org/)
- A **Clerk** account → [clerk.com](https://clerk.com)
- A **Neon** database → [neon.tech](https://neon.tech)
- A **Hardcover** API token → [hardcover.app](https://hardcover.app)

---

## ✦ Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/nagraj05/reading-ledger.git
cd reading-ledger

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your keys (see below)

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in.

---

## ✦ Environment Variables

Create a `.env.local` file at the root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/onboarding

# Neon (Postgres)
DATABASE_URL=postgresql://...

# Hardcover
HARDCOVER_API_TOKEN=eyJ...
```

---

## ✦ Project Structure

```
reading-ledger/
├── app/
│   ├── page.tsx              ← Landing page (unauthenticated)
│   ├── onboarding/           ← Author picker on first login
│   ├── dashboard/            ← Main shelf view + per-author pages
│   └── api/
│       ├── authors/search/   ← Hardcover author search
│       ├── books/read/       ← Toggle read status
│       └── onboarding/       ← Save selected authors + mark onboarded
├── components/
│   ├── dashboard/            ← HomePage, AuthorCard, KpiRing, BookRow
│   ├── landing/              ← Hero, MockupPreview
│   ├── onboarding/           ← AuthorPickCard
│   └── ui/                   ← Header, AuthButtons, TweaksPanel, PageLoader
├── lib/
│   ├── db.ts                 ← Neon connection + table helpers
│   ├── hardcover.ts          ← Hardcover GraphQL client
│   └── utils.ts              ← cn() utility
└── middleware.ts             ← Clerk route protection
```

---

## ✦ Theming

The app ships with six accent colours, four font pairings, and two density modes. All preferences are saved to `localStorage` under `rl-tweaks` and applied with no flash on reload.

**Accents:** Terracotta · Oxblood · Forest · Ink · Indigo · Ochre  
**Font pairings:** Fraunces/Inter · Playfair/Karla · Garamond/Work Sans · Crimson/DM Sans  
**Density:** Spacious · Compact

Open the tweaks panel from the header to try them live.

---

## ✦ Database Schema

Tables are auto-created on first authenticated request — no manual migration needed.

```sql
CREATE TABLE users (
  id         TEXT PRIMARY KEY,   -- Clerk userId
  onboarded  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_authors (
  id          SERIAL PRIMARY KEY,
  user_id     TEXT NOT NULL,
  author_id   INTEGER NOT NULL,
  author_name TEXT NOT NULL,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, author_id)
);

CREATE TABLE read_books (
  id         SERIAL PRIMARY KEY,
  user_id    TEXT NOT NULL,
  book_id    INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);
```

---

## ✦ Deployment

Deploys to Vercel in one click. Add all environment variables in the Vercel dashboard before deploying.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

<div align="center">

Made for readers who prefer a slow shelf over a fast feed.

</div>
