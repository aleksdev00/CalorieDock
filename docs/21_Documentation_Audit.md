# Documentation Consistency Audit

Scope: implementation-affecting inconsistencies found across the current documentation set. Existing documents were not changed.

## 1. Daily-summary persistence strategy conflicts

**File location**

- `docs/foundation/04_Database.md`
- `docs/foundation/13_Database_Audit.md`
- `docs/features/F008_Daily_Summary.md`

**Problem**

`04_Database.md` defines `daily_summary` as a precomputed table and requires updates after meal logging. `13_Database_Audit.md` recommends that the MVP must not create this table and instead calculate summaries dynamically. F008 treats daily summaries as the primary source of truth and requires RLS for persisted summaries.

**Impact on implementation**

The first Supabase migration, meal-write transaction/trigger design, RLS policies, dashboard queries, and invalidation strategy cannot be defined consistently. Implementing both approaches would create duplicated, potentially stale health data.

**Recommended decision**

Choose one MVP approach before migrations. Prefer dynamic summaries from source tables for the MVP, as recommended by the database audit; remove `daily_summary` from the MVP schema and make F008 a read model. If precomputation is required, define the table as `daily_summaries`, its unique key `(user_id, date)`, a single refresh mechanism, and its source-of-truth rules.

## 2. Profile identity and schema are not canonical

**File location**

- `docs/foundation/04_Database.md`
- `docs/foundation/13_Database_Audit.md`
- `docs/features/F002_User_Profile.md`

**Problem**

`04_Database.md` and `13_Database_Audit.md` describe both `profiles.id` and `profiles.user_id`. F002 instead specifies `profiles.id` as the reference to `auth.users.id`, uses `auth.uid() = id` for RLS, and defines a different set of profile fields. The foundation schema also uses `name` and `age`, while F002 uses `full_name` and `date_of_birth`.

**Impact on implementation**

The profile creation trigger, primary/foreign keys, RLS policies, generated types, and all profile queries would be built against incompatible identifiers and column names.

**Recommended decision**

Adopt one profile contract. Recommended: use `profiles.id uuid primary key references auth.users(id)` with no redundant `user_id`; use F002's fields (`full_name`, `date_of_birth`, `goal`, `unit_system`, `profile_completed`, timestamps). Define all other user-owned tables independently with `user_id references auth.users(id)`.

## 3. Water tracking has no PRD and conflicting table definitions

**File location**

- Missing: `docs/features/F007_Water_Tracking.md`
- `docs/foundation/04_Database.md`
- `docs/foundation/13_Database_Audit.md`
- `docs/foundation/16_Supabase_Setup.md`
- `docs/features/F008_Daily_Summary.md`

**Problem**

F007 is listed as an MVP feature in the implementation plan, API design, database audit, and documentation review, but its PRD is absent. The foundation schema calls the table `water_intake` with `amount_ml` and `date`; later documents require `water_entries` with `amount`, `unit`, and `consumed_at`.

**Impact on implementation**

Hydration migrations, RLS policies, unit normalization, daily aggregation, dashboard widgets, and API/service contracts have no approved behavior or stable schema.

**Recommended decision**

Create and approve F007 before Supabase implementation. Select one schema; recommended: `water_entries` with canonical millilitres stored as `amount_ml`, a `consumed_at timestamptz`, and `user_id`. Store display-unit preference separately in `user_preferences`.

## 4. Food ownership and visibility rules conflict

**File location**

- `docs/foundation/04_Database.md`
- `docs/foundation/13_Database_Audit.md`
- `docs/features/F004_Food_Database.md`
- `docs/foundation/15_Security_Strategy.md`

**Problem**

The foundation database describes `foods` as a global database, while its core principle says every row belongs to a user. F004 models global foods plus a `user_foods` relationship and includes a `source` of `user`; the database audit instead describes user-created foods as part of `foods`. The RLS guidance does not define read/write behavior for shared foods versus private custom foods.

**Impact on implementation**

An incorrect RLS policy could either expose a user's custom food to other users or block the shared food search. It also determines whether custom-food writes target `foods`, `user_foods`, or both.

**Recommended decision**

Specify two ownership classes before creating policies: globally readable, system-managed foods; and private custom foods owned by `user_id`. Use either a nullable `foods.user_id` with explicit policies or separate `user_foods` records, but document one model and its write/delete permissions. Do not apply user-only RLS rules to the global catalogue.

## 5. Meal and nutrient field contracts conflict

**File location**

- `docs/foundation/04_Database.md`
- `docs/foundation/13_Database_Audit.md`
- `docs/features/F004_Food_Database.md`
- `docs/features/F005_Meal_Tracking.md`

**Problem**

The database design uses `meals.total_calories`, `meal_items.carbs`, and food values per 100 g. F005 uses `meals.consumed_at`, snapshots `carbohydrates` in `meal_items`, and omits meal totals. F004 uses `calories`, `carbohydrates`, serving fields, and optional nutrition fields. The database audit uses yet another set of names, including `calculated_calories`.

**Impact on implementation**

Migrations, generated Supabase types, calculation code, constraints, and summary queries will disagree on column names and whether totals are stored or computed. Historical nutrition can also become incorrect without a defined snapshot strategy.

**Recommended decision**

