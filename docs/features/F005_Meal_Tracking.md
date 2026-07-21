```
`\# F005 — Meal Tracking`
```


`\*\*Feature ID:\*\* F005  `

`\*\*Feature Name:\*\* Meal Tracking  `

`\*\*Category:\*\* Core MVP Feature  `

`\*\*Priority:\*\* Critical  `

`\*\*Status:\*\* Planned  `


`---`


`\# 1. Feature Overview`


`Meal Tracking is the core functionality of CalorieDock that allows users to record, manage, and analyze their daily food intake.`


`This feature connects the Food Database with the user's daily nutrition activity.`


`Users can:`


`- Create meals.`

`- Add foods to meals.`

`- Specify quantities.`

`- Calculate calories and macronutrients.`

`- Edit or remove consumed foods.`

`- Review their daily food timeline.`


`Meal Tracking is responsible for creating the primary nutrition data used by:`


`- Dashboard.`

`- Daily Summary.`

`- Progress Analytics.`

`- Achievement System.`

`- Future AI features.`


`---`


`\# 2. Problem Statement`


`Many calorie tracking applications create unnecessary friction by making food logging complicated and time-consuming.`


`Common problems include:`


`- Too many steps to add food.`

`- Inaccurate portion tracking.`

`- Poor meal organization.`

`- Lack of daily context.`

`- Difficult review of consumed food.`


`CalorieDock needs a fast and intuitive meal logging system that encourages consistent user behavior.`


`---`


`\# 3. Goals`


`\#\# Primary Goals`


`The Meal Tracking system should provide:`


`- Fast food logging.`

`- Accurate calorie calculations.`

`- Macronutrient tracking.`

`- Organized daily meals.`

`- Simple editing experience.`

`- Reliable nutrition data.`


`---`


`\#\# Secondary Goals`


`The system should prepare the foundation for:`


`- AI meal suggestions.`

`- Smart recommendations.`

`- Meal templates.`

`- Automatic habit analysis.`

`- Nutrition coaching.`


`---`


`\# 4. Non-Goals`


`The MVP version will not include:`


`- AI-generated meal plans.`

`- Automatic food recognition.`

`- Social meal sharing.`

`- Recipe creation.`

`- Grocery list generation.`


`These features belong to future versions.`


`---`


`\# 5. User Stories`


`---`


`\#\# US-001 — Add Food To Meal`


`\*\*As a user,\*\*`


`I want to add food items to my meals,`


`so that I can track my daily calorie intake.`


`---`


`\#\# US-002 — Track Portion Size`


`\*\*As a user,\*\*`


`I want to specify the amount of food consumed,`


`so that calories and macros are calculated correctly.`


`---`


`\#\# US-003 — View Daily Meals`


`\*\*As a user,\*\*`


`I want to see all meals consumed during the day,`


`so that I understand my eating pattern.`


`---`


`\#\# US-004 — Edit Meal Entries`


`\*\*As a user,\*\*`


`I want to modify previous entries,`


`so that mistakes can be corrected.`


`---`


`\#\# US-005 — Remove Food Entry`


`\*\*As a user,\*\*`


`I want to remove incorrectly added foods,`


`so that my daily statistics remain accurate.`


`---`


`\# 6. Functional Requirements`


`---`


`\# 6.1 Meal Creation`


`Users must be able to create meals.`


`Default meal categories:`
```

Breakfast

Lunch

Dinner

Snack


`The system should support custom meal names in the future.`


`---`


`\# 6.2 Adding Food To Meal`


`Users can add food from:`


`- Food Database.`

`- Custom Foods.`


`Flow:`
```

Select Meal

↓

Search Food

↓

Select Food

↓

Enter Quantity

↓

Save Entry


`---`


`\# 6.3 Quantity Management`


`The system must support:`


`- Grams.`

`- Milliliters.`

`- Servings.`


`Example:`
```

Chicken Breast

Quantity:  
150g


`The system calculates:`
```

Calories

Protein

Carbohydrates

Fat


`based on the selected quantity.`


`---`


`\# 6.4 Nutrition Calculation`


`All nutrition calculations must be based on:`
```

Nutrition per 100g


`Formula:`
```

Food Value × Quantity / 100


`Example:`
```

Chicken:

165 kcal / 100g

Consumed:

200g

Calculation:

165 × 200 / 100

=

330 kcal


`---`


`\# 6.5 Meal Timeline`


`The system must provide a chronological daily view.`


`Example:`
```

08:30

Breakfast

- Eggs 

- Greek Yogurt 

13:00

Lunch

- Chicken 

- Rice 

19:30

Dinner

- Salad 

- Fish 


`---`


`\# 6.6 Meal Editing`


`Users must be able to:`


`- Change quantity.`

`- Replace food.`

`- Remove food.`

`- Update meal time.`


`---`


`\# 6.7 Meal Deletion`


`Users can delete:`


`- Individual food entries.`

`- Complete meals.`


