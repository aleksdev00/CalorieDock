import "server-only"

import { createClient } from "@/services/supabase/server"
import type { Food } from "@/features/food-database/types"
import { getOpenFoodFactsProductByCode } from "@/features/food-database/services/open-food-facts.service"
import type { ActionResult, ApiError } from "@/types/api"

import type { ValidatedMealInput, ValidatedMealItemInput } from "../schemas/meal.schema"
import type { FoodSnapshot, Meal, MealItem, MealWithItems } from "../types"
import { calculateNutrition } from "../utils/nutrition"

const MEAL_COLUMNS = "id, user_id, name, meal_type, consumed_at, created_at, updated_at"
const ITEM_COLUMNS = "id, meal_id, food_id, food_name, food_brand, food_source, external_id, quantity_grams, calories, protein, carbohydrates, fat, created_at"
const AUTH_ERROR: ApiError = { code: "UNAUTHENTICATED", message: "Sign in to manage meals." }
const LOAD_ERROR: ApiError = { code: "MEAL_LOAD_FAILED", message: "Unable to load meals. Please try again." }
const SAVE_ERROR: ApiError = { code: "MEAL_SAVE_FAILED", message: "Your meal could not be saved. Please try again." }
const ITEM_SAVE_ERROR: ApiError = { code: "MEAL_ITEM_SAVE_FAILED", message: "The food could not be saved to this meal. Please try again." }
const NOT_FOUND: ApiError = { code: "NOT_FOUND", message: "Meal not found." }

async function authenticatedClient() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { supabase, user: error ? null : user }
}

export async function getMeals(): Promise<ActionResult<MealWithItems[]>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data, error } = await supabase.from("meals").select(`${MEAL_COLUMNS}, meal_items(${ITEM_COLUMNS})`).eq("user_id", user.id).order("consumed_at", { ascending: false })
  return error ? { success: false, error: LOAD_ERROR } : { success: true, data: data as MealWithItems[] }
}

export async function getMeal(id: string): Promise<ActionResult<MealWithItems>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data, error } = await supabase.from("meals").select(`${MEAL_COLUMNS}, meal_items(${ITEM_COLUMNS})`).eq("id", id).eq("user_id", user.id).maybeSingle()
  if (error) return { success: false, error: LOAD_ERROR }
  return data ? { success: true, data: data as MealWithItems } : { success: false, error: NOT_FOUND }
}

export async function createMeal(input: ValidatedMealInput): Promise<ActionResult<Meal>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data, error } = await supabase.from("meals").insert({ user_id: user.id, name: input.name, meal_type: input.mealType, consumed_at: new Date(input.consumedAt).toISOString() }).select(MEAL_COLUMNS).single()
  return error ? { success: false, error: SAVE_ERROR } : { success: true, data: data as Meal }
}

export async function updateMeal(id: string, input: ValidatedMealInput): Promise<ActionResult<Meal>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data, error } = await supabase.from("meals").update({ name: input.name, meal_type: input.mealType, consumed_at: new Date(input.consumedAt).toISOString() }).eq("id", id).eq("user_id", user.id).select(MEAL_COLUMNS).maybeSingle()
  if (error) return { success: false, error: SAVE_ERROR }
  return data ? { success: true, data: data as Meal } : { success: false, error: NOT_FOUND }
}

export async function deleteMeal(id: string): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data, error } = await supabase.from("meals").delete().eq("id", id).eq("user_id", user.id).select("id").maybeSingle()
  if (error) return { success: false, error: SAVE_ERROR }
  return data ? { success: true, data } : { success: false, error: NOT_FOUND }
}

async function resolveFood(reference: string): Promise<ActionResult<FoodSnapshot>> {
  if (reference.startsWith("off:")) {
    const externalId = reference.slice(4)
    try {
      if (process.env.NODE_ENV === "development") {
        console.info("[meal-tracking] Resolving selected external food", { externalId })
      }
      const lookup = await getOpenFoodFactsProductByCode(externalId)
      if (lookup.status === "not_found") return { success: false, error: { code: "FOOD_NOT_FOUND", message: "This Open Food Facts product no longer exists." } }
      if (lookup.status === "invalid_response") return { success: false, error: { code: "EXTERNAL_FOOD_INVALID", message: "Open Food Facts returned an invalid product response. Please try another product." } }
      if (lookup.status === "missing_required_data") return { success: false, error: { code: "EXTERNAL_FOOD_INCOMPLETE", message: `This product cannot be logged because Open Food Facts is missing: ${lookup.missing.join(", ")}.` } }
      const product = lookup.product
      return { success: true, data: { foodId: null, foodName: product.name, foodBrand: product.brand, foodSource: "open_food_facts", externalId, calories: product.calories, protein: product.protein, carbohydrates: product.carbohydrates, fat: product.fat } }
    } catch {
      return { success: false, error: { code: "EXTERNAL_FOOD_UNAVAILABLE", message: "Open Food Facts is unavailable. Please try again later." } }
    }
  }

  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data, error } = await supabase.from("foods").select("id, user_id, name, brand, category, barcode, calories, protein, carbohydrates, fat, fiber, sugar, sodium, serving_size, serving_unit, source, external_id, created_at, updated_at").eq("id", reference).maybeSingle()
  if (error || !data) return { success: false, error: { code: "FOOD_NOT_FOUND", message: "Select a food you can access." } }
  const food = data as Food
  return { success: true, data: { foodId: food.id, foodName: food.name, foodBrand: food.brand, foodSource: food.source, externalId: food.external_id, calories: food.calories, protein: food.protein, carbohydrates: food.carbohydrates, fat: food.fat } }
}

