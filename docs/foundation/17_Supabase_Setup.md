# 17 — Git Workflow

**Project:** CalorieDock  
**Document Type:** Version Control & Development Workflow  
**Status:** Planning  
**Version:** 1.0


# 1. Purpose

This document defines the Git workflow used during CalorieDock development.

The purpose is to establish:

- Consistent development practices.

- Safe code changes.

- Clear project history.

- Easier debugging.

- Professional development habits.

Git is considered the source of truth for:

- Source code.

- Documentation.

- Database migrations.

- Configuration history.


# 2. Git Repository Structure

The repository contains:

```
`caloriedock/`


`├── app/`

`├── components/`

`├── features/`

`├── lib/`

`├── services/`

`├── hooks/`

`├── types/`

`├── supabase/`

`├── docs/`

`├── public/`

`├── tests/`

`├── package.json`

`└── README.md`
```

The repository should contain both:

- Application code.

- Project documentation.


# 3. Branch Strategy

CalorieDock uses a simplified branch workflow.

Branches:

```
`main`


`develop`


`feature/\*`
```


# 4. Main Branch

## Purpose

Production-ready code.

Rules:

- Must always be stable.

- No direct development.

- Only tested code is merged.

Example:

```
`main`
```

represents the current production version.


# 5. Develop Branch

## Purpose

Integration branch for completed features.

Flow:

```
`feature branch`


`↓`


`develop`


`↓`


`testing`


`↓`


`main`
```

The develop branch contains the next planned release.


# 6. Feature Branches

Every feature should have its own branch.

Naming convention:

```
`feature/\<feature-name\>`
```

Examples:

```
`feature/authentication`


`feature/food-database`


`feature/meal-tracking`


`feature/dashboard`
```


# 7. Feature Development Workflow

Standard workflow:

```
`Create Feature Branch`


`↓`


`Implement Feature`


`↓`


`Test`


`↓`


`Review`


`↓`


`Merge Into Develop`


`↓`


`Final Testing`


`↓`


`Merge Into Main`
```


# 8. Commit Convention

Commits should describe the purpose of the change.

Format:

```
`type: short description`
```


# 9. Commit Types

## Feature

New functionality.

Example:

```
`feat: add meal creation flow`
```


## Fix

Bug correction.

Example:

```
`fix: resolve incorrect calorie calculation`
```


## Refactor

Code improvement without changing functionality.

Example:

```
`refactor: simplify food service logic`
```


## Docs

Documentation changes.

Example:

```
`docs: update database architecture`
```


## Test

Testing changes.

Example:

```
`test: add meal tracking tests`
```


## Chore

Maintenance tasks.

Example:

```
`chore: update dependencies`
```


# 10. Commit Rules

Commits should:

- Be small and focused.

- Represent one logical change.

- Avoid unrelated modifications.

Bad:

```
`update everything`
```

Good:

```
`feat: add food search validation`
```


# 11. Pull Request Strategy

Even as a solo developer, changes should be reviewed before merging.

Pull Request checklist:

- Code follows standards.

- Tests pass.

- Documentation updated.

- No security issues introduced.

- Database changes reviewed.


# 12. Documentation Changes

Documentation must be updated together with implementation.

Example:

Adding Meal Tracking:

Required updates:

```
`Feature PRD`


`+`


`Database documentation`


`+`


`API documentation`


`+`


`Implementation notes`
```


# 13. Database Migration Workflow

Database changes must be version controlled.

Workflow:

```
`Create Migration`


`↓`


`Test Locally`


`↓`


`Commit Migration`


`↓`


`Deploy`
```

Never manually modify production database without a migration.


# 14. Release Workflow

Release process:

```
`Develop`


`↓`


`Testing`


`↓`


`Version Tag`


`↓`


`Main Merge`


`↓`


`Production Deployment`
```


# 15. Versioning

CalorieDock follows semantic versioning.

Format:

```
`MAJOR.MINOR.PATCH`
```

Example:

```
`1.0.0`
```

Meaning:

## Major

Breaking changes.

Example:

Database redesign.


## Minor

New features.

Example:

New tracking functionality.


## Patch

Bug fixes.

Example:

UI correction.


# 16. Git Safety Rules

Never commit:

- Environment files.

- API keys.

- Passwords.

- Secrets.

- Production credentials.

Required:

```
`.env.local`


`.gitignore`
```


# 17. Code Review Rules

Before merging:

Check:

## Architecture

- Is the code placed correctly?

- Does it follow project structure?

## Security

- Is authentication handled?

- Are permissions correct?

## Quality

- Is code reusable?

- Is logic duplicated?


# 18. AI-Assisted Development Workflow

When using AI tools:

Before generating code provide:

- Relevant feature document.

- Architecture rules.

- Coding standards.

- Database requirements.

AI-generated code must still pass:

- Review.

- Testing.

- Security checks.

AI is an assistant, not the decision maker.


# 19. Backup Strategy

GitHub repository acts as:

- Source backup.

- Project history.

- Collaboration foundation.

Important milestones should have version tags.


# 20. Git Workflow Summary

The complete workflow:

```
`Idea`


`↓`


`Documentation`


`↓`


`Feature Branch`


`↓`


`Development`


`↓`


`Testing`


`↓`


`Review`


`↓`


`Develop`


`↓`


`Release`


`↓`


`Main`
```


# 21. Status

```
`Branch Strategy        ✅`


`Commit Convention      ✅`


`Release Process        ✅`


`AI Workflow            ✅`


`Implementation         ⏳`
```


# End of Git Workflow

