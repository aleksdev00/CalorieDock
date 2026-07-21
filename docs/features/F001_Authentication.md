# F001 — Authentication


## Metadata

| Property | Value |
| - | - |
| Feature ID | F001 |
| Feature Name | Authentication |
| Version | 1.0 |
| Status | Planned |
| Priority | Critical |
| Product Version | MVP (v1.0) |
| Owner | CodeAnchor |
| Product | CalorieDock |
| Dependencies | None |
| Blocks | Every authenticated feature |
| Estimated Complexity | High |
| Last Updated | 2026-07-10 |



# Executive Summary

Authentication is the foundational feature of the CalorieDock platform.

Its purpose is to securely identify users and provide controlled access to protected resources within the application.

Every feature requiring user-specific data depends on a successful authentication process.

This feature uses Supabase Authentication as the authentication provider and integrates with Next.js App Router to provide secure session management, protected routes, email verification, password recovery, and persistent authentication.

Authentication is intentionally responsible only for identity management.

It does not manage user profile information, nutrition data, goals, meals, preferences, subscription details, or analytics.

Those responsibilities belong to dedicated features.

The Authentication system must be:

- Secure

- Reliable

- Scalable

- Maintainable

- Easy to use

Authentication represents the security foundation of the entire CalorieDock ecosystem.


# Business Objectives

## Primary Objectives

- Allow users to securely register an account.

- Allow users to securely sign in.

- Allow users to securely sign out.

- Verify ownership of email addresses.

- Allow users to recover forgotten passwords.

- Maintain secure authentication sessions.

- Protect private application resources.

- Prevent unauthorized access.


## Secondary Objectives

- Reduce friction during onboarding.

- Prepare for future OAuth providers.

- Support future mobile applications.

- Support future premium functionality.


## Non-Objectives

Authentication will NOT manage:

- User profile

- User goals

- Meals

- Water tracking

- Weight tracking

- Preferences

- Subscription management

- Admin permissions

Those responsibilities belong to other features.


# Scope

## Included

The Authentication feature includes:

- Email registration

- Email login

- Logout

- Forgot password

- Password reset

- Email verification

- Session persistence

- Automatic token refresh

- Protected routes

- Authentication middleware

- Authentication state management


## Excluded

Authentication does not include:

### User Profile

- Name

- Avatar

- Height

- Weight

- Birthday

- Activity Level

- Goals


### Settings

- Theme

- Language

- Units


### Premium

- Subscription

- Payments

- Billing


### Administration

- Roles

- Permissions

- Admin Dashboard


# Dependencies

## Depends On

None.

Authentication is the first feature implemented.


## Required Infrastructure

- Next.js App Router

- Supabase Authentication

- PostgreSQL

- Environment Variables

- Vercel


## Required Documentation

- Architecture

- Database

- Coding Standards

- Developer Handbook

- Testing Strategy


# User Roles

## Guest

A guest user has not authenticated.

Allowed actions:

- View Landing Page

- Register

- Login

- Reset Password

- Verify Email

Restricted actions:

- Dashboard

- Meals

- Progress

- Weight Tracking

- Water Tracking

- Settings


## Authenticated User

An authenticated user has successfully completed authentication.

Allowed actions:

- Access Dashboard

- Track Meals

- Track Water

- Track Weight

- Manage Profile

- Manage Settings

- Access Premium Features (future)


## Administrator

Not part of MVP.

Administrative authentication will be implemented in a future feature.


# Functional Requirements

Each requirement below has a unique identifier for traceability.


## AUTH-FR-001

The system shall allow users to create an account using an email address and password.

Priority: Critical


## AUTH-FR-002

The system shall require email verification before granting full access to protected application resources.

Priority: Critical


## AUTH-FR-003

The system shall prevent duplicate email registrations.

Priority: Critical


## AUTH-FR-004

The system shall securely hash passwords using Supabase Authentication.

The application must never store plaintext passwords.

Priority: Critical


## AUTH-FR-005

The system shall allow verified users to sign in using email and password.

Priority: Critical


## AUTH-FR-006

The system shall provide meaningful error messages for failed authentication attempts without exposing sensitive information.

Priority: High


## AUTH-FR-007

The system shall allow authenticated users to securely sign out.

Priority: Critical


## AUTH-FR-008