`Deletion must update:`


`- Daily calories.`

`- Macronutrients.`

`- Dashboard statistics.`


`---`


`\# 7. Database Design`


`---`


`\# 7.1 meals Table`


`Stores user meals.`


`\`\`\`sql`

`meals`


`id`


`user\_id`


`name`


`meal\_type`


`consumed\_at`


`created\_at`

`updated\_at`
```


# 7.2 meal\_items Table

Stores foods inside meals.

```
`meal\_items`


`id`


`meal\_id`


`food\_id`


`quantity`


`unit`


`calories`


`protein`


`carbohydrates`


`fat`


`created\_at`
```


# 7.3 Relationships

```
`User`


`↓`


`Meals`


`↓`


`Meal Items`


`↓`


`Foods`
```


# 8. Architecture

Meal Tracking follows the feature-based architecture.

Structure:

```
`features/`


`meal-tracking/`


`├── components/`


`├── hooks/`


`├── services/`


`├── schemas/`


`├── types/`


`└── utils/`
```


# 9. Business Logic

Meal Tracking owns:

- Food quantity calculation. 

- Macro calculation. 

- Meal organization. 

- Daily aggregation. 

The Dashboard should consume processed data instead of calculating nutrition independently.


# 10. UI/UX Requirements


# Meal Timeline Component

Must display:

- Meal name. 

- Time. 

- Foods. 

- Calories. 

- Macro summary. 


# Add Food Interface

Required:

- Search. 

- Food selection. 

- Quantity input. 

- Serving selector. 

- Confirm action. 


# Meal Card

Displays:

- Meal name. 

- Total calories. 

- Macro breakdown. 

- Food list. 


# Food Item Row

Displays:

- Food name. 

- Quantity. 

- Calories. 

- Edit action. 

- Delete action. 


# 11. User Flows


# Add Meal Entry Flow

```
`Open Dashboard`


`↓`


`Select Add Food`


`↓`


`Choose Meal`


`↓`


`Search Food`


`↓`


`Set Quantity`


`↓`


`Confirm`


`↓`


`Dashboard Updates`
```


# Edit Entry Flow

```
`Open Meal`


`↓`


`Select Food`


`↓`


`Change Quantity`


`↓`


`Save`


`↓`


`Nutrition Updates`
```


# 12. Validation Rules

## Quantity

Must be:

```
`\> 0`
```


## Food Selection

Cannot save empty meal items.


## Meal Name

Required.

Minimum:

```
`2 characters`
```


# 13. Security Requirements

## Row Level Security

Users can:

READ:

- Their own meals. 

CREATE:

- Their own meals. 

UPDATE:

- Their own meals. 

DELETE:

- Their own meals. 

Users cannot:

- Access another user's meals. 

- Modify another user's nutrition data. 


# 14. Analytics Events


## meal\_created

Triggered when user creates a meal.

Properties:

```
`meal\_type`

`timestamp`
```


## food\_added\_to\_meal

Triggered when food is added.

Properties:

```
`food\_id`


`meal\_id`


`quantity`


`source`
```


## meal\_updated

Triggered when meal changes.

Properties:

```
`meal\_id`


`changed\_field`
```


## food\_removed\_from\_meal

Triggered when food is deleted.

Properties:

```
`food\_id`


`meal\_id`
```


# 15. Testing Strategy


# Unit Testing

Test:

- Nutrition calculations. 

- Quantity conversions. 

- Validation logic. 


# Integration Testing

Test:

- Database relations. 

- Food retrieval. 

- Meal updates. 


# End-To-End Testing

Scenario:

```
`User creates meal`


`↓`


`Adds food`


`↓`


`Changes quantity`


`↓`


`Dashboard updates calories`
```


# 16. Acceptance Criteria

The feature is complete when:

## Meal Creation

- Users can create meals. 

- Default meal types exist. 

- Meals are saved correctly. 


## Food Logging

- Users can add foods. 

- Quantities are calculated correctly. 

- Calories and macros update. 


## Editing

- Users can modify entries. 

- Users can remove entries. 

- Statistics update correctly. 


## Security

- Users only access their own data. 

- RLS policies are verified. 


# 17. Definition of Done

Feature is complete when:

## Documentation

- PRD approved. 

- Database design approved. 


## Development

- Database implemented. 

- Business logic implemented. 

- UI implemented. 

- Integration completed. 


## Quality

- Tests passed. 

- Security reviewed. 

- Responsive behavior verified. 


# 18. Future Extensions


## Meal Templates

Allow users to save frequently repeated meals.


## Recipe System

Create meals containing multiple ingredients.


## AI Meal Suggestions

Recommend meals based on:

- Goals. 

- History. 

- Preferences. 


## Smart Logging

Automatically suggest foods based on previous behavior.


# Feature Status

```
`Planning        ✅`


`Documentation   ✅`


`Design          ⏳`


`Development     ⏳`


`Testing         ⏳`


`Release         ⏳`
```

