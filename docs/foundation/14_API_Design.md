# 14 — API Design

**Project:** CalorieDock  
**Document Type:** API Architecture & Design Specification  
**Status:** Planning  
**Version:** 1.0


# 1. Purpose

This document defines the API architecture and communication patterns used inside CalorieDock.

The purpose of this document is to establish:

- How frontend communicates with backend logic.

- How business logic is structured.

- How external APIs are integrated.

- How data validation is handled.

- How future scaling is supported.


# 2. API Architecture Overview

CalorieDock uses a modern full-stack architecture based on Next.js and Supabase.

Architecture:

```
`User Interface`


`↓`


`Next.js Application Layer`


`↓`


`Server Actions / Route Handlers`


`↓`


`Service Layer`


`↓`


`Supabase Client`


`↓`


`PostgreSQL Database`
```

For the MVP, Server Actions and services are the application boundary for authenticated mutations. Route Handlers are reserved for HTTP/external integrations. Supabase provides Auth, database access, migrations, and RLS; Edge Functions and PostgreSQL RPC functions are not used.


# 3. API Responsibilities

The API layer is responsible for:

- Authentication flows.

- Data validation.

- Business logic.

- Database communication.

- External API communication.

- Error handling.

The API layer is NOT responsible for:

- UI logic.

- Client state management.

- Data visualization.


# 4. Communication Principles

## Validation First

All incoming data must be validated before processing.

Technology:

- Zod schemas.

Example:

```
`Request`


`↓`


`Validation`


`↓`


`Business Logic`


`↓`


`Database Operation`
```


## Service Layer Pattern

Database operations should not be directly written inside components.

Correct:

```
`Component`


`↓`


`Hook`


`↓`


`Service`


`↓`


`Supabase`
```

Incorrect:

```
`Component`


`↓`


`Supabase Query`
```


# 5. Authentication API

Authentication is handled through Supabase Auth.

Supported operations:


## Register User

```
`POST /auth/register`
```

Purpose:

Create a new user account.


## Login User

```
`POST /auth/login`
```

Purpose:

Authenticate existing users.


## Logout User

```
`POST /auth/logout`
```

Purpose:

End user session.


## Current User

```
`GET /auth/me`
```

Purpose:

Retrieve authenticated user information.


# 6. Profile API

Feature:

F002 — User Profile


## Get Profile

```
`GET /profile`
```

Returns:

- Personal information.

- Goals.


## Update Profile

```
`PATCH /profile`
```

Updates:

- Full name.

- Date of birth.

- Goal.

- Unit system.

- Profile completion status.


# 7. Food Database API

Feature:

F004 — Food Database


## Search Foods

```
`GET /foods/search`
```

Sources:

- Internal database.

- Open Food Facts API.


## Get Food

```
`GET /foods/\{id\}`
```

Returns:

- Nutrition information.

- Product details.


## Create Custom Food

```
`POST /foods`
```

Allows users to create personal foods.


# 8. Meal Tracking API

Feature:

F005 — Meal Tracking


## Create Meal

```
`POST /meals`
```

Creates a new meal.


## Get Meals

```
`GET /meals`
```

Supports:

- Date filtering.

- Meal type filtering.


## Update Meal

```
`PATCH /meals/\{id\}`
```


## Delete Meal

```
`DELETE /meals/\{id\}`
```


## Add Meal Item

```
`POST /meals/\{id\}/items`
```

Adds food to a meal.


# 9. Weight Tracking API

Feature:

F006 — Weight Tracking


## Add Weight

```
`POST /weight`
```


## Get Weight History

```
`GET /weight/history`
```


## Delete Weight Entry

```
`DELETE /weight/\{id\}`
```


# 10. Water Tracking API

Feature:

F007 — Water Tracking


## Add Water

```
`POST /water`
```


## Get Daily Water

```
`GET /water/daily`
```


## Update Water Goal

```
`PATCH /water/goal`
```


# 11. Daily Summary API

Feature:

F008 — Daily Summary


## Get Daily Summary

```
`GET /summary/daily`
```

Returns:

- Calories.

- Macros.

- Water.

- Weight information.

- Goal progress.


# 12. Settings API

Feature:

F009 — Settings


## Get Settings

```
`GET /settings`
```


## Update Settings

```
`PATCH /settings`
```


# 13. External API Integration

## Open Food Facts

Purpose:

Provide additional food information.

Flow:

```
`User Search`


`↓`


`CalorieDock API`


`↓`


`Internal Database`


`↓`


`Open Food Facts`


`↓`


`Cache Result`


`↓`


`Return Response`
```


# 14. Error Handling

All API responses should follow a consistent format.

Example:

```
`\{`

` "success": false,`

` "error": \{`

`   "code": "VALIDATION\_ERROR",`

`   "message": "Invalid input"`

` \}`

`\}`
```


# 15. Security Requirements

Every protected endpoint must:

- Validate authentication.

- Verify ownership.

- Respect Supabase RLS policies.

Never trust client-provided user IDs.


# 16. API Versioning

MVP:

```
`/api/`
```

Future:

```
`/api/v1/`
```

Versioning should only be introduced when breaking changes are required.


# 17. API Development Rules

Every endpoint must include:

- Validation schema.

- Authentication check.

- Error handling.

- Logging where necessary.

- Testing.


# 18. Future Scalability

Current architecture supports future extraction into:

- Dedicated backend service.

- ASP.NET Core API.

- Microservices.

Without requiring major frontend changes.


# 19. API Readiness Status

```
`Architecture Defined     ✅`


`Endpoints Planned        ✅`


`Validation Strategy      ✅`


`Security Strategy        ✅`


`Implementation           ⏳`
```


# End of API Design

