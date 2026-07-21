# F002 — User Profile


## Metadata

| Property | Value |
| - | - |
| Feature ID | F002 |
| Feature Name | User Profile |
| Version | 1.0 |
| Status | Planned |
| Priority | Critical |
| Product Version | MVP (v1.0) |
| Owner | CodeAnchor |
| Product | CalorieDock |
| Dependencies | F001 Authentication |
| Blocks | Dashboard, Goals, Analytics, Personalization |
| Estimated Complexity | Medium |
| Last Updated | 2026-07-10 |



# Executive Summary

User Profile is the feature responsible for storing and managing user-specific information required for personalization of the CalorieDock experience.

While Authentication manages user identity and account access, User Profile manages application-level user data.

The profile system allows CalorieDock to understand user context and provide personalized calorie tracking, progress monitoring, and future recommendations.

The profile represents the foundation for:

- Personalized calorie goals

- Progress tracking

- Dashboard customization

- Analytics

- Future AI recommendations

The feature must remain flexible because user data requirements may expand as CalorieDock evolves.


# Business Objectives

## Primary Objectives

The User Profile feature aims to:

- Store essential user information.

- Personalize the user experience.

- Provide required data for calorie calculations.

- Support future health and fitness features.

- Allow users to manage their personal information.


## Secondary Objectives

- Create a foundation for personalization.

- Support future AI recommendations.

- Enable accurate analytics.

- Support multiple measurement systems.


## Non-Objectives

User Profile does not manage:

- Authentication credentials

- Passwords

- Meals

- Food entries

- Weight history

- Water tracking records

- Subscription information

- Notifications

Those belong to separate features.


# Scope

## Included

User Profile includes:

- Profile creation after registration

- Personal information

- Physical information

- Activity level

- Goal selection

- Measurement preferences

- Profile editing

- Profile viewing


## Excluded

The following are not part of MVP:

- Social profiles

- Public profiles

- Friends/followers

- Profile sharing

- Advanced biometric data

- Medical information


# User Profile Data

The profile contains:

## Basic Information

- Full Name

- Date of Birth

- Gender (optional)

- Profile Picture (future)


## Physical Information

- Height

- Current Weight

- Measurement Units


## Lifestyle Information

- Activity Level

- Goal Type


## Application Preferences

- Weight unit

- Height unit

- Language preference (future)


# Dependencies

## Depends On

### F001 Authentication

Required because:

- Every profile belongs to an authenticated user.

- Profile ownership depends on authenticated user ID.


## Used By

### Dashboard

Uses profile data for:

- Greeting

- Summary information

- Personalization


### Meal Tracking

Uses profile information for:

- Calorie targets

- Nutritional calculations


### Analytics

Uses profile information for:

- Progress analysis

- Goal tracking


# User Roles

## Guest User

Cannot access profile.


## Authenticated User

Can:

- Create profile

- View profile

- Edit profile

- Update personal information


## Administrator

Not included in MVP.


# Functional Requirements

Each requirement has a unique identifier for traceability.


## PROFILE-FR-001

The system shall automatically create a profile record after successful user registration.

Priority: Critical


## PROFILE-FR-002

The system shall associate every profile with exactly one authenticated user.

Priority: Critical


## PROFILE-FR-003

The system shall allow authenticated users to view their profile information.

Priority: Critical


## PROFILE-FR-004

The system shall allow authenticated users to edit their profile information.

Priority: Critical


## PROFILE-FR-005

The system shall allow users to update their full name.

Priority: High


## PROFILE-FR-006

The system shall allow users to provide their date of birth.

Priority: Medium


## PROFILE-FR-007

The system shall allow users to optionally provide gender information.

Priority: Medium


## PROFILE-FR-008

The system shall allow users to provide height information.

Priority: Critical


## PROFILE-FR-009

The system shall allow users to provide current weight information.

Priority: Critical


## PROFILE-FR-010

The system shall allow users to select their preferred measurement system.

Supported systems:

- Metric (kg, cm)

- Imperial (lb, ft)

Priority: High


## PROFILE-FR-011

The system shall allow users to select their activity level.

Priority: Critical


## PROFILE-FR-012

The system shall allow users to select their primary fitness goal.

Priority: Critical


