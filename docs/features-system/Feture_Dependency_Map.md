# Feature Dependency Map

# Purpose

This document defines implementation dependencies between features.

A dependent feature MUST NOT enter development until its required dependencies are completed or explicitly approved.

# MVP Dependency Order

```
Authentication
└── User Profile
    ├── Food Database
    ├── Meal Tracking (also depends on Food Database)
    ├── Weight Tracking
    ├── Water Tracking
    ├── Settings
    └── Daily Summary (depends on Meal Tracking, Weight Tracking, and Water Tracking)
        └── Dashboard (depends on Daily Summary and all of its source features)
```

# Dependency Rules

- Authentication is required for all user-facing features.

- User Profile is required for Meal Tracking, Weight Tracking, Water Tracking, and Settings.

- Meal Tracking depends on User Profile and Food Database.

- Weight Tracking and Water Tracking depend on User Profile.

- Daily Summary depends on Meal Tracking, Weight Tracking, and Water Tracking.

- Dashboard depends on Authentication, User Profile, Meal Tracking, Weight Tracking, Water Tracking, and Daily Summary.

- Progress Analytics depends on Meal Tracking and Weight Tracking.

- Weekly Review depends on Progress Analytics.

- Achievements depend on Progress Analytics.

- Premium Features may extend existing features but should not duplicate functionality.

- Admin Dashboard must remain isolated from the user application.

# AI Development Rules

Before implementing a feature, AI MUST:

1. Check Feature Registry.

2. Check this dependency map.

3. Verify that all required dependencies are completed or approved.

4. If dependencies are missing, stop implementation and report the missing prerequisites.
