# 16 — Supabase Setup

**Project:** CalorieDock  
**Document Type:** Infrastructure & Backend Configuration  
**Status:** Planning  
**Version:** 1.0


# 1. Purpose

This document defines how Supabase is used within CalorieDock.

It describes:

- Authentication

- PostgreSQL database

- Row Level Security (RLS)

- Storage

- Edge Functions

- Migrations

- Environment configuration

- Development workflow

This document is the single source of truth for all Supabase-related decisions.


# 2. Why Supabase?

Supabase has been selected because it provides a production-ready backend platform while allowing CalorieDock to remain a modern full-stack application.

Benefits include:

- PostgreSQL database

- Built-in Authentication

- Row Level Security

- Secure Storage

- Realtime capabilities

- Serverless Edge Functions

- Excellent Next.js integration


# 3. Core Services Used

The MVP uses the following Supabase services:

| **Service** | **Usage** |
| :-: | :-: |
| Authentication | User authentication and session management |
| PostgreSQL | Primary application database |
| Storage | User-uploaded assets (future profile images) |
| Row Level Security | Database authorization |
| Database Migrations | Version-controlled schema changes |

The following services are intentionally **not** part of the MVP:

- Realtime

- Vector Database

- AI Features

- Edge Functions

- Supabase Functions/RPC for business logic


# 4. Authentication

Authentication is fully managed by Supabase Auth.

Supported providers:

- Email & Password

Future providers:

- Google

- Apple

- GitHub

Authentication responsibilities include:

- Registration

- Login

- Logout

- Password reset

- Email verification

- Session refresh

Passwords are never stored by CalorieDock.


# 5. Database

The PostgreSQL database stores all application data except authentication credentials.

Main tables:

- profiles

- foods

- meals

- meal\_items

- weight\_entries

- water\_entries

- user\_preferences

Authentication users are stored in:

```
`auth.users`
```

`profiles.id` is the same UUID as `auth.users.id` and has no `user_id` column. Other user-owned tables reference authenticated users through `user_id` foreign keys.


# 6. Row Level Security

RLS is mandatory.

Every private table must have RLS enabled. `profiles` uses `auth.uid() = id`; other private tables use their `user_id` ownership column. Foods with `user_id IS NULL` are global catalogue records and must be readable without exposing private custom foods.

General rule:

- Users may only read their own data.

- Users may only modify their own data.

- Users may only delete their own data.

Client-side authorization alone is never sufficient.


# 7. Storage

Storage is not required for the initial MVP.

Future usage:

- Profile pictures

- Custom food images

- Attachments

Initial bucket plan:

```
`profile-images`
```

All buckets must enforce access policies.


# 8. Database Migrations

All schema changes must be created through migrations.

Never modify production tables manually.

Migration workflow:

```
`Create Migration`


`↓`


`Review`


`↓`


`Test`


`↓`


`Commit`


`↓`


`Deploy`
```

Every migration should include:

- Table creation

- Constraints

- Indexes

- Foreign keys

- RLS policies


# 9. Seed Data

Development environments may include seed data.

Examples:

- Sample foods

- Demo meals

- Test profiles

Production databases must never contain development seed data.


# 10. Environment Variables

Required environment variables:

```
`NEXT\_PUBLIC\_SUPABASE\_URL=`


`NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=`


`SUPABASE\_SERVICE\_ROLE\_KEY=`
```

Rules:

- Never commit secrets.

- Never expose service role keys to the client.

- Production values are managed through Vercel.


# 11. Client Architecture

The application should use two Supabase clients:

## Browser Client

Responsibilities:

- Authentication

- User session

- Client-side queries where appropriate


## Server Client

Responsibilities:

- Secure database operations

- Protected business logic

- Server Actions

- Route Handlers for HTTP/external integration surfaces

The service role key must only be used in secure server environments and never exposed to the browser.

## MVP Backend Boundary

Next.js services and Server Actions own business logic, validation, and authenticated mutations. Supabase provides Auth, PostgreSQL, migrations, and RLS. Edge Functions and PostgreSQL RPC functions are excluded from the MVP.


# 12. Open Food Facts Integration

External food searches follow this flow:

```
`User Search`


`↓`


`Internal Database`


`↓`


`Open Food Facts API`


`↓`


`Normalize Response`


`↓`


`Cache (optional)`


`↓`


`Return Result`
```

CalorieDock should not mirror the entire Open Food Facts database.

Only requested products should be retrieved.


# 13. Development Workflow

Recommended workflow:

```
`Update Documentation`


`↓`


`Create Migration`


`↓`


`Implement Backend Logic`


`↓`


`Implement Frontend`


`↓`


`Test`


`↓`


`Commit`
```

Documentation should always be updated before schema changes.


# 14. Security Rules

The following rules are mandatory:

- Enable RLS on every user-owned table.

- Validate all input.

- Never trust client-provided IDs.

- Keep secrets outside the repository.

- Review policies before deployment.


# 15. Backup Strategy

Development:

- Local migration history.

Production:

- Automated Supabase backups.

- Migration history in Git.

- Version-controlled schema.


# 16. Future Expansion

Supabase architecture supports future additions such as:

- Object Storage

- Realtime synchronization

- Edge Functions

- AI integrations

- Push notifications

- Team accounts

These features should only be introduced when there is a clear product need.


# 17. Best Practices

- Keep the database normalized.

- Prefer Server Actions for sensitive operations.

- Use Route Handlers for external integrations.

- Never bypass RLS.

- Keep migrations small and focused.

- Review every schema change before deployment.


# 18. Readiness Status

```
`Authentication          ✅`


`Database               ✅`


`RLS                    ✅`


`Storage Planning       ✅`


`Migration Strategy     ✅`


`Security               ✅`


`Implementation         ⏳`
```


# Conclusion

Supabase serves as the backend foundation of CalorieDock.

Its primary responsibilities are:

- Authentication

- Secure data storage

- Authorization

- Database management

Business logic should remain inside the application layer, while Supabase provides secure and scalable infrastructure.


# End of Supabase Setup