## PROFILE-FR-013

The system shall store profile updates with timestamps.

Priority: Medium


## PROFILE-FR-014

The system shall validate profile data before saving changes.

Priority: Critical


## PROFILE-FR-015

The system shall prevent unauthorized users from accessing another user's profile.

Priority: Critical


## PROFILE-FR-016

The system shall allow incomplete profiles during initial registration.

Priority: High


## PROFILE-FR-017

The system shall track profile completion status.

Priority: Medium


## PROFILE-FR-018

The system shall display profile completion progress during onboarding.

Priority: Medium


## PROFILE-FR-019

The system shall support future profile fields without requiring database redesign.

Priority: Medium


## PROFILE-FR-020

The system shall provide default values where appropriate.

Priority: Medium


# User Stories

## New User

### PROFILE-US-001

As a newly registered user,

I want to complete my profile,

so that CalorieDock can personalize my experience.


### PROFILE-US-002

As a new user,

I want to enter my height and weight,

so that the application can calculate relevant nutrition information.


### PROFILE-US-003

As a new user,

I want to select my goal,

so that I can receive appropriate calorie targets.


## Existing User

### PROFILE-US-004

As an existing user,

I want to update my personal information,

so that my profile remains accurate.


### PROFILE-US-005

As an existing user,

I want to change my measurement units,

so that the application matches my preferences.


### PROFILE-US-006

As an existing user,

I want my profile changes to be saved securely,

so that my information remains consistent.


# User Flows

## Initial Profile Creation Flow

User registers

↓

Authentication completed

↓

Profile record created

↓

Redirect to onboarding

↓

User enters basic information

↓

User enters physical information

↓

User selects goal

↓

User selects activity level

↓

Validation

↓

Save Profile

↓

Dashboard Access


# Profile Editing Flow

Authenticated User

↓

Open Profile Settings

↓

View Current Data

↓

Edit Information

↓

Submit Changes

↓

Validate Data

↓

Update Database

↓

Display Success Message


# Profile Completion Flow

New User

↓

Profile Incomplete

↓

Show Completion Reminder

↓

Complete Missing Fields

↓

Profile Completed

↓

Unlock Personalized Experience


# Activity Level

The system shall support predefined activity levels.

## Sedentary

Little or no exercise.


## Lightly Active

Light exercise or movement 1-3 days per week.


## Moderately Active

Moderate exercise 3-5 days per week.


## Very Active

Hard exercise 6-7 days per week.


## Extremely Active

High physical activity or intensive training.


# Goal Types

The system shall support:

## Weight Loss

User wants to reduce body weight.


## Maintenance

User wants to maintain current weight.


## Weight Gain

User wants to increase body weight.


Future goals:

- Muscle Gain

- Performance

- Custom Goals


# Business Rules

## PROFILE-BR-001

Every authenticated user must have exactly one profile.


## PROFILE-BR-002

Profile data belongs only to the owner.


## PROFILE-BR-003

Users cannot modify another user's profile.


## PROFILE-BR-004

Profile completion is required before advanced personalization.


## PROFILE-BR-005

Changes to profile information may affect calorie calculations.

Example:

Changing:

- Weight

- Height

- Activity Level

- Goal

may require recalculating daily calorie targets.

# Database Impact

User Profile introduces the application-level user information layer.

Authentication data is managed by Supabase Auth.

Profile data is managed by CalorieDock.

The separation ensures:

- Secure authentication management

- Clean database architecture

- Easier future expansion

- Better privacy control


# Database Schema

## profiles Table

Purpose:

Stores application-specific information about authenticated users.


## Table: profiles

| Column | Type | Required | Description |
| - | - | - | - |
| id | UUID | Yes | References auth.users.id |
| full\_name | TEXT | No | User display name |
| date\_of\_birth | DATE | No | User birthday |
| gender | TEXT | No | Optional gender information |
| height | DECIMAL | No | User height |
| weight | DECIMAL | No | Current weight |
| activity\_level | TEXT | No | User activity classification |
| goal | TEXT | No | User fitness goal |
| unit\_system | TEXT | Yes | Metric or Imperial |
| profile\_completed | BOOLEAN | Yes | Completion status |
| created\_at | TIMESTAMP | Yes | Creation timestamp |
| updated\_at | TIMESTAMP | Yes | Last update timestamp |



