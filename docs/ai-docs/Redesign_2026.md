# CalorieDock redesign

## Implemented visual refresh — October 2026

The UI uses a soft lavender-neutral canvas, Akodo purple primary actions (`#6A4A9E`, sampled from the supplied logo), white cards and matching dark-mode tokens. The Today dashboard prioritizes recorded calories, macros and a single prominent Add meal action. Water and weight cards retain entry and history shortcuts.

Navigation labels the dashboard Today, keeps every existing route available and provides four persistent mobile shortcuts plus a full Menu. Mobile content reserves space for the bottom navigation and safe area.

The public landing page uses one readable representative dashboard preview, three core feature cards and the existing registration flow. The shared NutritionOverview component presents the same recorded totals on the real dashboard and in the labeled public sample. It does not invent targets, percentages or remaining calories: numeric goals are absent from the approved MVP data model.

Meal creation explains its existing two-stage flow (create meal, then add foods). Existing validation, server actions, ownership checks and nutrition calculations remain authoritative. No analytics, AI features, meal templates or database changes are introduced by this refresh.

The Akodo purple variant applies the brand accent through shared semantic tokens, including buttons, calorie cards, active navigation, focus rings and the public preview. Dark mode uses a lighter violet accent with a deep purple canvas for readable contrast. Secondary macro colors remain distinct so nutrients can be scanned quickly.
