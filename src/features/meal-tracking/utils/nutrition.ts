import type { NutritionValues } from "../types"

function toHundredths(value: number) { return Math.round((value + Number.EPSILON) * 100) }

export function calculateNutrition(perHundredGrams: NutritionValues, quantityGrams: number): NutritionValues {
  const calculate = (value: number) => Math.round(toHundredths(value) * quantityGrams / 100) / 100
  return {
    calories: calculate(perHundredGrams.calories),
    protein: calculate(perHundredGrams.protein),
    carbohydrates: calculate(perHundredGrams.carbohydrates),
    fat: calculate(perHundredGrams.fat),
  }
}

export function calculateTotals(items: NutritionValues[]): NutritionValues {
  const total = (key: keyof NutritionValues) => Math.round(items.reduce((sum, item) => sum + toHundredths(item[key]), 0)) / 100
  return { calories: total("calories"), protein: total("protein"), carbohydrates: total("carbohydrates"), fat: total("fat") }
}
