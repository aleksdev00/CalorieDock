import "server-only"

import { openFoodFactsResponseSchema } from "../schemas/food.schema"
import type { FoodSearchItem } from "../types"

const OPEN_FOOD_FACTS_URL = "https://search.openfoodfacts.org/search"
const USER_AGENT = "CalorieDock/0.1 (https://github.com/aleksdev00/CalorieDock.git)"
const RESULT_FIELDS = ["code", "product_name", "brands", "categories", "nutriments"]

function validNutrient(value: number | undefined, maximum: number) {
  return value !== undefined && value >= 0 && value <= maximum ? value : null
}

function normalizeOptionalText(value: string | null | undefined, maximum: number) {
  const normalized = value?.trim().slice(0, maximum).trim()
  return normalized || null
}

function normalizeCategory(value: string | null | undefined) {
  const category = normalizeOptionalText(value?.split(",")[0], 80)
  return category && category.length >= 2 ? category : "Packaged food"
}

export async function searchOpenFoodFacts(query: string): Promise<FoodSearchItem[]> {
  const response = await fetch(OPEN_FOOD_FACTS_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
    },
    body: JSON.stringify({ q: query, page_size: 12, fields: RESULT_FIELDS }),
    signal: AbortSignal.timeout(6000),
  })

  if (!response.ok) {
    throw new Error(`Open Food Facts request failed with status ${response.status}`)
  }

  const parsed = openFoodFactsResponseSchema.safeParse(await response.json())
  if (!parsed.success) throw new Error("Open Food Facts returned invalid data")

  return parsed.data.hits.flatMap((product) => {
    const nutrients = product.nutriments
    const name = normalizeOptionalText(product.product_name, 150)
    const barcode = product.code?.trim()
    const calories = validNutrient(nutrients?.["energy-kcal_100g"], 900)
    const protein = validNutrient(nutrients?.proteins_100g, 100)
    const carbohydrates = validNutrient(nutrients?.carbohydrates_100g, 100)
    const fat = validNutrient(nutrients?.fat_100g, 100)

    if (
      !name ||
      name.length < 2 ||
      /[\u0000-\u001f\u007f]/.test(name) ||
      !barcode ||
      !/^[0-9]{8,14}$/.test(barcode) ||
      calories === null ||
      protein === null ||
      carbohydrates === null ||
      fat === null
    ) return []

    const sodiumGrams = validNutrient(nutrients?.sodium_100g, 100)

    return [{
      id: `off:${barcode}`,
      name,
      brand: normalizeOptionalText(product.brands?.[0], 100),
      category: normalizeCategory(product.categories),
      barcode,
      calories,
      protein,
      carbohydrates,
      fat,
      fiber: validNutrient(nutrients?.fiber_100g, 100),
      sugar: validNutrient(nutrients?.sugars_100g, 100),
      sodium: sodiumGrams === null ? null : Number((sodiumGrams * 1000).toFixed(2)),
      servingSize: 100,
      servingUnit: "g" as const,
      source: "open_food_facts" as const,
      isEditable: false,
      isExternal: true,
    }]
  })
}
