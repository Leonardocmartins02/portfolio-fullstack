# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install deps (also runs `prisma generate` via postinstall)
npm run dev           # start dev server (http://localhost:3000)
npm run build         # production build
npm run start         # run production build
npm run lint          # next lint

npm run db:push        # sync prisma/schema.prisma to the Postgres db (Neon)
npm run db:seed        # seed admin user + sample projects (prisma/seed.ts)
npm run db:studio      # open Prisma Studio GUI
```

There is no automated test suite (`scripts/test-email.mjs` is a manual script for exercising the Resend email integration, run with `node scripts/test-email.mjs`, not part of `npm test`).

Env vars live in `.env` (see `.env.example`): `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `RESEND_API_KEY` / `EMAIL_FROM` / `EMAIL_TO` for contact-form email notifications.

## Architecture

Next.js 14 App Router portfolio site with a real backend: public marketing site + an authenticated admin panel for managing displayed projects, backed by Prisma/PostgreSQL (Neon).

- **Public site** (`src/app/page.tsx`) composes the section components in `src/components/` (Header, Hero, About, Projects, Timeline, Skills, Contact, Footer) in order. Static personal content (bio, skills, timeline, links) lives in `src/lib/data.ts` — edit this file to change profile content; **projects are not static**, they come from the database.
- **Auth**: NextAuth v4 with a Credentials provider (`src/lib/auth.ts`), JWT session strategy, single `Admin` table checked via bcrypt. `src/middleware.ts` gates `/admin/dashboard/:path*`, redirecting unauthenticated users to `/admin/login`.
- **Admin panel** (`src/app/admin/dashboard`, `src/components/admin/*`) lets the logged-in admin CRUD projects (`ProjectManager.tsx`) and view submitted contact messages (`MessagesList.tsx`), calling the `/api/projects` routes client-side.
- **API routes** (`src/app/api/*`) are the only way data is mutated:
  - `api/projects` (GET public, POST admin-only) and `api/projects/[id]` (PUT/DELETE admin-only) — validated with Zod schemas defined inline in each route, authorization checked via `getServerSession(authOptions)`.
  - `api/contact` — validates and persists a `ContactMessage`, then best-effort sends an email via `src/lib/mail.ts`; email failure never fails the request (message is always saved; `sent: false` is returned to the client to show an accurate status).
  - `api/auth/[...nextauth]` — NextAuth handler.
- **Data layer**: `src/lib/prisma.ts` exports a singleton `PrismaClient` (guards against multiple instances in Next.js dev hot-reload). Schema (`prisma/schema.prisma`) has three models: `Project`, `ContactMessage`, `Admin`. Database is PostgreSQL (Neon), used for both local dev and production via the same `DATABASE_URL`.
- **Email**: `src/lib/mail.ts` sends via the Resend HTTP API (not SMTP) — Microsoft has disabled basic auth for Outlook/Hotmail SMTP, so a fetch-based HTTP API is used instead of nodemailer. No email deps required. Has a 5s timeout since Vercel Hobby functions are killed around 10s.
- **Styling**: Tailwind CSS v3 + **shadcn/ui** (`src/components/ui/*`, config in `components.json`, `cn()` in `src/lib/utils.ts`). Visual language follows `DESIGN.md` (MongoDB design system from getdesign.md): deep-teal bands (`#001e2b` / `#003d4f` / `#00684a`), MongoDB green `#00ed64` only on primary pill buttons, 12px cards, 44px inputs, DM Sans (free stand-in for Euclid Circular A) + Source Code Pro. Color tokens use shadcn names as **RGB channels** in `src/app/globals.css` and are redefined per section via `.chapter-dark` / `.chapter-raised` / `.chapter-green` (the sticky header copies the tone through `data-tone`). Use shadcn components (Button, Input, Card, Badge…) for any new UI instead of hand-rolled classes; keep `tailwind-merge` on v2 (v3 targets Tailwind v4).
- **Layout grid**: content caps at 1280px; horizontal padding comes from `--frame-x` (`.frame` on full-bleed sections, `.page` on inner pages) so every section shares the same left edge.
- **Motion**: `src/app/template.tsx` fades each route in (opacity only, so the scroll-orchestrator's measurements aren't skewed); section entrances use `[data-reveal]` (`Reveal.tsx`), inner pages use `.rise-in` with `--i`. Route skeletons live in `loading.tsx` files; media uses `MediaFrame` (skeleton until the image/poster loads). Everything respects `prefers-reduced-motion`. Don't put `data-reveal` on an element that also has its own hover transition — wrap it.

## Notes for making changes

- When adding an admin-mutating API route, follow the existing pattern: `getServerSession(authOptions)` check → Zod `safeParse` → Prisma call → `NextResponse.json`.
- Comments in this codebase are written in Portuguese; match that convention when touching `src/lib` and `src/app/api`.
