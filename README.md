# Bazaarsaar — बाज़ारसार

> **The essence of the Indian market, every day.**

Daily intelligence, explainable signals, and portfolio analytics for every type of market participant — swing traders, long-term investors, and options traders.

---

## Architecture

```
bazaarsaar/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (fonts, metadata, PWA)
│   │   ├── page.tsx            # Root redirect
│   │   ├── onboarding/         # Persona selection + setup flow
│   │   └── dashboard/          # Main dashboard (Phase 1)
│   ├── components/
│   │   ├── onboarding/         # Persona selector, watchlist setup, preferences
│   │   ├── ui/                 # Shared UI components
│   │   ├── layout/             # App shell, sidebar, header
│   │   └── dashboard/          # Dashboard-specific components
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client (browser + server)
│   │   ├── store.ts            # Zustand global state
│   │   └── utils.ts            # Formatters, helpers, market time utils
│   ├── types/
│   │   └── index.ts            # All TypeScript types (Personas, Signals, etc.)
│   ├── styles/
│   │   └── globals.css         # Tailwind + custom properties + glass UI
│   └── workers/                # Python data pipeline
│       ├── main.py             # Scheduler (APScheduler)
│       ├── config.py           # Shared config, DB client, constants
│       ├── nse_ingest.py       # NSE/Yahoo data ingestion
│       ├── signal_generator.py # Explainable signal computation
│       └── requirements.txt    # Python dependencies
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Full database schema
├── public/
│   └── manifest.json           # PWA manifest
└── config files                # next.config, tailwind, tsconfig, etc.
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion, Glassmorphism |
| State | Zustand (persisted) |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| Data Pipeline | Python 3.11+, Yahoo Finance, NSE APIs |
| Charts | Recharts |
| Deployment | Vercel (frontend), Railway (workers) |
| PWA | next-pwa |

## Quick Start

### Frontend

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your Supabase credentials

# Run development server
npm run dev
```

### Database

```bash
# Link your Supabase project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
npm run db:migrate
```

### Data Pipeline

```bash
cd src/workers

# Install Python dependencies
pip install -r requirements.txt

# Run full data ingestion
python nse_ingest.py full

# Start the scheduler
python main.py

# With immediate catch-up run
python main.py --run-now
```

## Persona System

Three lenses on the same data engine:

| Persona | Focus | Key Signals |
|---------|-------|-------------|
| ⚡ Swing Trader | Momentum, breakouts, 1-30 days | EMA cross, volume spike, RSI, breakout |
| 🏦 Investor | Fundamentals, compounding, 1+ years | P/E, ROE, promoter changes, 52w proximity |
| 🎯 Options Trader | Greeks, IV, OI analysis | IV rank, PCR, max pain, unusual OI |

## Phase Roadmap

- **Phase 1 (Weeks 1-10):** Daily Intelligence Pack + Persona onboarding
- **Phase 2 (Weeks 11-16):** Cross-broker portfolio analytics
- **Phase 3 (Weeks 17-22):** Explainable screener/signals engine

## License

Private — All rights reserved.
