import type { DailySummaryMeal, MealOverview, NutritionTotals } from "../types"

const EMPTY_NUTRITION: NutritionTotals = { calories: 0, protein: 0, carbohydrates: 0, fat: 0 }

function addNutrition(total: NutritionTotals, values: NutritionTotals): NutritionTotals {
  return {
    calories: total.calories + Number(values.calories),
    protein: total.protein + Number(values.protein),
    carbohydrates: total.carbohydrates + Number(values.carbohydrates),
    fat: total.fat + Number(values.fat),
  }
}

function round(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function roundNutrition(values: NutritionTotals): NutritionTotals {
  return {
    calories: round(values.calories),
    protein: round(values.protein),
    carbohydrates: round(values.carbohydrates),
    fat: round(values.fat),
  }
}

export function aggregateMeals(meals: DailySummaryMeal[]): { nutrition: NutritionTotals; meals: MealOverview[] } {
  let nutrition = { ...EMPTY_NUTRITION }
  const overview = meals.map((meal) => {
    const totals = meal.meal_items.reduce(addNutrition, { ...EMPTY_NUTRITION })
    nutrition = addNutrition(nutrition, totals)
    return { ...meal, totals: roundNutrition(totals) }
  })
  return {
    nutrition: roundNutrition(nutrition),
    meals: overview,
  }
}

export function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value)
}

export function formatSelectedDate(date: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`))
}

export function formatZonedDateTime(isoDate: string, timeZone: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short", timeZone }).format(new Date(isoDate))
}
