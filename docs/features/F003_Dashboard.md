# F003 — Dashboard


# Metadata

| Property | Value |
| - | - |
| Feature ID | F003 |
| Feature Name | Dashboard |
| Version | 1.0 |
| Status | Planned |
| Priority | Critical |
| Product Version | MVP |
| Owner | CodeAnchor |
| Dependencies | F001 Authentication, F002 User Profile |
| Blocks | Meal Tracking, Daily Summary, Analytics |
| Estimated Complexity | Medium-High |



# Overview

The Dashboard is the main landing page users see after signing in.

Its purpose is to provide a quick and meaningful overview of the user's daily nutrition progress, health metrics, and shortcuts to the most important actions.

The Dashboard is designed to answer one simple question:

> "How am I doing today?"

Rather than presenting raw data, it should transform information into actionable insights that help users stay on track with their nutrition goals.


# Goals

The Dashboard should:

- Give users an immediate overview of today's progress.

- Encourage consistent meal tracking.

- Reduce navigation by surfacing important information.

- Display progress toward daily goals.

- Act as the central navigation hub for the application.


# Out of Scope

The Dashboard does **not** manage:

- Authentication

- Profile editing

- Meal creation

- Food search

- Weight history

- Water history

- Advanced analytics

- Settings management

These responsibilities belong to their respective features.


# User Stories

### US-001

As a user,

I want to immediately see my daily calorie progress,

so I know how much I have left.


### US-002

As a user,

I want to see today's meals,

so I know what I've already eaten.


### US-003

As a user,

I want quick access to adding meals,

so tracking food requires minimal effort.


### US-004

As a user,

I want to monitor my water intake,

so I can stay hydrated.


### US-005

As a user,

I want to see my current weight,

so I can monitor long-term progress.


### US-006

As a user,

I want the Dashboard to load quickly,

so I can immediately continue tracking my day.


# Functional Requirements

## DASH-FR-001

The system shall display a personalized greeting.

Example:

Good morning, Aleksa.


## DASH-FR-002

The system shall display the current date.


## DASH-FR-003

The system shall display today's calorie progress.

Information includes:

- Goal

- Consumed

- Remaining

- Percentage


## DASH-FR-004

The system shall display macronutrient progress.

Includes:

- Protein

- Carbohydrates

- Fat

Each value should display:

- Current amount

- Daily target

- Progress indicator


## DASH-FR-005

The system shall display today's water intake.

Information includes:

- Current intake

- Daily goal

- Remaining amount


## DASH-FR-006

The system shall display today's meals.

For each meal:

- Name

- Time

- Calories

Selecting a meal should navigate to the Meal Tracking feature.


## DASH-FR-007

The system shall display current body weight.

Information includes:

- Current weight

- Previous measurement

- Difference from previous entry

Detailed history belongs to the Weight Tracking feature.


## DASH-FR-008

The system shall provide quick actions.

Required actions:

- Add Meal

- Add Water

- Update Weight


## DASH-FR-009

The system shall automatically refresh displayed information after successful updates made elsewhere in the application.


## DASH-FR-010

The Dashboard shall only display data belonging to the authenticated user.


# Dashboard Layout

The Dashboard follows a modular widget-based layout.

Each section should represent one clear purpose and should be independently reusable.

The layout must follow the CalorieDock UI/UX Guidelines:

- Clear hierarchy

- Minimal cognitive load

- Responsive behavior

- Mobile-first approach


# Desktop Layout

Recommended structure:

+--------------------------------+  
| Header / Greeting |  
+--------------------------------+

+----------------+---------------+  
| Calories | Water |  
+----------------+---------------+

+--------------------------------+  
| Macronutrients |  
+--------------------------------+

+--------------------------------+  
| Today's Meals |  
+--------------------------------+

+----------------+---------------+  
| Weight | Quick Actions |  
+----------------+---------------+


`---`


`\# Mobile Layout`


`Mobile layout should use vertical stacking.`


