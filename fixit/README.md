# Fixit — Community-Driven Civic Tech Platform

Report broken or poorly maintained infrastructure directly to local authorities and track resolution progress.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS 3, Lucide React |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |

## Project Structure

```
fixit/
├── frontend/                  # Next.js application (mobile-first)
│   ├── app/
│   │   ├── layout.tsx         # Root layout & metadata
│   │   ├── page.tsx           # Home dashboard (splash → action cards)
│   │   ├── report/page.tsx    # Issue submission form
│   │   ├── track/page.tsx     # List of user reports
│   │   └── track/[id]/page.tsx# Single report detail & timeline
│   ├── components/
│   │   ├── SplashScreen.tsx   # White splash with pin+wrench icon
│   │   ├── ActionCard.tsx     # Colored dashboard card
│   │   ├── BottomNav.tsx      # Home / Explore / Profile nav bar
│   │   ├── StatusTimeline.tsx # Vertical stepper (Reported→In Progress→Resolved)
│   │   └── ReportCard.tsx     # Summary card for report list
│   ├── tailwind.config.ts
│   └── package.json
├── backend/                   # Express REST API
│   ├── src/
│   │   ├── index.ts           # Server entry point
│   │   ├── routes/reports.ts  # Report CRUD routes
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Escalation engine
│   │   └── middleware/        # Error handling
│   ├── prisma/schema.prisma   # Database schema
│   └── package.json
└── README.md
```

## WSL / Linux Setup

### Prerequisites

- Node.js 18+ (via nvm or direct install)
- PostgreSQL 14+
- npm 9+

### 1. Clone & Install Dependencies

```bash
# From your WSL terminal
cd ~

# Frontend
cd fixit/frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Database Setup

```bash
# Start PostgreSQL (WSL)
sudo service postgresql start

# Create database
sudo -u postgres createdb fixit

# Copy env file and edit credentials
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Run Prisma migration
npx prisma migrate dev --name init
```

### 3. Run the Application

```bash
# Terminal 1 — Backend (from fixit/backend)
npm run dev
# → http://localhost:4000

# Terminal 2 — Frontend (from fixit/frontend)
npm run dev
# → http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/reports` | List all reports |
| GET | `/api/reports/:id` | Get single report |
| POST | `/api/reports` | Create a report |
| PATCH | `/api/reports/:id/status` | Update report status |
| POST | `/api/reports/:id/vote` | Upvote a report |

## Escalation Logic

The escalation engine (`backend/src/services/escalationEngine.ts`) runs automatically:

1. **Rejected reports** → immediately escalated (`isEscalated: true`)
2. **Stalled reports** → escalated after 7 days in `REPORTED` state

Escalated reports are flagged and surfaced to higher-tier authorities on the public dashboard.

## Screens

1. **Splash** — White background, blue pin+wrench icon, "Fixit" branding
2. **Home Dashboard** — "Report an Issue" heading + 4 colored action cards + bottom nav
3. **Submission Form** — Location (GPS default), photo upload, category dropdown, description, Submit button
4. **Tracking Detail** — Image, metadata, vertical status timeline, Track action button
