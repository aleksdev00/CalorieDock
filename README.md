# CalorieDock

CalorieDock is a full-stack web application for tracking meals, calories, water intake, and body weight through a personal, responsive dashboard.

**Live application:** [calorie-dock.vercel.app](https://calorie-dock.vercel.app)

## Overview

The application is designed around private, user-owned nutrition data. Authentication, PostgreSQL storage, and row-level access controls are provided through Supabase, while the Next.js application is deployed on Vercel.

## Current features

- Account registration, login, email verification, and password recovery
- Personal profile, nutrition targets, and preferences
- Daily calorie and nutrition summaries
- Meal creation and food-item management
- Custom and searchable food records
- Water-intake tracking
- Weight tracking
- Responsive authenticated dashboard
- User-level data isolation with Supabase Row Level Security

CalorieDock is under active development. Features described here reflect the functionality currently represented in the repository.

## Technology stack

- Next.js and React
- TypeScript
- Tailwind CSS
- Supabase Authentication
- PostgreSQL with Row Level Security
- Zod validation
- TanStack Query
- Vercel

## Architecture

The project uses the Next.js App Router and a feature-oriented structure. Business logic is organized into feature services, server actions, validation schemas, components, and shared infrastructure. Database changes are versioned through Supabase migrations.

## Local development

### Requirements

- Node.js
- npm
- A Supabase project, or the Supabase CLI for local development

### Setup

```bash
git clone https://github.com/aleksdev00/CalorieDock.git
cd CalorieDock
npm install
cp .env.example .env.local
npm run dev
```

Configure these values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Never commit production credentials or server-only Supabase keys.

## Quality and security

The project includes input validation, protected application routes, database migrations, ownership-based Row Level Security policies, and documented testing and deployment procedures.

## Project status

Active development. The web application is deployed on Vercel and continues to receive functional and interface improvements.
