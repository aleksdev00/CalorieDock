# CalorieDock Database Design


# Overview

PostgreSQL database powered by Supabase.

Designed for:

- High scalability

- Time-series tracking

- Strict user data isolation

- Analytics readiness


# Core Principles

- Every private row belongs to a user; global catalogue rows are explicitly shared

- No shared private data

- Strong relational integrity

- Optimized for read-heavy dashboard queries

- Precomputed analytics for performance


# Entity Relationship Model

```
users (auth)  
  ↓  
profiles  
  ↓  
----------------------------------------  
| meals → meal\_items → foods          |  
| weight\_entries                      |  
| water\_entries                      |  
| user\_preferences                  |  
| achievements                       |  
----------------------------------------
```


# Tables

## 1. profiles

Extends auth.users

- id (uuid PK)

- full\_name

- date\_of\_birth

- goal

- unit\_system

- profile\_completed

- created\_at

- updated\_at

`profiles.id` is the same UUID as `auth.users.id`; no `user_id` column is stored on `profiles`.


## 2. meals

- id (uuid)

- user\_id

- name

- meal\_type

- consumed\_at

- created\_at

- updated\_at


## 3. meal\_items

- id

- meal\_id

- food\_id

- food\_name

- food\_brand

- food\_source

- external\_id

- quantity\_grams

- calories

- protein

- carbohydrates

- fat

Meal item nutrition and identity are historical snapshots. `food_id` is nullable with `ON DELETE SET NULL`. Transient Open Food Facts products use a null `food_id` plus their validated external identifier and snapshots; they are not persisted into `foods`. F005 MVP quantities are canonical grams only.


## 4. foods

Nutrition catalogue. `user_id` is nullable: `NULL` identifies a global food; a value identifies a private custom food owned by that user.

- id

- user\_id (nullable)

- name

- brand

- barcode (indexed)

- calories

- protein

- carbohydrates

- fat

- image\_url


## 5. weight\_entries

- id

- user\_id

- weight

- date (indexed)


## 6. water\_entries

- id

- user\_id

- amount\_ml

- consumed\_at (indexed)

- created\_at

## 7. user\_preferences

One-to-one application preferences for an authenticated user. Display-unit preferences are stored here rather than on source entries.

| Column | Type | Required | Default | Allowed values / constraint |
| - | - | - | - | - |
| user\_id | UUID | Yes | None | Primary key; references `auth.users.id` with `ON DELETE CASCADE` |
| weight\_unit | TEXT | Yes | `kg` | `kg`, `lbs` |
| height\_unit | TEXT | Yes | `cm` | `cm`, `ft/in` |
| water\_unit | TEXT | Yes | `ml` | `ml`, `L`, `oz` |
| language | TEXT | Yes | `en` | `en`, `sr` |
| theme | TEXT | Yes | `system` | `system`, `light`, `dark` |
| notification\_preferences | JSONB | Yes | `{}` | Must be a JSON object |
| created\_at | TIMESTAMPTZ | Yes | `now()` | Creation timestamp |
| updated\_at | TIMESTAMPTZ | Yes | `now()` | Last-update timestamp |

For F007, authenticated application access is limited to reading the owner row, inserting `user_id` and `water_unit` when recovery is needed, and updating `water_unit`. Other preference fields are reserved for F009.


## 8. achievements (future)

- id

- user\_id

- type

- unlocked\_at


# Indexing Strategy

Critical indexes:

- user\_id (all tables)

- consumed\_at / recorded\_at (time-series tables)

- barcode (foods)

- meal\_id (meal\_items)


# Row Level Security (RLS)

Private tables enforce:

- Users can only access their own data

- Inserts must match the authenticated owner

- `profiles` uses `auth.uid() = id` for all ownership checks

- Global foods are readable by authenticated users; private foods are readable and writable only by `auth.uid() = user_id`

- Admin-only policies (future extension)


# Data Flow Example

Meal logging:

1. Insert meal

2. Insert meal\_items

3. Dashboard and Daily Summary calculate totals from meals, meal\_items, water\_entries, and weight\_entries


# Performance Strategy

- indexed time-series queries

- caching-ready structure

- source-table aggregation for MVP; precomputed summaries are a future optimization


# Future Extensions

- AI recommendation tables

- fasting tracking

- meal scoring system

- recipe generation

- wearable integration data

