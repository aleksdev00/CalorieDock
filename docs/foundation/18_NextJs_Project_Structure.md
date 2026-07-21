# 18 — Next.js Project Structure

**Project:** CalorieDock  
**Document Type:** Frontend Architecture & Code Organization  
**Status:** Planning  
**Version:** 1.0


# 1. Purpose

This document defines the recommended project structure for the CalorieDock Next.js application.

The goal is to create a codebase that is:

- Easy to understand.

- Easy to maintain.

- Scalable.

- Compatible with future team development.

- Suitable for AI-assisted development.


# 2. Architecture Philosophy

CalorieDock follows a feature-based architecture.

The main principle:

> Code should be organized around product features, not only technical file types.

Example:

Instead of:

```
`components/`

`services/`

`hooks/`

`utils/`
```

containing everything,

CalorieDock organizes code by domain:

```
`features/`


`├── authentication`

`├── profile`

`├── food`

`├── meals`

`├── weight`

`├── water`

`└── dashboard`
```


# 3. Root Project Structure

Recommended structure:

```
`src/`


`├── app/`

`├── components/`

`├── features/`

`├── hooks/`

`├── lib/`

`├── services/`

`├── types/`

`├── schemas/`

`├── utils/`

`├── constants/`

`└── styles/`
```


# 4. App Directory

Location:

```
`src/app/`
```

Purpose:

Contains Next.js App Router files.

Responsibilities:

- Routes.

- Layouts.

- Pages.

- Loading states.

- Error handling.

Example:

```
`app/`


`├── layout.tsx`

`├── page.tsx`

`├── dashboard/`

`│   └── page.tsx`

`├── login/`

`│   └── page.tsx`

`└── settings/`

`    └── page.tsx`
```

The app directory should not contain complex business logic.


# 5. Components

Location:

```
`src/components/`
```

Purpose:

Reusable UI components.

Examples:

```
`components/`


`├── ui/`

`├── forms/`

`├── charts/`

`└── layout/`
```

Examples:

- Button.

- Modal.

- Card.

- Input.

- Navigation.

Components should be reusable across multiple features.


# 6. Features Directory

Location:

```
`src/features/`
```

Purpose:

Contains feature-specific functionality.

Structure:

```
`features/`


`└── meals/`


`    ├── components/`

`    ├── hooks/`

`    ├── services/`

`    ├── schemas/`

`    ├── types.ts`

`    └── index.ts`
```


# 7. Feature Responsibilities

Each feature may contain:

## Components

UI related to that feature.

Example:

```
`MealCard.tsx`

`MealForm.tsx`
```


## Hooks

Feature-specific React logic.

Example:

```
`useMeals.ts`

`useCreateMeal.ts`
```


## Services

Business and data operations.

Example:

```
`meal.service.ts`
```


## Schemas

Validation rules.

Example:

```
`meal.schema.ts`
```


## Types

Feature-specific TypeScript types.

Example:

```
`Meal.ts`
```


# 8. Services Layer

Location:

```
`src/services/`
```

Purpose:

Shared external communication logic.

Examples:

```
`services/`


`├── supabase/`

`├── open-food-facts/`

`└── analytics/`
```


# 9. Supabase Structure

Recommended:

```
`services/`


`└── supabase/`


`    ├── client.ts`

`    ├── server.ts`

`    └── queries.ts`
```

Responsibilities:

- Database communication.

- Authentication.

- Secure server operations.


# 10. Schemas

Location:

```
`src/schemas/`
```

Purpose:

Global validation schemas.

Technology:

- Zod.

Examples:

```
`user.schema.ts`

`food.schema.ts`

`profile.schema.ts`
```

Feature-specific schemas may stay inside features.


# 11. Types

Location:

```
`src/types/`
```

Purpose:

Global TypeScript definitions.

Examples:

```
`database.ts`

`api.ts`

`common.ts`
```

Feature-specific types remain inside feature folders.


# 12. Lib Directory

Location:

```
`src/lib/`
```

Purpose:

Application configuration and shared utilities.

Examples:

```
`lib/`


`├── constants.ts`

`├── utils.ts`

`└── config.ts`
```


# 13. Server Actions

Location:

Recommended:

Inside features.

Example:

```
`features/`


`└── meals/`


`    └── actions.ts`
```

Reason:

Server actions belong to the business domain they serve.


# 14. Route Handlers

Location:

```
`app/api/`
```

Used only when needed.

Examples:

- External API integration.

- Webhooks.

- Public endpoints.

Not every database operation requires an API route.


# 15. Naming Conventions

## Components

PascalCase:

```
`MealCard.tsx`
```


## Hooks

camelCase with use prefix:

```
`useMeals.ts`
```


## Services

camelCase:

```
`mealService.ts`
```


## Files

Use descriptive names.

Avoid:

```
`helper.ts`

`stuff.ts`

`common2.ts`
```


# 16. Import Rules

Preferred dependency direction:

```
`Components`


`↓`


`Features`


`↓`


`Services`


`↓`


`Database`
```

Avoid:

- Circular dependencies.

- Components directly accessing databases.

- Business logic inside UI.


# 17. AI Development Considerations

The structure is designed for AI-assisted development.

When requesting code:

Provide:

- Relevant feature folder.

- Architecture document.

- Coding standards.

- Database requirements.

AI should modify only the required area.


# 18. Example Feature Structure

Example:

```
`features/`


`└── meals/`


`    ├── components/`

`    │   ├── MealCard.tsx`

`    │   └── MealForm.tsx`

`    │`

`    ├── hooks/`

`    │   └── useMeals.ts`

`    │`

`    ├── services/`

`    │   └── mealService.ts`

`    │`

`    ├── schemas/`

`    │   └── meal.schema.ts`

`    │`

`    └── types.ts`
```


# 19. Rules

The following rules apply:

- Keep features isolated.

- Avoid unnecessary abstractions.

- Keep components simple.

- Keep business logic outside UI.

- Prefer composition over duplication.


# 20. Status

```
`Architecture Defined     ✅`


`Folder Structure         ✅`


`Feature Organization     ✅`


`AI Compatibility         ✅`


`Implementation           ⏳`
```


# End of Next.js Project Structure