The system shall persist authenticated sessions across browser refreshes.

Priority: Critical


## AUTH-FR-009

The system shall automatically refresh expired access tokens whenever possible.

Priority: Critical


## AUTH-FR-010

The system shall redirect unauthenticated users attempting to access protected pages to the Login page.

Priority: Critical


## AUTH-FR-011

The system shall support secure password recovery via email.

Priority: Critical


## AUTH-FR-012

The system shall invalidate password reset links after successful use or expiration.

Priority: High


## AUTH-FR-013

The system shall prevent access to authentication pages when the user is already authenticated.

Priority: Medium


## AUTH-FR-014

The system shall synchronize authentication state across browser tabs.

Priority: Medium


## AUTH-FR-015

The system shall terminate invalid or expired sessions automatically.

Priority: Critical


# Functional Requirements (Continued)

## AUTH-FR-016

The system shall automatically redirect authenticated users to the Dashboard after successful login.

Priority: Critical


## AUTH-FR-017

The system shall automatically redirect newly registered users to the Email Verification page until their email address has been verified.

Priority: Critical


## AUTH-FR-018

The system shall prevent users from accessing protected routes if their authentication session is invalid.

Priority: Critical


## AUTH-FR-019

The system shall immediately update the application state after login, logout, password reset, or email verification.

Priority: High


## AUTH-FR-020

The system shall display loading indicators while authentication requests are in progress.

Priority: High


## AUTH-FR-021

The system shall disable form submission while an authentication request is being processed.

Priority: High


## AUTH-FR-022

The system shall validate all authentication input before sending requests to Supabase.

Priority: Critical


## AUTH-FR-023

The system shall trim leading and trailing whitespace from email inputs.

Priority: Medium


## AUTH-FR-024

The system shall normalize email addresses before authentication.

Priority: Medium


## AUTH-FR-025

The system shall support authentication on desktop, tablet, and mobile devices.

Priority: High


## AUTH-FR-026

The system shall support browser session restoration after accidental page refresh.

Priority: High


## AUTH-FR-027

The system shall gracefully handle temporary network failures.

Priority: High


## AUTH-FR-028

The system shall display user-friendly authentication error messages.

Priority: High


## AUTH-FR-029

The system shall never expose internal authentication errors to end users.

Priority: Critical


## AUTH-FR-030

The system shall use HTTPS in all production environments.

Priority: Critical


## AUTH-FR-031

The system shall authenticate users only through Supabase Authentication.

Priority: Critical


## AUTH-FR-032

The system shall maintain compatibility with future OAuth providers.

Priority: Medium


## AUTH-FR-033

The system shall support future Two-Factor Authentication without requiring architectural redesign.

Priority: Low


## AUTH-FR-034

The system shall log authentication failures for future monitoring.

Priority: Medium


## AUTH-FR-035

The authentication architecture shall remain modular and maintainable.

Priority: High


# User Stories

## Guest User

### AUTH-US-001

As a guest, I want to create a new account, so that I can start using CalorieDock.


### AUTH-US-002

As a guest, I want to verify my email, so that I can activate my account.


### AUTH-US-003

As a guest, I want to sign into my account, so that I can access my personal dashboard.


### AUTH-US-004

As a guest, I want to recover my forgotten password, so that I can regain access to my account.


## Authenticated User

### AUTH-US-005

As an authenticated user, I want my session to persist, so that I don't need to log in repeatedly.


### AUTH-US-006

As an authenticated user, I want to securely log out, so that nobody else can access my account.


### AUTH-US-007

As an authenticated user, I want to automatically remain logged in while my session is valid, so that my experience feels seamless.


# User Flow

## Registration Flow

Guest

↓

Open Register Page

↓

Enter Email

↓

Enter Password

↓

Confirm Password

↓

Submit Form

↓

Validate Input

↓

Create User (Supabase)

↓

Verification Email Sent

↓

Display Verification Screen

↓

User Clicks Email Link

↓

Email Verified

↓

Redirect to Login

↓

Login

↓

Dashboard


## Login Flow

Guest

↓

Open Login Page

↓

Enter Email

↓

Enter Password

↓

Validate Input

↓

Authenticate with Supabase

↓

Authentication Successful

↓

Session Created

↓

Redirect to Dashboard