# Database Relationship

## User Relationship

```
auth.users  
  
      1  
  
      |  
  
      1  
  
profiles
```

Each authentication account has exactly one profile.


## Future Relationships

```
profiles  
  
    |  
  
    |--- meals  
  
    |  
  
    |--- weight\_tracking  
  
    |  
  
    |--- water\_tracking  
  
    |  
  
    |--- achievements  
  
    |  
  
    |--- analytics
```

The profile acts as the root entity for all user-owned data.


# Database Constraints

## ID Constraint

The profile ID must match the authenticated user ID.


## Required Fields

MVP required fields:

- id

- unit\_system

- profile\_completed

- created\_at

- updated\_at


## Unique Constraint

A user can only have one profile.

Constraint:

```
profiles.id UNIQUE
```


# Automatic Profile Creation

After successful registration:

Authentication creates:

```
auth.users
```

↓

Database trigger creates:

```
profiles
```

with default values.

Example:

```
unit\_system = metric  
  
profile\_completed = false
```


# Row Level Security (RLS)

Because profiles contain personal data, RLS is mandatory.


# RLS Policies

## SELECT Policy

Users can view only their own profile.

Rule:

```
auth.uid() = id
```


## UPDATE Policy

Users can update only their own profile.

Rule:

```
auth.uid() = id
```


## INSERT Policy

Users can create only their own profile.

Rule:

```
auth.uid() = id
```


## DELETE Policy

Profile deletion is not available in MVP.

Future implementation must include:

- Account deletion

- Data removal

- Privacy compliance


# Security Considerations

## Personal Data Protection

Profile information must:

- Never be publicly accessible

- Never be exposed without authentication

- Always be protected by RLS


## Client Security

The frontend must never:

- Trust profile ownership from client input

- Allow changing user ID

- Bypass authorization checks


## Server Security

The backend must:

- Validate authenticated sessions

- Verify ownership

- Handle database errors safely


# Validation Rules

## Full Name

Rules:

- Optional in MVP

- Maximum length: 100 characters

- Cannot contain invalid characters


## Date of Birth

Rules:

- Must be a valid date

- Cannot be in the future

- User age must be realistic


## Height

Metric:

```
Minimum: 50 cm  
Maximum: 250 cm
```

Imperial:

```
Minimum: 1.5 ft  
Maximum: 8.2 ft
```


## Weight

Metric:

```
Minimum: 20 kg  
Maximum: 500 kg
```

Imperial:

```
Minimum: 44 lb  
Maximum: 1100 lb
```


## Activity Level

Allowed values:

```
sedentary  
  
lightly\_active  
  
moderately\_active  
  
very\_active  
  
extremely\_active
```


## Goal

Allowed values:

```
weight\_loss  
  
maintenance  
  
weight\_gain
```


## Unit System

Allowed values:

```
metric  
  
imperial
```


# API Design

User Profile uses Supabase client/server interaction.


## Get Profile

Purpose:

Retrieve authenticated user's profile.

Input:

Authenticated session

Output:

Profile object


## Create Profile

Purpose:

Create initial profile data.

Input:

Profile fields

Output:

Created profile


## Update Profile

Purpose:

Modify existing profile.

Input:

Changed fields

Output:

Updated profile


## Check Profile Completion

Purpose:

Determine if onboarding is complete.

Output:

Boolean status

Example:

```
profile\_completed = true
```


# Technical Decisions

## Decision 001

Profile data separated from authentication.

Status:

Accepted

Reason:

Clear separation of responsibilities.


## Decision 002

One profile per user.

Status:

Accepted

Reason:

Simplifies relationships and ownership.


## Decision 003

RLS enabled from the beginning.

Status:

Accepted

Reason:

Security must exist from the first version.


## Decision 004

Profile completion tracked explicitly.

Status:

Accepted

Reason:

Supports onboarding flow and future personalization.


# UI/UX Requirements

The User Profile experience must be simple, clear, and user-friendly.

The goal is to collect necessary information while minimizing user friction.


# Profile Onboarding

## Purpose

Guide new users through profile completion after registration.


## Onboarding Principles

The onboarding process should:

