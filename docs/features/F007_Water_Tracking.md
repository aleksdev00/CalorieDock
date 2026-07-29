# F007 — Water Tracking

**Feature ID:** F007  
**Feature Name:** Water Tracking  
**Category:** Core MVP Feature  
**Priority:** High  
**Status:** Planned

# 1. Feature Overview

Water Tracking lets authenticated users record hydration and review their daily intake. Dashboard and Daily Summary consume the same source records; no persisted daily hydration summary is created for the MVP.

# 2. Functional Requirements

- Users can add, edit, delete, and view their own water entries.
- Each entry records a positive amount and a consumption timestamp.
- Amounts are stored in canonical millilitres; the interface displays the user’s selected unit.
- Users can view a selected day’s total by aggregating `water_entries`.
- Dashboard and Daily Summary refresh from source records after an entry changes.

# 3. Database Design

## water_entries

| Column | Type | Required | Description |
| - | - | - | - |
| id | UUID | Yes | Primary key |
| user_id | UUID | Yes | References `auth.users.id` |
| amount_ml | DECIMAL | Yes | Canonical amount in millilitres; must be greater than zero |
| consumed_at | TIMESTAMPTZ | Yes | When the water was consumed |
| created_at | TIMESTAMPTZ | Yes | Record creation timestamp |

Required index: `(user_id, consumed_at)`.

# 4. Units and Preferences

Supported display units are `ml`, `L`, and `oz`. Conversion occurs at the application boundary. The stored value remains `amount_ml`. The preferred display unit is stored in `user_preferences`; it is not stored on an entry.

# 5. Security

RLS is mandatory. Users may select, insert, update, and delete only rows where `user_id = auth.uid()`. Inserts and updates must enforce the authenticated user as the owner.

# 6. Dependencies

- F001 Authentication
- F002 User Profile

# 7. Acceptance Criteria

- Water entries use the canonical `water_entries` model.
- Daily hydration totals are calculated from entries for the selected day.
- Unit changes do not alter canonical stored values.
- Users cannot access another user’s entries.