Authentication Failed

↓

Display Error

↓

Stay on Login Page


## Forgot Password Flow

Guest

↓

Open Forgot Password

↓

Enter Email

↓

Submit

↓

Send Password Reset Email

↓

Display Confirmation

↓

User Opens Email

↓

Clicks Reset Link

↓

Open Reset Password Page

↓

Enter New Password

↓

Confirm Password

↓

Password Updated

↓

Redirect to Login


## Logout Flow

Authenticated User

↓

Click Logout

↓

Invalidate Session

↓

Clear Local Authentication State

↓

Redirect to Landing Page


## Session Flow

User Logs In

↓

Session Created

↓

JWT Stored Securely by Supabase

↓

Access Protected Routes

↓

Token Near Expiration

↓

Automatic Refresh

↓

Continue Session

↓

Logout

↓

Session Destroyed

↓

Protected Routes Become Inaccessible


# Authentication States

The application shall recognize the following authentication states.

## Unauthenticated

User has no active session.


## Loading

Authentication state is being determined.


## Authenticated

User has a valid authenticated session.


## Email Verification Pending

Account exists but email is not verified.


## Password Recovery

User is resetting their password.


## Session Expired

User session has expired and requires re-authentication.


## Authentication Error

Authentication failed due to validation, credentials, network issues, or unexpected server errors.


# Security Model

Authentication is the first security boundary of CalorieDock.

Every protected resource depends on a successfully authenticated user.

The application follows the principle of **Zero Trust**.

Every request must be authenticated before access is granted.

Authentication is delegated to Supabase Authentication while authorization is enforced through PostgreSQL Row Level Security (RLS).


## Security Principles

Authentication must follow these principles:

- Never trust client input.

- Validate every request.

- Never store passwords.

- Never expose sensitive information.

- Minimize attack surface.

- Follow the Principle of Least Privilege.

- Protect user privacy.

- Secure every communication using HTTPS.


## Authentication Provider

Authentication Provider:

Supabase Authentication

Authentication Methods (MVP):

- Email

- Password

Future Authentication Providers:

- Google OAuth

- Apple Sign In

- GitHub OAuth

These providers are intentionally excluded from MVP.


## Password Security

Passwords are never stored by the application.

Responsibilities delegated to Supabase:

- Password hashing

- Salt generation

- Secure storage

- Password verification

Application responsibilities:

- Validate password strength

- Display validation feedback

- Prevent weak passwords

- Never log passwords

- Never cache passwords

- Never expose passwords


## Email Verification

Email verification is mandatory.

New accounts remain inactive until the user confirms ownership of their email address.

Benefits:

- Prevent fake accounts

- Reduce spam

- Verify ownership

- Improve security

Flow:

Register

↓

Verification Email

↓

Email Link

↓

Email Verified

↓

User Can Login


## Session Management

Supabase manages authenticated sessions.

The application is responsible for:

- Reading session state

- Updating UI

- Protecting routes

- Reacting to authentication changes

The application must never manually generate authentication tokens.


## Session Lifecycle

Login

↓

Access Token Created

↓

Refresh Token Created

↓

User Authenticated

↓

Access Protected Resources

↓

Automatic Token Refresh

↓

Continue Session

↓

Logout

↓

Session Destroyed


## Session Timeout

Expired sessions must:

- Remove protected access

- Redirect user to Login

- Preserve intended destination when appropriate

Users must never access protected resources using expired sessions.


## Logout

Logout must:

- Destroy active session

- Remove local authentication state

- Refresh UI

- Redirect user

Logout must invalidate authentication immediately.


## Route Protection

The following pages require authentication:

- Dashboard

- Meals

- Progress

- Water Tracking

- Weight Tracking

- Profile

- Settings

Public pages:

- Landing

- Login

- Register

- Forgot Password

- Reset Password


## Authorization

Authentication determines WHO the user is.

Authorization determines WHAT the user may access.

Authorization is implemented using:

- Supabase Row Level Security

- User ID ownership

- Protected API access


## Row Level Security (RLS)

Every application table containing user data must enable RLS.

Example:

Users may only access rows where:

owner\_id == auth.uid()

The application must never bypass RLS.


## JWT

JWT tokens are managed by Supabase.

The application must:

- Trust validated tokens only