- Avoid overwhelming users

- Collect only necessary MVP information

- Explain why information is needed

- Allow future expansion


# Onboarding Steps

## Step 1 — Basic Information

Fields:

- Full Name

- Date of Birth (optional)

- Gender (optional)

Purpose:

Create a personalized experience.


## Step 2 — Physical Information

Fields:

- Height

- Current Weight

- Measurement System

Purpose:

Enable calorie calculations.


## Step 3 — Lifestyle Information

Fields:

- Activity Level

- Goal

Purpose:

Generate personalized recommendations.


## Step 4 — Completion

Display:

- Profile completion status

- Confirmation message

- Continue to Dashboard button


# Profile Page

## Purpose

Allow users to view their personal information.


## Required Sections

### Personal Information

Displays:

- Full Name

- Date of Birth

- Gender


### Body Information

Displays:

- Height

- Weight

- Units


### Goals

Displays:

- Activity Level

- Current Goal


# Edit Profile Page

Users can modify:

- Personal information

- Physical information

- Goals

- Units


# Loading States

The system must provide loading states during:

- Profile retrieval

- Profile creation

- Profile update

Examples:

- Skeleton UI

- Disabled buttons

- Loading indicators


# Empty States

Possible empty states:

## Profile Not Completed

Message:

"Complete your profile to personalize your CalorieDock experience."

Action:

Complete Profile button


## Missing Optional Data

The system should not block users.

Example:

Missing birthday.

Display:

"Add your birthday for a more personalized experience."


# Error States

## Failed Profile Loading

Display:

"Unable to load your profile. Please try again."


## Failed Profile Update

Display:

"Your changes could not be saved. Please try again."


## Invalid Data

Display:

"Please check your information and try again."


# Responsive Requirements

Profile pages must support:

- Desktop

- Tablet

- Mobile

Mobile experience must prioritize:

- Large touch targets

- Simple forms

- Clear navigation


# Testing Strategy

## Unit Testing

Test:

- Validation functions

- Profile calculations

- Data formatting

- Completion logic


## Integration Testing

Test:

- Profile creation

- Profile retrieval

- Profile update

- Database synchronization


## Security Testing

Verify:

- Users cannot access other profiles

- RLS policies work correctly

- Unauthorized requests fail


## End-to-End Testing

Critical flows:


### New User Onboarding

Register

↓

Create Profile

↓

Complete Information

↓

Dashboard Access


### Update Profile

Open Profile

↓

Edit Data

↓

Save Changes

↓

Updated Information Displayed


# Acceptance Criteria

User Profile is complete when:


## Profile Creation

✅ Profile is automatically created after registration

✅ Profile belongs to correct user

✅ Default values are applied


## Profile Management

✅ User can view profile

✅ User can edit profile

✅ Changes are saved correctly


## Data Validation

✅ Invalid values are rejected

✅ Correct formats are enforced


## Security

✅ RLS protects user data

✅ Users cannot access other profiles


## User Experience

✅ Onboarding is understandable

✅ Responsive design works

✅ Error states are handled


# Definition of Done

User Profile is considered finished when:


## Documentation

✅ Feature documentation completed

✅ Database design documented


## Frontend

✅ Onboarding screens implemented

✅ Profile page implemented

✅ Edit profile implemented


## Backend

✅ Database table created

✅ Supabase integration completed

✅ RLS policies enabled


## Testing

✅ Automated tests completed

✅ Manual testing completed


## Review

✅ Code reviewed

✅ Documentation synchronized


# Future Enhancements

The following features are excluded from MVP.


## Profile Picture

Possible additions:

- Avatar upload

- Image optimization

- Storage integration


## Advanced Personal Data

Possible additions:

- Body measurements

- Body composition

- Fitness level


## External Integrations

Possible additions:

- Apple Health

- Google Fit

- Wearables


## AI Personalization

Possible additions:

- AI nutrition recommendations

- Adaptive goals

- Smart suggestions


## Public Profiles

Possible additions:

- Sharing progress

- Community features

- Social interactions


# Final Notes

User Profile represents the personalization foundation of CalorieDock.

Authentication establishes user identity.

User Profile transforms that identity into a personalized application experience.

Every future feature that depends on user context should use this profile system as the source of user information.