`Recommended order:`
```

Greeting

↓

Calories Overview

↓

Quick Actions

↓

Meals Timeline

↓

Water Progress

↓

Weight Summary

↓

Additional Information


`The most important information should appear first.`


`---`


`\# Dashboard Components`


`The Dashboard should be composed of reusable components.`


`---`


`\# DashboardHeader`


`\#\# Purpose`


`Provides user context.`


`---`


`\#\# Displays`


`- User greeting`

`- Current date`

`- Profile shortcut`

`- Settings shortcut`


`---`


`\#\# Example`
```

Good morning, Aleksa

Thursday, July 10


`---`


`\# CaloriesOverviewCard`


`\#\# Purpose`


`Displays the user's daily calorie progress.`


`---`


`\#\# Data`


`Required:`


`- Daily calorie goal`

`- Consumed calories`

`- Remaining calories`

`- Completion percentage`


`---`


`\#\# UI Elements`


`- Progress indicator`

`- Main calorie number`

`- Supporting information`


`---`


`\#\# Example`
```

Calories

1850 / 2400 kcal

77% completed


`---`


`\# MacroProgressCard`


`\#\# Purpose`


`Displays daily macronutrient progress.`


`---`


`\#\# Data`


`- Protein`

`- Carbohydrates`

`- Fat`


`---`


`\#\# Display`


`Each macro should show:`


`- Current amount`

`- Target amount`

`- Progress`


`---`


`\# MealTimelineWidget`


`\#\# Purpose`


`Provides an overview of today's meals.`


`---`


`\#\# Displays`


`Meal categories:`


`- Breakfast`

`- Lunch`

`- Dinner`

`- Snacks`


`---`


`\#\# Each Meal Item Contains`


`- Meal name`

`- Time`

`- Calories`


`---`


`\#\# Interaction`


`Selecting an item:`


`↓`


`Opens Meal Tracking details.`


`---`


`\# WaterProgressWidget`


`\#\# Purpose`


`Displays hydration progress.`


`---`


`\#\# Data`


`- Current water intake`

`- Daily target`

`- Completion percentage`


`---`


`\#\# Interaction`


`Quick action allows adding water.`


`---`


`\# WeightSummaryWidget`


`\#\# Purpose`


`Displays current weight progress.`


`---`


`\#\# Data`


`- Current weight`

`- Previous weight`

`- Trend`


`---`


`\#\# Note`


`Detailed history belongs to Weight Tracking.`


`---`


`\# QuickActionsWidget`


`\#\# Purpose`


`Provide fast access to frequent actions.`


`---`


`\#\# Required Actions`


`\#\#\# Add Meal`


`Opens:`


`Meal Tracking creation flow`


`---`


`\#\#\# Add Water`


`Updates:`


`Daily water intake`


`---`


`\#\#\# Update Weight`


`Opens:`


`Weight Tracking entry form`


`---`


`\# Data Requirements`


`The Dashboard requires data from multiple sources.`


`---`


`\# User Profile`


`Source:`


`F002 User Profile`


`Required:`


`- User name`

`- Goals`

`- Daily targets`


`---`


`\# Meal Tracking`


`Source:`


`Future F005 Meal Tracking`


`Required:`


`- Today's meals`

`- Calories`

`- Macronutrients`


`---`


`\# Water Tracking`


`Source:`


`Future F007 Water Tracking`


`Required:`


`- Current intake`

`- Daily goal`


`---`


`\# Weight Tracking`


`Source:`


`Future F006 Weight Tracking`


`Required:`


`- Current weight`

`- Previous measurement`


`---`


`\# Business Logic`


`---`


`\# Daily Progress Calculation`


`The system calculates:`
```

Consumed Calories / Daily Goal × 100


`Result:`


`Displayed as completion percentage.`


`---`


`\# Remaining Calories`


`Formula:`
```

Daily Goal - Consumed Calories


`---`


`\# Macro Progress`


`Formula:`
```

Current Macro Amount / Target Macro Amount × 100


`---`


`\# Weight Trend`