- Never modify JWT contents

- Never store custom JWT copies

- Never expose JWTs to the UI


## Middleware

Next.js Middleware is responsible for:

- Detecting authentication state

- Redirecting guests

- Protecting routes

- Preventing unauthorized access

Middleware should execute before rendering protected pages.


## Authentication State

Authentication state should be centralized.

Components should never manage authentication independently.

A single authentication provider should expose:

- Current user

- Session

- Loading state

- Authentication status


# Database Impact

Authentication itself relies on Supabase Auth.

The application database extends authentication using additional tables.


## auth.users

Managed entirely by Supabase.

Contains:

- User ID

- Email

- Authentication metadata

- Account timestamps

Application code must never modify this table directly.


## profiles

Managed by CalorieDock.

References:

auth.users.id

Relationship:

auth.users (1)

↓

profiles (1)

The profile record stores application-specific information only.


## Database Relationship

auth.users

↓

profiles

↓

Meals

↓

Meal Items

↓

Daily Summary

↓

Analytics

Authentication always represents the root of the user data hierarchy.


# API Design

Authentication APIs are provided by Supabase.

The application interacts through the official SDK.


## Register

Purpose:

Create a new account.

Input:

- Email

- Password

Output:

- Success

- Verification Email Sent


## Login

Purpose:

Authenticate existing user.

Input:

- Email

- Password

Output:

- Session

- User


## Logout

Purpose:

Destroy active session.

Output:

Session removed.


## Forgot Password

Purpose:

Initiate password recovery.

Input:

Email

Output:

Password reset email.


## Reset Password

Purpose:

Create a new password.

Input:

- New Password

- Reset Token

Output:

Password updated.


## Get Current User

Purpose:

Retrieve authenticated user.

Output:

Authenticated user information.


## Refresh Session

Purpose:

Refresh authentication tokens automatically.

Handled internally by Supabase.

No manual implementation required.


# Technical Decisions

## Decision 001

Authentication provider:

Supabase Auth

Status:

Accepted

Reason:

Reliable, secure, production-ready.


## Decision 002

Authentication Method:

Email + Password

Status:

Accepted

Reason:

Simplest MVP solution.


## Decision 003

Email verification is mandatory.

Status:

Accepted

Reason:

Improves account quality and security.


## Decision 004

Authentication is separated from User Profile.

Status:

Accepted

Reason:

Separation of concerns.


## Decision 005

Authorization is enforced using Row Level Security.

Status:

Accepted

Reason:

Database-level security.


# UI/UX Requirements

## Design Principles

Authentication interface must prioritize:

- Simplicity

- Clarity

- Trust

- Speed

- Accessibility

The user should understand every step without confusion.


# Authentication Pages

## Login Page

Purpose:

Allow existing users to access their accounts.

Required elements:

- Email input

- Password input

- Show/hide password option

- Login button

- Forgot password link

- Register link

Optional future elements:

- OAuth buttons

- Remember device option


## Register Page

Purpose:

Allow new users to create an account.

Required elements:

- Email input

- Password input

- Confirm password input

- Password requirements indicator

- Register button

- Link to Terms of Service

- Link to Privacy Policy

- Login link


## Email Verification Page

Purpose:

Inform users that verification is required.

Required elements:

- Verification status

- User email display

- Resend verification button

- Continue instruction


## Forgot Password Page

Purpose:

Allow users to request password recovery.

Required elements:

- Email input

- Submit button

- Success message


## Reset Password Page

Purpose:

Allow users to create a new password.

Required elements:

- New password input

- Confirm password input

- Password validation

- Submit button


# Responsive Requirements

Authentication pages must support:

- Desktop

- Tablet

- Mobile

The interface must remain usable on small screens.


# Accessibility Requirements

Authentication must follow accessibility principles.

Required:

- Proper labels for inputs

- Keyboard navigation

- Visible focus states

- Screen reader compatibility

- Clear error messages

- Sufficient contrast


# Validation Rules

## Email Validation

Requirements:

- Must contain valid email format

- Cannot be empty

- Automatically trimmed

- Normalized before submission

Example:

```
user@example.com
```

Invalid:

```
user@  
example
```


## Password Validation

Minimum requirements:

- Minimum 8 characters

- Contains at least one uppercase letter

- Contains at least one lowercase letter

