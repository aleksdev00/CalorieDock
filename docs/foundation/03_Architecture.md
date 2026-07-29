# CalorieDock Architecture


# Overview

CalorieDock is a cloud-native, API-first SaaS platform built for long-term scalability, modular growth, and AI readiness.

The architecture is designed to support:

- Millions of users

- Real-time tracking

- High read/write workloads

- Mobile clients (future)

- AI-driven features (future)


# Architectural Style

## Type

- Modular Monolith (initial phase)

- Event-driven ready (future evolution)

- API-first architecture

We avoid microservices early to reduce complexity, but design boundaries so they can be extracted later.


# Core Layers

## 1. Presentation Layer (Frontend)

- Next.js (App Router)

- React Server Components

- Client Components only when necessary

Responsibilities:

- UI rendering

- Input validation (basic)

- State handling (UI-level)


## 2. Application Layer (Next.js Services and Server Actions)

- Business logic lives here

- Next.js Server Actions for authenticated mutations

- Next.js services for business logic and database access

- Route Handlers only for HTTP and external-integration surfaces

Responsibilities:

- Meal processing

- Nutrition calculations

- Aggregations

- External API communication


## 3. Data Layer (PostgreSQL)

- Central source of truth

- Fully relational schema

- Strict RLS policies


## 4. Integration Layer

- Open Food Facts API

- Future: AI APIs

- Future: Wearables (Apple Health / Google Fit)


# System Architecture Diagram

```
Next.js Frontend  
        ↓  
Supabase Client Layer  
        ↓  
------------------------------------------------  
| Auth | Database | Storage | RLS              |  
------------------------------------------------  
        ↓  
   PostgreSQL Database
```


# Domain Architecture

System is split into bounded contexts:

## Core Domains

- Authentication

- User Profile

- Nutrition

- Food Database

- Meal Tracking

- Progress Tracking

- Water Tracking

- Weight Tracking

- Analytics

- Notifications

- Admin

Each domain:

- has its own data model

- has isolated logic

- can evolve independently


# Frontend Architecture

## App Router Structure

- Server Components default

- Client Components minimal


## Data Strategy

- Server state → TanStack Query

- UI state → React state

- Forms → React Hook Form

- Validation → Zod

No Redux or global state library.


# Backend Architecture (Supabase)

## Components

### Auth

- Email/password authentication

- JWT sessions


### Database

- PostgreSQL

- Fully normalized schema

- Indexed time-series tables

- Strict RLS


### Storage

Used for:

- Images

- Avatars

- Food photos (future)


### MVP Backend Boundary

- Next.js services and Server Actions own validation, business logic, and authenticated mutations.

- Supabase owns authentication, PostgreSQL, migrations, and RLS enforcement.

- Edge Functions and PostgreSQL RPC functions are not part of the MVP.


# Data Flow Example (Meal Logging)

1. User submits meal

2. Frontend validates (Zod)

3. Next.js Server Action validates and writes meals + item nutrition snapshots through Supabase

4. Dashboard/Daily Summary reads and aggregates source tables

5. UI refreshes via query invalidation


# Performance Strategy

- SSR for SEO pages

- Cached API responses

- Indexed queries

- Indexed source-table aggregation for MVP

- Minimal payload responses


# Security Architecture

- Row Level Security (RLS) everywhere

- User-scoped data isolation

- No direct cross-user queries

- JWT-based authentication

- No sensitive logic in frontend


# Scalability Strategy

Phase 1:

- Monolith (Supabase + Next.js)

Phase 2:

- Consider Edge Functions or RPC only for documented needs

- Event-driven analytics

Phase 3:

- AI service layer

- Recommendation engine


# AI Readiness

Architecture is prepared for:

- Nutrition recommendations

- Meal suggestions

- Automated logging

- Personal coaching


# Summary

CalorieDock is designed to evolve without refactoring core systems.

The architecture prioritizes:

- simplicity now

- scalability later

- clarity always