`Calculation:`
```

Current Weight - Previous Weight


`Result:`


`- Increase`

`- Decrease`

`- No change`


`---`


`\# Data Loading Strategy`


`The Dashboard should prioritize fast loading.`


`---`


`\#\# Initial Load`


`Required:`


`- Display loading state`

`- Fetch required user data`

`- Render available information`


`---`


`\#\# Data Fetching`


`Recommended:`


`- Server-side data fetching where possible`

`- Client updates after user actions`


`---`


`\#\# Performance Requirements`


`Dashboard should:`


`- Avoid unnecessary requests`

`- Cache reusable data`

`- Load independent widgets separately`


`---`


`\# Security Requirements`


`\#\# DASH-SEC-001`


`Users can only access their own dashboard data.`


`---`


`\#\# DASH-SEC-002`


`All database requests must respect Supabase Row Level Security.`


`---`


`\#\# DASH-SEC-003`


`Sensitive user information must not be exposed through client requests.`


`---`


`\#\# DASH-SEC-004`


`The Dashboard must rely on authenticated user context.`
```

```
`---`
```


`\# Loading States`


`The Dashboard must provide clear feedback while data is being loaded.`


`---`


`\#\# Initial Loading`


`When the user opens the Dashboard:`


`The system should display:`


`- Skeleton components`

`- Placeholder content`

`- Loading indicators`


`The interface should avoid showing empty sections before data is available.`


`---`


`\#\# Widget Loading`


`Each independent widget should support individual loading.`


`Example:`


`Calories card loading:`
```

Calories

████████  
████████


`Other widgets should remain available if their data is already loaded.`


`---`


`\# Empty States`


`The Dashboard must handle situations where users have no available data.`


`---`


`\# No Meals Tracked`


`Scenario:`


`User has not added any meals today.`


`Display:`
```

No meals tracked today.

Start by adding your first meal.


`Action:`
```

Add Meal


`---`


`\# No Water Data`


`Scenario:`


`User has not recorded water intake.`


`Display:`
```

No water intake recorded.

Track your hydration progress.


`Action:`
```

Add Water


`---`


`\# No Weight Data`


`Scenario:`


`User has never entered weight information.`


`Display:`
```

No weight data available.

Add your first measurement to track progress.


`Action:`
```

Update Weight


`---`


`\# Incomplete Profile`


`Scenario:`


`User has not completed profile information.`


`Display:`
```

Complete your profile to get personalized goals.


`Action:`
```

Complete Profile


`---`


`\# Error States`


`The Dashboard must provide user-friendly error handling.`


`---`


`\# Data Loading Failure`


`Scenario:`


`Required dashboard data cannot be retrieved.`


`Display:`
```

Unable to load your dashboard.

Please try again.


`Action:`
```

Retry


`---`


`\# Partial Data Failure`


`Scenario:`


`One widget fails while others work.`


`Example:`


`Weight data unavailable.`


`Behavior:`


`- Show error only inside affected widget.`

`- Keep remaining dashboard sections functional.`


`---`


`\# Network Error`


`Scenario:`


`User loses connection.`


`Display:`
```

Connection problem.

Check your internet connection and try again.


`---`


`\# Analytics Events`


`The Dashboard should provide events for understanding user behavior.`


`---`


`\# DASH-AN-001`


`Event:`
```

dashboard\_viewed


`Triggered when:`


`User opens Dashboard.`


`Properties:`


`- user\_id`

`- timestamp`


`---`


`\# DASH-AN-002`


`Event:`
```

quick\_action\_clicked


`Triggered when:`


`User selects a quick action.`


`Properties:`


`- action\_type`

`- timestamp`


`Examples:`


`- add\_meal`

`- add\_water`

`- update\_weight`


`---`


`\# DASH-AN-003`


`Event:`
```

widget\_interaction


`Triggered when:`


`User interacts with a dashboard widget.`


`Properties:`


`- widget\_name`

`- interaction\_type`


`---`


`\# DASH-AN-004`


`Event:`
```

dashboard\_completed


`Triggered when:`


`Dashboard successfully loads all required sections.`


`---`


`\# Testing Strategy`