Approve a single nutrition vocabulary and persistence model. Recommended: use `consumed_at` on meals; snapshot `calories`, `protein`, `carbohydrates`, and `fat` on meal items; store food nutrition per a documented base quantity; and calculate meal totals from items for the MVP. Define the necessary indexes and edit/delete recalculation behavior in that contract.

## 6. Settings requires an absent base-schema table

**File location**

- `docs/features/F009_Settings.md`
- `docs/foundation/13_Database_Audit.md`
- `docs/foundation/16_Supabase_Setup.md`
- `docs/foundation/04_Database.md`

**Problem**

F009, the database audit, and Supabase setup require `user_preferences`, but the foundational database schema does not define it. F009 also places display units and notification preferences in this table while F002 places `unit_system` on `profiles`.

**Impact on implementation**

There is no authoritative migration, RLS policy, or source for units and preferences. Unit conversions could read conflicting values and settings endpoints cannot have a stable response shape.

**Recommended decision**

Add `user_preferences` to the approved MVP schema as a one-to-one table keyed by `user_id`, and define its allowed enum/JSON values and RLS policy. Decide whether `profiles.unit_system` remains the sole coarse unit preference or migrate all display preferences to `user_preferences`; do not keep duplicate sources.

## 7. Backend business-logic boundary is contradictory

**File location**

- `docs/foundation/03_Architecture.md`
- `docs/foundation/14_API_Design.md`
- `docs/foundation/16_Supabase_Setup.md`

**Problem**

The architecture assigns business logic to Supabase RPC functions and Edge Functions. API Design assigns it to Next.js Server Actions/Route Handlers and a service layer. Supabase Setup excludes Edge Functions from the MVP and says business logic remains in the application layer.

**Impact on implementation**

Developers cannot determine where validation, atomic meal writes, external Open Food Facts calls, and summary calculations belong. This risks duplicated validation and inconsistent authorization paths.

**Recommended decision**

Set the MVP boundary explicitly: Next.js Server Actions/services for authenticated application mutations, Route Handlers only for HTTP/external integration surfaces, PostgreSQL constraints/RLS for data enforcement, and no Edge Functions/RPC unless a documented atomic database operation requires one. Update the architecture accordingly before implementation.

## 8. Feature dependency documentation permits an invalid build order

**File location**

- `docs/features/F003_Dashboard.md`
- `docs/features-system/Feature_Registry.md`
- `docs/features-system/Feture_Dependency_Map.md`
- `docs/foundation/12_MVP_Implementation_Plan.md`

**Problem**

F003 and the registry declare Dashboard dependent only on Authentication/User Profile, yet its required data includes meals, water, and weight. F003 states that Dashboard blocks Meal Tracking and Daily Summary, while the MVP plan correctly recommends Dashboard after meal, weight, water, and daily-summary work. The dependency map also places Daily Summary, Water Tracker, and Weight Tracking under Meal Tracking, rather than declaring their actual dependencies.

**Impact on implementation**

The mandated dependency check can authorize Dashboard implementation before its source data is available, resulting in placeholders, duplicate aggregation logic, or rework.

**Recommended decision**

Make the MVP plan's data-first order canonical. Set Dashboard's functional dependencies to F001, F002, F005, F006, F007, and F008; make F008 depend on F005, F006, and F007; and make F006/F007 depend on F002. Permit an earlier Dashboard shell only if explicitly separated from the data-integrated feature.

## 9. Documentation indexes and templates point to incorrect or competing sources

**File location**

- `docs/foundation/README.md`
- `docs/foundation/21_Documentation_Review.md`
- `docs/features-system/Feature_Template.md`
- `docs/foundation/17_Supabase_Setup.md`
- `docs/foundation/17_Git_Workflow.md`

**Problem**

The foundation README presents an obsolete flat documentation layout and references a missing `12_Brand_Guidelines.md`. The documentation review reports F007 and several differently named AI files as present even though they are not. The feature template links to missing `docs/features/_Definition_of_Done.md` instead of the actual `docs/features-system/Definition_of_Done.md`. Finally, `17_Supabase_Setup.md` contains a Git Workflow document, creating two number-17 files and a misleading filename.

**Impact on implementation**

The prescribed documentation-first and feature-template workflows lead implementers to missing files or the wrong governance rules. The review's "ready" conclusion is therefore not reliable as an implementation gate.

**Recommended decision**

Repair the documentation index, review checklist, and template references; retain one correctly named Git workflow document and remove or rename the mislabeled duplicate. Re-run the readiness review only after F007 and the schema decisions in this audit are resolved.

## 10. Duplicate deployment and testing guidance lacks a canonical source

**File location**

- `docs/foundation/09_Deployment.md`
- `docs/foundation/19_Deployment_Guide.md`
- `docs/foundation/10_Testing_Strategy.md`
- `docs/foundation/20_Testing_Guide.md`

**Problem**

Each pair covers the same operational responsibility but uses separate planning documents. Neither document designates the other as superseded or defines which checklist is authoritative.

**Impact on implementation**

Migration verification, test-tool selection, release checks, and deployment requirements can drift as implementation begins, producing conflicting completion criteria.

**Recommended decision**

Choose one canonical document for deployment and one for testing, then mark the other as superseded or merge its unique requirements. Keep a single release and migration checklist for implementation work.
