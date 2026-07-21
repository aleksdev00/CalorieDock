# CalorieDock Developer Handbook

## Purpose

This handbook defines the working principles, development workflow, and engineering standards used in CalorieDock.

The purpose is to ensure that every contributor understands:

- How the project is structured

- How features are developed

- How decisions are made

- Which rules must be followed

CalorieDock is developed as a professional SaaS product, not as a temporary prototype.


# Development Principles

## Documentation First

Before implementation begins:

1. Problem must be understood

2. Feature requirements must be documented

3. Technical decisions must be defined

4. Development plan must exist

Code should represent documented decisions.


## Quality Over Speed

Fast development is valuable only when it does not create future problems.

Avoid:

- Quick fixes without documentation

- Duplicate logic

- Unnecessary complexity

- Ignoring security rules


## Simple Now, Scalable Later

CalorieDock should not be over-engineered.

The goal:

- Build simple solutions today

- Keep the architecture ready for future growth


# Project Structure

Main organization:

```
`CalorieDock`


`├── app/`

`├── components/`

`├── features/`

`├── lib/`

`├── services/`

`├── hooks/`

`├── types/`

`├── utils/`

`├── docs/`

`└── tests/`
```


# Feature-Based Development

Features are the main development units.

Every feature must have:

- Documentation

- UI requirements

- Database impact

- Business logic

- Testing plan

- Completion criteria

Example:

```
`features/`


`├── authentication/`

`├── profile/`

`├── meals/`

`└── dashboard/`
```


# Development Workflow

Standard workflow:

```
`Feature Idea`


`↓`


`Feature Documentation`


`↓`


`Architecture Review`


`↓`


`UI Planning`


`↓`


`Development`


`↓`


`Testing`


`↓`


`Code Review`


`↓`


`Release`
```

No feature skips documentation.


# Git Workflow

## Branch Strategy

Recommended structure:

```
`main`


`↓`


`production`

`develop`


`↓`


`integration`
```

Feature branches:

```
`feature/authentication`

`feature/dashboard`

`feature/meal-tracking`
```


# Commit Standards

Commits should describe the change.

Good examples:

```
`Add authentication login form`


`Fix calorie calculation bug`


`Update meal database schema`
```

Avoid:

```
`changes`


`fix`


`update stuff`
```


# Code Review Rules

Every significant change should be reviewed.

Review checks:

## Architecture

- Does it follow existing patterns?

- Is the solution scalable?


## Code Quality

- Is code readable?

- Is unnecessary complexity avoided?


## Security

- Are user permissions respected?

- Is sensitive data protected?


## Performance

- Are queries optimized?

- Are unnecessary renders avoided?


# Frontend Rules

## Components

Components should:

- Have clear responsibility

- Be reusable when appropriate

- Avoid unnecessary complexity


## State Management

Use:

- React state for local state

- TanStack Query for server state

Avoid:

- Duplicating server data

- Unnecessary global state


## Forms

All forms should use:

- React Hook Form

- Zod validation

Requirements:

- Client validation

- Server validation

- Clear error messages


# Backend Rules

## Supabase Usage

All database access must respect:

- Row Level Security

- Proper authorization

- Database structure


## Database Changes

Never directly edit production data.

Required:

```
`Migration`


`↓`


`Testing`


`↓`


`Review`


`↓`


`Deployment`
```


# Security Rules

Security is a requirement, not an improvement.

Every implementation must consider:

- Authentication

- Authorization

- Data privacy

- Input validation

- API protection


# UI/UX Rules

Every interface should provide:

- Clear purpose

- Consistent design

- Responsive behavior

- Loading states

- Empty states

- Error handling


# Naming Conventions

## Files

Use:

```
`kebab-case`
```

Example:

```
`user-profile.tsx`

`meal-card.tsx`
```


## Components

Use:

```
`PascalCase`
```

Example:

```
`MealCard`


`UserProfile`
```


## Functions

Use:

```
`camelCase`
```

Example:

```
`calculateCalories()`


`fetchUserProfile()`
```


# Error Handling

Errors must be:

- Expected

- Logged appropriately

- Presented clearly to users

Never:

- Hide errors silently

- Show technical errors to users


# AI Development Rules

AI is treated as a development assistant.

AI can:

- Generate code

- Suggest solutions

- Explain problems

- Review implementation

AI cannot:

- Change architecture without approval

- Ignore documentation

- Create undocumented features


# AI Implementation Process

Required workflow:

```
`Read Context`


`↓`


`Understand Feature Documentation`


`↓`


`Plan Solution`


`↓`


`Generate Implementation`


`↓`


`Run Tests`


`↓`


`Review Code`


`↓`


`Update Documentation`
```


# Documentation Maintenance

Documentation must stay synchronized with development.

Update documentation when:

- Architecture changes

- Database changes

- New features are added

- Development rules change


# Decision Making

Technical decisions should be recorded.

Important decisions include:

- Why technology was chosen

- Why approach changed

- What alternatives were considered


# Professional Standards

Every contributor should aim for:

- Clean code

- Clear communication

- Consistent architecture

- Long-term maintainability


# Before Starting Any Task

Checklist:

☐ Read relevant documentation

☐ Understand existing architecture

☐ Check feature dependencies

☐ Confirm expected behavior

☐ Plan implementation


# Before Completing Any Task

Checklist:

☐ Code works

☐ Tests pass

☐ Security reviewed

☐ Documentation updated

☐ Changes committed properly


# Current Handbook Status

## Completed

✅ Development principles

✅ Workflow rules

✅ Coding expectations

✅ AI collaboration rules

✅ Review process

## Future Updates

This handbook should evolve together with CalorieDock.


# Summary

The Developer Handbook defines how CalorieDock is built.

It ensures that growth does not create technical chaos and that every future contribution follows the same professional standards.

