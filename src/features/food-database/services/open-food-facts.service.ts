import "server-only"

import { openFoodFactsProductResponseSchema, openFoodFactsResponseSchema } from "../schemas/food.schema"
import type { FoodSearchItem } from "../types"

const OPEN_FOOD_FACTS_URL = "https://search.openfoodfacts.org/search"
const OPEN_FOOD_FACTS_PRODUCT_URL = "https://world.openfoodfacts.org/api/v2/product"
const USER_AGENT = "CalorieDock/0.1 (https://github.com/aleksdev00/CalorieDock.git)"
const RESULT_FIELDS = ["code", "product_name", "brands", "categories", "nutriments"]

export type OpenFoodFactsProductLookup =
  | { status: "success"; product: FoodSearchItem }
  | { status: "not_found" }
  | { status: "missing_required_data"; missing: string[] }
  | { status: "invalid_response" }

function validNutrient(value: number | undefined, maximum: number) {
  return value !== undefined && value >= 0 && value <= maximum ? value : null
}

function normalizeOptionalText(value: string | null | undefined, maximum: number) {
  const normalized = value?.trim().slice(0, maximum).trim()
  return normalized || null
}

function normalizeFirstText(value: string | string[] | null | undefined, maximum: number) {
  return normalizeOptionalText(Array.isArray(value) ? value[0] : value, maximum)
}

function normalizeCategory(value: string | string[] | null | undefined) {
  const firstValue = Array.isArray(value) ? value[0] : value
  const category = normalizeOptionalText(firstValue?.split(",")[0], 80)
  return category && category.length >= 2 ? category : "Packaged food"
}

function normalizeCalories(nutrients: { "energy-kcal_100g"?: number; energy_100g?: number } | null | undefined) {
  const calories = validNutrient(nutrients?.["energy-kcal_100g"], 900)
  if (calories !== null) return calories
  const energyKilojoules = validNutrient(nutrients?.energy_100g, 3765.6)
  return energyKilojoules === null ? null : Number((energyKilojoules / 4.184).toFixed(2))
}

function normalizeProductName(product: Record<string, unknown>) {
  const candidates = [
    product.product_name,
    product.product_name_en,
    ...Object.entries(product)
      .filter(([key]) => /^product_name_[a-z]{2,3}$/.test(key) && key !== "product_name_en")
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, value]) => value),
  ]
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue
    const name = normalizeOptionalText(candidate, 150)
    if (name && name.length >= 2 && !/[\u0000-\u001f\u007f]/.test(name)) return name
  }
  return null
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
    const calories = normalizeCalories(nutrients)
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
      brand: normalizeFirstText(product.brands, 100),
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

export async function getOpenFoodFactsProductByCode(code: string): Promise<OpenFoodFactsProductLookup> {
  const endpoint = `${OPEN_FOOD_FACTS_PRODUCT_URL}/${encodeURIComponent(code)}.json`
  if (process.env.NODE_ENV === "development") {
    console.info("[food-database] Open Food Facts product lookup", { externalId: code, endpoint })
  }

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json", "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(6000),
  })

  if (process.env.NODE_ENV === "development") {
    console.info("[food-database] Open Food Facts product response", { externalId: code, endpoint, status: response.status })
  }
  if (!response.ok) {
    if (response.status === 404) return { status: "not_found" }
    throw new Error(`Open Food Facts product request failed with status ${response.status}`)
  }

  let body: unknown
  try { body = await response.json() } catch { return { status: "invalid_response" } }
  const parsed = openFoodFactsProductResponseSchema.safeParse(body)
  if (!parsed.success) return { status: "invalid_response" }
  const product = parsed.data.product
  const productCode = product?.code?.trim() || parsed.data.code?.trim()
  if (parsed.data.status === 0 || !product) return { status: "not_found" }
  if (parsed.data.status !== 1 || productCode !== code || !productCode || !/^[0-9]{8,14}$/.test(productCode)) return { status: "invalid_response" }

  const name = normalizeProductName(product)
  const calories = normalizeCalories(product.nutriments)
  const protein = validNutrient(product.nutriments?.proteins_100g, 100)
  const carbohydrates = validNutrient(product.nutriments?.carbohydrates_100g, 100)
  const fat = validNutrient(product.nutriments?.fat_100g, 100)
  const missing = [
    !name ? "product name" : null,
    calories === null ? "calories" : null,
    protein === null ? "protein" : null,
    carbohydrates === null ? "carbohydrates" : null,
    fat === null ? "fat" : null,
  ].filter((value): value is string => value !== null)
  if (!name || calories === null || protein === null || carbohydrates === null || fat === null) {
    return { status: "missing_required_data", missing }
  }

  const sodiumGrams = validNutrient(product.nutriments?.sodium_100g, 100)
  return { status: "success", product: {
    id: `off:${productCode}`,
    name,
    brand: normalizeFirstText(product.brands, 100),
    category: normalizeCategory(product.categories),
    barcode: productCode,
    calories,
    protein,
    carbohydrates,
    fat,
    fiber: validNutrient(product.nutriments?.fiber_100g, 100),
    sugar: validNutrient(product.nutriments?.sugars_100g, 100),
    sodium: sodiumGrams === null ? null : Number((sodiumGrams * 1000).toFixed(2)),
    servingSize: 100,
    servingUnit: "g",
    source: "open_food_facts",
    isEditable: false,
    isExternal: true,
  } }
}
