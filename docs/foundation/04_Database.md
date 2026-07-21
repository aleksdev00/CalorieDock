# CalorieDock Database Design


# Overview

PostgreSQL database powered by Supabase.

Designed for:

- High scalability

- Time-series tracking

- Strict user data isolation

- Analytics readiness


# Core Principles

- Every row belongs to a user

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
| water\_intake                       |  
| daily\_summary                      |  
| achievements                       |  
----------------------------------------
```


# Tables

## 1. profiles

Extends auth.users

- id (uuid PK)

- user\_id (uuid FK)

- name

- height

- weight

- age

- gender

- activity\_level

- created\_at


## 2. meals

- id (uuid)

- user\_id

- name

- meal\_type

- total\_calories

- created\_at


## 3. meal\_items

- id

- meal\_id

- food\_id

- quantity

- calories

- protein

- carbs

- fat


## 4. foods

Global nutrition database

- id

- name

- brand

- barcode (indexed)

- calories\_per\_100g

- protein

- carbs

- fat

- image\_url


## 5. weight\_entries

- id

- user\_id

- weight

- date (indexed)


## 6. water\_intake

- id

- user\_id

- amount\_ml

- date (indexed)


## 7. daily\_summary

Precomputed analytics table

- id

- user\_id

- date (indexed)

- total\_calories

- total\_protein

- total\_carbs

- total\_fat

- water\_intake

- weight\_snapshot (optional future)


## 8. achievements

- id

- user\_id

- type

- unlocked\_at


# Indexing Strategy

Critical indexes:

- user\_id (all tables)

- date (time-series tables)

- barcode (foods)

- meal\_id (meal\_items)


# Row Level Security (RLS)

All tables enforce:

- Users can only access their own data

- Inserts must match authenticated user\_id

- No public access to private data

- Admin-only policies (future extension)


# Data Flow Example

Meal logging:

1. Insert meal

2. Insert meal\_items

3. Update daily\_summary

4. Trigger analytics recalculation


# Performance Strategy

- daily\_summary = precomputed dashboard layer

- indexed time-series queries

- caching-ready structure

- minimal joins for UI queries


# Future Extensions

- AI recommendation tables

- fasting tracking

- meal scoring system

- recipe generation

- wearable integration data