function itemWrite(mealId: string, snapshot: FoodSnapshot, quantityGrams: number) {
  const nutrition = calculateNutrition(snapshot, quantityGrams)
  return { meal_id: mealId, food_id: snapshot.foodId, food_name: snapshot.foodName, food_brand: snapshot.foodBrand, food_source: snapshot.foodSource, external_id: snapshot.externalId, quantity_grams: quantityGrams, ...nutrition }
}

export async function addMealItem(mealId: string, input: ValidatedMealItemInput): Promise<ActionResult<MealItem>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data: meal } = await supabase.from("meals").select("id").eq("id", mealId).eq("user_id", user.id).maybeSingle()
  if (!meal) return { success: false, error: NOT_FOUND }
  const snapshot = await resolveFood(input.foodReference)
  if (!snapshot.success) return snapshot
  const { data, error } = await supabase.from("meal_items").insert(itemWrite(mealId, snapshot.data, input.quantityGrams)).select(ITEM_COLUMNS).single()
  return error ? { success: false, error: ITEM_SAVE_ERROR } : { success: true, data: data as MealItem }
}

export async function replaceMealItem(mealId: string, itemId: string, input: ValidatedMealItemInput): Promise<ActionResult<MealItem>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data: meal } = await supabase.from("meals").select("id").eq("id", mealId).eq("user_id", user.id).maybeSingle()
  if (!meal) return { success: false, error: NOT_FOUND }
  const snapshot = await resolveFood(input.foodReference)
  if (!snapshot.success) return snapshot
  const write = itemWrite(mealId, snapshot.data, input.quantityGrams)
  const update = {
    food_id: write.food_id, food_name: write.food_name, food_brand: write.food_brand,
    food_source: write.food_source, external_id: write.external_id,
    quantity_grams: write.quantity_grams, calories: write.calories,
    protein: write.protein, carbohydrates: write.carbohydrates, fat: write.fat,
  }
  const { data, error } = await supabase.from("meal_items").update(update).eq("id", itemId).eq("meal_id", mealId).select(ITEM_COLUMNS).maybeSingle()
  if (error) return { success: false, error: ITEM_SAVE_ERROR }
  return data ? { success: true, data: data as MealItem } : { success: false, error: { code: "NOT_FOUND", message: "Meal item not found." } }
}

export async function updateMealItemQuantity(mealId: string, itemId: string, quantityGrams: number): Promise<ActionResult<MealItem>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data: meal } = await supabase.from("meals").select("id").eq("id", mealId).eq("user_id", user.id).maybeSingle()
  if (!meal) return { success: false, error: NOT_FOUND }
  const { data: current } = await supabase.from("meal_items").select(ITEM_COLUMNS).eq("id", itemId).eq("meal_id", mealId).maybeSingle()
  if (!current) return { success: false, error: { code: "NOT_FOUND", message: "Meal item not found." } }
  const item = current as MealItem
  const ratio = quantityGrams / item.quantity_grams
  const scale = (value: number) => Math.round((value * ratio + Number.EPSILON) * 100) / 100
  const { data, error } = await supabase.from("meal_items").update({ quantity_grams: quantityGrams, calories: scale(item.calories), protein: scale(item.protein), carbohydrates: scale(item.carbohydrates), fat: scale(item.fat) }).eq("id", itemId).eq("meal_id", mealId).select(ITEM_COLUMNS).single()
  return error ? { success: false, error: ITEM_SAVE_ERROR } : { success: true, data: data as MealItem }
}

export async function deleteMealItem(mealId: string, itemId: string): Promise<ActionResult<{ id: string }>> {
  const { supabase, user } = await authenticatedClient()
  if (!user) return { success: false, error: AUTH_ERROR }
  const { data: meal } = await supabase.from("meals").select("id").eq("id", mealId).eq("user_id", user.id).maybeSingle()
  if (!meal) return { success: false, error: NOT_FOUND }
  const { data, error } = await supabase.from("meal_items").delete().eq("id", itemId).eq("meal_id", mealId).select("id").maybeSingle()
  if (error) return { success: false, error: ITEM_SAVE_ERROR }
  return data ? { success: true, data } : { success: false, error: { code: "NOT_FOUND", message: "Meal item not found." } }
}