`---`


`\# Unit Testing`


`Test:`


`- Progress calculations`

`- Remaining calorie calculations`

`- Macro percentage calculations`

`- Weight trend calculations`


`---`


`\# Integration Testing`


`Test:`


`- Dashboard data retrieval`

`- User authentication connection`

`- Database queries`

`- Widget data synchronization`


`---`


`\# Security Testing`


`Verify:`


`- Users cannot access other users' data`

`- RLS policies are active`

`- Unauthorized requests fail`


`---`


`\# End-to-End Testing`


`---`


`\#\# Dashboard Access Flow`


`Steps:`


`1. User logs in`

`2. User is redirected to Dashboard`

`3. Dashboard loads user information`

`4. Widgets display correct data`


`Expected:`


`Dashboard is displayed successfully.`


`---`


`\#\# Quick Action Flow`


`Steps:`


`1. User clicks Add Meal`

`2. Meal creation flow opens`

`3. User completes action`

`4. Dashboard updates`


`Expected:`


`New data appears correctly.`


`---`


`\# Acceptance Criteria`


`The Dashboard feature is complete when:`


`---`


`\#\# User Experience`


`✅ User can access Dashboard after login`


`✅ Dashboard displays personalized information`


`✅ Main metrics are understandable`


`✅ Interface works on desktop and mobile`


`---`


`\#\# Nutrition Overview`


`✅ Calories are displayed correctly`


`✅ Macronutrients are displayed correctly`


`✅ Daily progress is visible`


`---`


`\#\# Tracking Overview`


`✅ Meals are displayed`


`✅ Water progress is displayed`


`✅ Weight summary is displayed`


`---`


`\#\# Interaction`


`✅ Quick actions work correctly`


`✅ Navigation between features works`


`---`


`\#\# Performance`


`✅ Dashboard loads efficiently`


`✅ Unnecessary requests are avoided`


`---`


`\#\# Security`


`✅ User data is protected`


`✅ RLS policies are respected`


`---`


`\# Definition of Done`


`Dashboard is considered completed when:`


`---`


`\#\# Documentation`


`✅ Feature documentation completed`


`✅ UI requirements documented`


`✅ Data requirements documented`


`---`


`\#\# Frontend`


`✅ Dashboard layout implemented`


`✅ All widgets implemented`


`✅ Responsive design completed`


`✅ Loading states implemented`


`✅ Error states implemented`


`---`


`\#\# Backend`


`✅ Required queries implemented`


`✅ Data fetching optimized`


`✅ Security rules applied`


`---`


`\#\# Testing`


`✅ Unit tests completed`


`✅ Integration tests completed`


`✅ Manual testing completed`


`---`


`\#\# Review`


`✅ Code reviewed`


`✅ UI reviewed`


`✅ Documentation synchronized`


`---`


`\# Future Enhancements`


`The following features are excluded from MVP.`


`---`


`\# Advanced Analytics`


`Possible additions:`


`- Detailed nutrition trends`

`- Weekly reports`

`- Monthly insights`

`- Custom charts`


`---`


`\# AI Recommendations`


`Possible additions:`


`- Personalized suggestions`

`- Meal recommendations`

`- Goal adjustments`


`---`


`\# Dashboard Customization`


`Possible additions:`


`- Custom widgets`

`- Drag and drop layout`

`- User preferences`


`---`


`\# Health Integrations`


`Possible additions:`


`- Apple Health`

`- Google Fit`

`- Wearables`


`---`


`\# Social Features`


`Possible additions:`


`- Community progress`

`- Challenges`

`- Sharing achievements`


`---`


`\# Final Notes`


`The Dashboard is the central experience of CalorieDock.`


`It connects multiple product areas and provides users with a simple overview of their daily progress.`


`The Dashboard should always prioritize:`


`1. Clear information`

`2. Fast access to important actions`

`3. Personalization`

`4. Consistent user experience`


`Future features should extend the Dashboard without making it complex or overwhelming.`
```

