# BazaarSaar — बाज़ारसार

Trade journal, broker sync, and weekly analytics for swing traders, long-term investors, and options traders in the Indian stock market.

## What’s in this repo

- Next.js App Router web app (Next.js 16, React 19, TypeScript)
- Supabase Auth + Postgres (via `@supabase/ssr`)
- Protected routes via middleware (`/dashboard`, `/trades`, `/playbooks`, `/datalab`, `/review`, `/settings`, `/onboarding/guide`)
- Optional Zerodha Kite Connect integration (feature-flagged)
- Cron route handlers (protected by `CRON_SECRET`)

## Project structure (high level)

```
src/
	app/                  Next.js routes (UI + route handlers under app/api)
	components/           UI + feature components (dashboard, onboarding, trades, settings)
	lib/                  Auth, Supabase clients, feature flags, utilities
	types/                Shared TypeScript types
supabase/
	migrations/           Database migrations
public/                 Static assets (PWA manifest, robots, service worker)
```

Key files:

- `src/middleware.ts` — auth gating + redirects
- `src/lib/supabase/*` — browser/server/admin Supabase clients
- `src/lib/featureFlags.ts` — runtime feature flags

## Prerequisites

- Node.js 18+ (LTS preferred)
- A Supabase project (URL + anon key; service role key for admin/server operations)
- (Optional) Supabase CLI if you want to push migrations from this repo

## Quick start (local)

```bash
npm install

# Create a local env file (Next.js loads .env.local by default)
# macOS/Linux:
cp .env.example .env.local

# Windows (PowerShell):
# Copy-Item .env.example .env.local

# Fill in at least NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

npm run dev
```

App runs at `http://localhost:3000`.

## Environment variables

This repo includes `.env.example`. The important variables are:

### Required (most flows)

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (public)
- `NEXT_PUBLIC_APP_URL` — canonical app URL (used for OAuth redirect + metadata)

### Recommended

- `NEXT_PUBLIC_ADMIN_EMAILS` — comma-separated list of admin emails

### Feature flags

All flags are optional; they default to sensible values in code.

- `NEXT_PUBLIC_APP_MODE` — `beta` or `full`
- `NEXT_PUBLIC_BETA_MODE` — `true`/`false`
- `NEXT_PUBLIC_FEATURE_*` — toggles parts of the UI (see `.env.example`)

### Zerodha (optional)

Used by API routes under `src/app/api/broker/*`.

- `ZERODHA_API_KEY`
- `ZERODHA_API_SECRET`
- `ZERODHA_TOKEN_ENCRYPTION_KEY` — 64-char hex key (AES-256) for encrypting tokens at rest

### Cron (optional)

Cron endpoints under `src/app/api/cron/*` require an auth header:

- `CRON_SECRET`

Send requests with `Authorization: Bearer <CRON_SECRET>`.

### Server-only (keep secret)

- `SUPABASE_SERVICE_ROLE_KEY` — required for admin/server operations; never expose to the client

## Database migrations (Supabase)

This repo includes SQL migrations in `supabase/migrations/`.

If you have Supabase CLI set up:

```bash
npm run db:migrate
```

That runs `npx supabase db push`.

## Scripts

- `npm run dev` — start dev server
- `npm run dev:https` — start dev server with experimental HTTPS
- `npm run build` — production build
- `npm run start` — run production server
- `npm run lint` — ESLint
- `npm run db:migrate` — push Supabase migrations

## Security notes

- Response security headers + CSP are configured in `next.config.ts`.
- Several API routes enforce “display-only” access checks (see `src/lib/apiSecurity.ts`).

## Roadmap alignment (Final Roadmap)

BazaarSaar is being built as a **Trading Workflow OS** (analytics + journaling + research + simulation).

### Non‑negotiables (enforced)

- No signals, no predictions, no recommendations
- No copy trading, no auto-trading
- Zerodha-first (read-only) + **CSV import fallback must always work**

**Current enforcement status (repo):**

- UI copy + disclaimers explicitly state “no advice / no recommendations / no signals” (see legal pages + `src/lib/constants.ts`).
- Zerodha tokens are encrypted at rest (`ZERODHA_TOKEN_ENCRYPTION_KEY`) and stored in `broker_connection`.
- CSV import flow exists and is the fallback if broker access changes (`/api/import/csv`).

### Phase checklist (what’s done vs remaining)

This repo already implements a large part of Phases 0–2 and parts of Phase 5.

- Phase 0 (Foundations + Compliance)
	- Done: Next.js + TypeScript app, Supabase Auth + Postgres migrations, DPDP-style export/delete/consent logging, audit events, encrypted broker tokens.
	- Remaining (if strictly following roadmap): FastAPI backend + Redis/worker jobs, and true RBAC (free/pro/premium entitlements).
- Phase 1 (MVP v1: CSV + Core Analytics)
	- Done: CSV import v1, dashboards v1 (equity curve, symbol breakdown, calendar), trades list/detail.
	- Remaining: stronger normalization + faster bulk import, richer filters, metrics engine completeness (profit factor/expectancy/max drawdown as a unified engine).
- Phase 2 (Journal + Playbooks + Weekly Review)
	- Done: Trade journal editor, playbooks + checklist storage, weekly report generation + UI.
	- Remaining: quick tagging UX, screenshots end-to-end, richer playbook performance summaries.
- Phase 3 (Mistake Intelligence v1)
	- Remaining: rule-based insights with evidence links.
- Phase 4 (DataLab Builder + SQL Mode)
	- Remaining: trade-filter builder + safe SELECT-only SQL mode (allowlisted views, LIMIT/timeout, user scoping).
- Phase 5 (Zerodha Integration)
	- Done: auth URL + token exchange + encrypted token storage + read-only sync endpoint.
	- Remaining: incremental sync strategy + background sync jobs + sync health dashboard.
- Phase 6–10
	- Remaining: reconciliation/tax utilities, reports/sharing/paywall polish, simulation engine, hardening/observability/scale.

### Important note: legacy migration

- `supabase/migrations/001_DEPRECATED.sql` is intentionally a **NO-OP** so fresh environments do not create legacy “signals” tables.

## License

Private — all rights reserved.
