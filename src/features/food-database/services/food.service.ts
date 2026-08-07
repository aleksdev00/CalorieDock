import "server-only"

import { createClient } from "@/services/supabase/server"
import type { ActionResult, ApiError } from "@/types/api"

import type { ValidatedFoodInput } from "../schemas/food.schema"
import type { Food, FoodSearchFilters, FoodSearchItem, FoodSearchResponse } from "../types"
import { searchOpenFoodFacts } from "./open-food-facts.service"

const FOOD_COLUMNS = "id, user_id, name, brand, category, barcode, calories, protein, carbohydrates, fat, fiber, sugar, sodium, serving_size, serving_unit, source, external_id, created_at, updated_at"
const AUTHENTICATION_ERROR: ApiError = { code: "UNAUTHENTICATED", message: "Sign in to access the food database." }
const LOAD_ERROR: ApiError = { code: "FOOD_LOAD_FAILED", message: "Unable to load food information. Please try again." }
const SAVE_ERROR: ApiError = { code: "FOOD_SAVE_FAILED", message: "Your food could not be saved. Please try again." }
const DELETE_ERROR: ApiError = { code: "FOOD_DELETE_FAILED", message: "Your food could not be deleted. Please try again." }

async function authenticatedClient() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { supabase, user: error ? null : user }
}

export async function getFoodDatabaseAccess(): Promise<ActionResult<{ userId: string }>> {
  const { user } = await authenticatedClient()
  return user
    ? { success: true, data: { userId: user.id } }
    : { success: false, error: AUTHENTICATION_ERROR }
}

function toSearchItem(food: Food, userId: string): FoodSearchItem {
  return {
    id: food.id, name: food.name, brand: food.brand, category: food.category,
    barcode: food.barcode, calories: food.calories, protein: food.protein,
    carbohydrates: food.carbohydrates, fat: food.fat, fiber: food.fiber,
    sugar: food.sugar, sodium: food.sodium, servingSize: food.serving_size,
    servingUnit: food.serving_unit, source: food.source,
    isEditable: food.source === "custom" && food.user_id === userId,
    isExternal: false,
  }
}

export async function searchFoods(filters: FoodSearchFilters): Promise<ActionResult<FoodSearchResponse>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTHENTICATION_ERROR }

  let request = supabase.from("foods").select(FOOD_COLUMNS).order("name").limit(40)
  if (filters.query) {
    const pattern = `%${filters.query}%`
    request = request.or(`name.ilike.${pattern},brand.ilike.${pattern},barcode.ilike.${pattern},category.ilike.${pattern}`)
  }
  if (filters.category) request = request.ilike("category", filters.category)
  if (filters.source && filters.source !== "all") request = request.eq("source", filters.source)

  const { data, error } = await request
  if (error) return { success: false, error: LOAD_ERROR }
  const internalItems = (data as Food[]).map((food) => toSearchItem(food, user.id))

  if (internalItems.length > 0 || !filters.query || (filters.source && !["all", "open_food_facts"].includes(filters.source))) {
    return { success: true, data: { items: internalItems } }
  }

  try {
    const externalItems = await searchOpenFoodFacts(filters.query)
    const category = filters.category?.toLocaleLowerCase()
    const items = category
      ? externalItems.filter((food) =>
          food.category.toLocaleLowerCase().includes(category),
        )
      : externalItems
    return { success: true, data: { items } }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "[food-database] Open Food Facts search failed:",
        error instanceof Error ? error.message : "Unknown error",
      )
    }
    return { success: true, data: { items: internalItems, externalUnavailable: true } }
  }
}

export async function getFoodById(id: string): Promise<ActionResult<Food>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTHENTICATION_ERROR }
  const { data, error } = await supabase.from("foods").select(FOOD_COLUMNS).eq("id", id).maybeSingle()
  if (error) return { success: false, error: LOAD_ERROR }
  if (!data) return { success: false, error: { code: "NOT_FOUND", message: "Food not found." } }
  return { success: true, data: data as Food }
}

function foodWrite(input: ValidatedFoodInput) {
  return {
    name: input.name, brand: input.brand || null, category: input.category,
    barcode: input.barcode || null, calories: input.calories, protein: input.protein,
    carbohydrates: input.carbohydrates, fat: input.fat, fiber: input.fiber,
    sugar: input.sugar, sodium: input.sodium, serving_size: input.servingSize,
    serving_unit: input.servingUnit,
  }
}

export async function createCustomFood(input: ValidatedFoodInput): Promise<ActionResult<Food>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTHENTICATION_ERROR }
  const { data, error } = await supabase.from("foods").insert({ ...foodWrite(input), user_id: user.id, source: "custom" }).select(FOOD_COLUMNS).single()
  return error ? { success: false, error: SAVE_ERROR } : { success: true, data: data as Food }
}

export async function updateCustomFood(id: string, input: ValidatedFoodInput): Promise<ActionResult<Food>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTHENTICATION_ERROR }
  const { data, error } = await supabase.from("foods").update(foodWrite(input)).eq("id", id).eq("user_id", user.id).eq("source", "custom").select(FOOD_COLUMNS).maybeSingle()
  if (error) return { success: false, error: SAVE_ERROR }
  if (!data) return { success: false, error: { code: "NOT_FOUND", message: "Custom food not found." } }
  return { success: true, data: data as Food }
}

export async function deleteCustomFood(id: string): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTHENTICATION_ERROR }
  const { data, error } = await supabase.from("foods").delete().eq("id", id).eq("user_id", user.id).eq("source", "custom").select("id").maybeSingle()
  if (error) return { success: false, error: DELETE_ERROR }
  if (!data) return { success: false, error: { code: "NOT_FOUND", message: "Custom food not found." } }
  return { success: true, data }
}