- Contains at least one number

Future improvements:

- Special characters

- Password strength meter

- Breached password detection


## Confirm Password Validation

Rules:

- Required

- Must match password field


## Form Validation

Validation must happen:

1. Client side

2. Server side

Client validation improves UX.

Server validation guarantees security.


# Error Handling

Authentication errors must be handled gracefully.

The system must never expose internal technical details.


## Invalid Credentials

Example:

User enters incorrect email/password.

Display:

"Invalid email or password."

Do not reveal:

- Whether email exists

- Which credential was incorrect


## Email Already Exists

Display:

"An account with this email may already exist."

Avoid exposing unnecessary account information.


## Weak Password

Display:

"Password does not meet security requirements."


## Network Error

Display:

"Unable to connect. Please try again."


## Expired Session

Action:

- Clear invalid session

- Redirect user to login


## Unexpected Error

Display:

"Something went wrong. Please try again later."

Log technical details internally.


# Edge Cases

## User Registers But Does Not Verify Email

Expected behavior:

- Account remains inactive

- User can request verification email again

- User cannot access protected features


## User Opens Expired Password Reset Link

Expected behavior:

- Display expiration message

- Offer new reset request


## User Has Multiple Browser Tabs Open

Expected behavior:

Authentication state synchronizes between tabs.


## User Loses Internet During Login

Expected behavior:

- Show connection error

- Allow retry


## User Logs Out In One Tab

Expected behavior:

Other active tabs detect logout.


## User Accesses Protected Route Directly

Example:

User opens:

```
/dashboard
```

without authentication.

Expected:

Redirect to:

```
/login
```


# Testing Strategy

## Unit Testing

Test:

- Validation functions

- Authentication utilities

- Error handling logic


## Integration Testing

Test:

- Registration flow

- Login flow

- Logout flow

- Password recovery

- Session restoration


## End-to-End Testing

Critical user journeys:

### Registration

Guest

↓

Register

↓

Verify Email

↓

Login

↓

Dashboard


### Login

User

↓

Login

↓

Dashboard Access


### Password Recovery

User

↓

Forgot Password

↓

Reset Password

↓

Login


## Security Testing

Verify:

- Protected routes cannot be accessed without authentication

- User data isolation works

- Sessions expire correctly

- Invalid tokens are rejected

- RLS policies function correctly


# Acceptance Criteria

Authentication is considered complete when:


## Registration

✅ User can create an account

✅ Verification email is sent

✅ Duplicate accounts are prevented


## Login

✅ Valid users can login

✅ Invalid credentials are handled

✅ Session is created


## Logout

✅ User can logout

✅ Session is destroyed

✅ Protected access is removed


## Password Recovery

✅ Reset email can be requested

✅ Password can be changed

✅ Old credentials no longer work


## Security

✅ Passwords are never stored by application

✅ Routes are protected

✅ RLS policies are configured

✅ Authentication state is secure


## User Experience

✅ Responsive design works

✅ Loading states exist

✅ Error messages are understandable


# Future Enhancements

The following improvements are intentionally excluded from MVP.


## OAuth Providers

Possible additions:

- Google

- Apple

- GitHub

Version:

Future release


## Multi-Factor Authentication

Possible additions:

- Authenticator apps

- Email codes

- Security keys

Version:

Future release


## Passkeys

Possible addition:

Passwordless authentication.

Version:

Future release


## Advanced Security Monitoring

Possible additions:

- Suspicious login detection

- Device management

- Login history

Version:

Future release


# Definition of Done

Authentication feature is complete when:

## Documentation

✅ Feature documentation completed

✅ Architecture updated if required


## Frontend

✅ All authentication screens implemented

✅ Forms validated

✅ Responsive UI completed


## Backend

✅ Supabase Auth configured

✅ Session handling implemented

✅ Protected routes implemented


## Security

✅ RLS policies verified

✅ Sensitive information protected


## Testing

✅ Automated tests completed

✅ Manual testing completed


## Review

✅ Code review completed

✅ Documentation synchronized


# Final Notes

Authentication is the foundation of the CalorieDock platform.

All future features depend on a stable and secure identity system.

The implementation should prioritize correctness and security over speed.

A strong authentication foundation enables the platform to scale safely as new functionality is introduced.

