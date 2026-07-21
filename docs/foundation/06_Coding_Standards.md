# CalorieDock Coding Standards


# Purpose

This document defines strict coding rules for the CalorieDock SaaS platform.

All developers, AI tools, and contributors MUST follow these rules.

No exceptions.


# Core Philosophy

- Consistency over personal preference

- Readability over clever code

- Maintainability over shortcuts

- Predictability over optimization (early phase)

- Type safety everywhere


# Tech Stack Rules

## Frontend

- Next.js (App Router only)

- TypeScript mandatory

- React Server Components by default

- Client Components only when required


## Styling

- Tailwind CSS only

- No inline CSS

- No CSS frameworks besides Tailwind

- shadcn/ui as base component system


## State Management

Allowed:

- TanStack Query → server state

- React state → UI state

- React Hook Form → forms

- Zod → validation

NOT allowed:

- Redux

- Zustand (unless explicitly approved later)

- Custom global state systems


# Folder Structure

Strict structure:

```
/app  
/components  
/features  
/lib  
/hooks  
/services  
/types  
/utils  
/constants  
/styles
```


# Feature-Based Architecture

Each feature MUST be self-contained:

```
/features/meal-tracking  
  /components  
  /hooks  
  /services  
  /types  
  /utils  
  index.ts
```

No cross-feature direct imports unless through public APIs.


# Naming Conventions

## Files

- kebab-case → meal-tracker.ts

- components → PascalCase → MealCard.tsx


## Variables

- camelCase → userCalories

- constants → UPPER\_SNAKE\_CASE


## Types

- PascalCase → UserProfile, MealEntry


# TypeScript Rules

- Strict mode enabled

- No implicit any

- No type assertions without reason

- Interfaces preferred for objects

- Types used for unions and primitives


# API Layer Rules

All API calls MUST go through service layer:

```
/services  
  foodService.ts  
  mealService.ts  
  userService.ts
```

No direct Supabase calls inside components.


# Supabase Rules

- All queries must respect RLS

- Never bypass security rules

- All tables must enforce user\_id ownership

- No client-side privileged logic


# Data Fetching Rules

- TanStack Query for all async data

- No manual fetch inside components

- Always define query keys

Example:

```
useQuery(\{  
  queryKey: \['meals', userId\],  
  queryFn: () =\> mealService.getMeals(userId),  
\});
```


# Component Rules

## Allowed patterns

- Functional components only

- Hooks for logic separation

- Dumb UI components preferred


## Forbidden patterns

- Class components

- Inline heavy logic in JSX

- Large components (\>300 lines)


# Error Handling

Every async operation MUST handle errors:

- try/catch in services

- user-friendly error messages

- no raw error exposure


# Validation Rules

- Zod for all inputs

- No unvalidated external data

- API inputs always validated


# Performance Rules

- Avoid unnecessary re-renders

- Memoization only when needed

- No premature optimization

- Keep bundle size minimal


# Security Rules

- Never expose sensitive keys in frontend

- All auth handled by Supabase

- RLS is mandatory

- No client-side role escalation


# Git Rules

## Branching

- main → production

- dev → integration

- feature/\* → features


## Commits

Format:

```
type(scope): description
```

Examples:

- feat(meals): add meal creation logic

- fix(auth): resolve login bug

- refactor(ui): simplify dashboard layout


# AI Development Rules

When using AI tools (Claude, ChatGPT):

- Always provide feature context

- Never generate unstructured code

- AI must follow this document

- Validate all outputs manually


# Testing Rules

- Unit tests for services

- Component tests for UI

- No untested critical logic

- Edge cases must be considered


# Code Review Rules

Before merge:

- No TypeScript errors

- No lint errors

- Feature fully documented

- No hardcoded values

- RLS respected


# Anti-Patterns (STRICTLY FORBIDDEN)

- Direct Supabase calls in components

- Global state misuse

- Duplicate business logic

- Hardcoded user logic

- Ignoring validation layer

- Mixing UI and business logic


# Architecture Compliance

Every feature MUST:

- follow feature-based structure

- use service layer

- use typed models

- respect RLS

- use query layer


# Definition of Done

A feature is complete only when:

- UI implemented

- Service layer implemented

- Validation added

- RLS respected

- Tested

- Documented (if needed)


# Final Rule

If something is not explicitly allowed in this document:

> It is NOT allowed by default.

