# 13 — Database Audit

**Project:** CalorieDock  
**Document Type:** Database Review & Validation  
**Status:** Review  
**Version:** 1.0


# 1. Purpose

This document validates the CalorieDock database design against the current MVP scope.

The purpose of this audit is to ensure:

- All MVP features are supported.

- Database structure is scalable.

- Relationships are correctly defined.

- Security requirements are covered.

- Unnecessary complexity is avoided.

The official database schema remains defined in:

```
`docs/foundation/04\_Database.md`
```

This document only evaluates and recommends improvements.


# 2. Audit Scope

Reviewed features:

```
`F001 Authentication`


`F002 User Profile`


`F003 Dashboard`


`F004 Food Database`


`F005 Meal Tracking`


`F006 Weight Tracking`


`F007 Water Tracking`


`F008 Daily Summary`


`F009 Settings`
```


# 3. Current Database Entities Review

## Users

Status:

✅ Required

Purpose:

Stores authentication-related user identity.

Source:

Supabase Auth.

Notes:

User authentication data should not be duplicated inside application tables.

Relationship:

```
`auth.users`


`↓`


`profiles`
```


# 4. Profiles

Status:

✅ Required

Supports:

- User information.

- Body information.

- Goals.

Used by:

- User Profile.

- Dashboard.

- Weight Tracking.

- Nutrition calculations.

Recommended fields:

```
`id`


`user\_id`


`name`


`date\_of\_birth`


`height`


`weight\_goal`


`activity\_level`


`created\_at`


`updated\_at`
```


# 5. Foods

Status:

✅ Required

Supports:

- Food Database.

- Meal Tracking.

Sources:

- Open Food Facts.

- User-created foods.

Recommended distinction:

```
`System Food`


`vs`


`User Custom Food`
```

Suggested fields:

```
`id`


`name`


`brand`


`barcode`


`calories`


`protein`


`carbohydrates`


`fat`


`source`


`created\_at`
```


# 6. Meals

Status:

✅ Required

Supports:

- Meal Tracking.

- Daily Summary.

Relationship:

```
`User`


`↓`


`Meals`


`↓`


`Meal Items`
```

Suggested fields:

```
`id`


`user\_id`


`name`


`meal\_type`


`consumed\_at`


`created\_at`
```


# 7. Meal Items

Status:

✅ Required

Supports:

Individual food entries inside meals.

Relationship:

```
`Meal`


`↓`


`Meal Items`


`↓`


`Foods`
```

Suggested fields:

```
`id`


`meal\_id`


`food\_id`


`quantity`


`calculated\_calories`


`created\_at`
```


# 8. Weight Entries

Status:

✅ Required

Supports:

- Weight Tracking.

- Progress visualization.

Relationship:

```
`User`


`↓`


`Weight Entries`
```

Suggested fields:

```
`id`


`user\_id`


`weight`


`unit`


`recorded\_at`


`created\_at`
```


# 9. Water Entries

Status:

✅ Required

Supports:

- Water Tracking.

- Daily Summary.

Relationship:

```
`User`


`↓`


`Water Entries`
```

Suggested fields:

```
`id`


`user\_id`


`amount`


`unit`


`consumed\_at`


`created\_at`
```


# 10. User Preferences

Status:

⚠️ Recommended Addition

Required by:

F009 Settings.

Purpose:

Store application preferences.

Suggested fields:

```
`id`


`user\_id`


`language`


`theme`


`weight\_unit`


`water\_unit`


`notification\_preferences`


`created\_at`


`updated\_at`
```


# 11. Daily Summary Table

Status:

⚠️ Requires Decision

Current approach:

Calculate summary dynamically.

Alternative:

Store daily aggregates.


# Recommendation

For MVP:

Do NOT create a dedicated Daily Summary table.

Reason:

The data can be calculated from:

- meals

- meal\_items

- water\_entries

- weight\_entries

Benefits:

- Less duplicated data.

- Easier maintenance.

- Fewer synchronization issues.


# Future Option

For large scale:

Create:

```
`daily\_summaries`
```

for analytics performance.


# 12. Achievements

Status:

❌ Not Required for MVP

Reason:

Premium/future functionality.

Do not include in MVP database.


# 13. Relationships Overview

Final MVP relationship model:

```
`auth.users`


`    |`


`profiles`


`    |`


`    +----------------+`


`    |                |`


` meals          weight\_entries`


`    |`


`meal\_items`


`    |`


`foods`



`profiles`


`    |`


`water\_entries`



`profiles`


`    |`


`user\_preferences`
```


# 14. Row Level Security Audit

All user-owned tables require RLS.

Tables:

```
`profiles`


`meals`


`meal\_items`


`weight\_entries`


`water\_entries`


`user\_preferences`
```

Rule:

Users can only access their own records.


# 15. Index Recommendations

Required indexes:

## Meals

```
`user\_id`


`consumed\_at`
```


## Meal Items

```
`meal\_id`


`food\_id`
```


## Weight Entries

```
`user\_id`


`recorded\_at`
```


## Water Entries

```
`user\_id`


`consumed\_at`
```


# 16. Potential Issues Identified

## Issue 1 — Duplicate Nutrition Data

Problem:

Food values can change after meal creation.

Recommendation:

Store calculated nutrition values inside meal\_items.

Status:

✅ Accepted.


## Issue 2 — Daily Summary Complexity

Problem:

Stored summaries can become inconsistent.

Recommendation:

Calculate dynamically for MVP.

Status:

✅ Accepted.


## Issue 3 — Food Database Growth

Problem:

Open Food Facts contains large amounts of data.

Recommendation:

Do not import everything.

Use:

- Search API.

- Cache frequently used foods.

Status:

✅ Accepted.


# 17. Final Database Recommendation

MVP database should contain:

```
`profiles`


`foods`


`meals`


`meal\_items`


`weight\_entries`


`water\_entries`


`user\_preferences`
```

Plus:

Supabase Auth:

```
`auth.users`
```


# 18. Database Readiness Status

```
`Schema Design          ✅`


`Feature Coverage       ✅`


`Security Strategy      ✅`


`Scalability            ✅`


`Optimization           ⏳`


`Migration Planning     ⏳`
```


# Conclusion

The current CalorieDock database architecture is sufficient for MVP development.

The recommended approach is:

- Keep database simple.

- Avoid premature optimization.

- Use feature-driven expansion.

- Add complexity only when required by real usage.


# End of Database Audit

