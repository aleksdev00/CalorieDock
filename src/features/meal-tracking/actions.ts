"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { mealIdSchema, mealItemIdSchema, mealItemSchema, mealSchema, updateMealItemSchema } from "./schemas/meal.schema"
import { addMealItem, createMeal, deleteMeal, deleteMealItem, replaceMealItem, updateMeal, updateMealItemQuantity } from "./services/meal.service"
import type { MealActionState, MealInput, MealItemInput } from "./types"

const unexpected = (): MealActionState => ({ status: "error", message: "Something went wrong. Please try again later." })
const validation = (errors: Record<string, string[] | undefined>): MealActionState => ({ status: "error", message: "Please check the highlighted fields.", fieldErrors: Object.fromEntries(Object.entries(errors).filter((entry): entry is [string, string[]] => Boolean(entry[1]))) })

export async function createMealAction(input: MealInput): Promise<MealActionState> {
  const parsed = mealSchema.safeParse(input)
  if (!parsed.success) return validation(parsed.error.flatten().fieldErrors)
  let result
  try { result = await createMeal(parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/meals")
  redirect(`/meals/${result.data.id}`)
}

export async function updateMealAction(id: string, input: MealInput): Promise<MealActionState> {
  const parsedId = mealIdSchema.safeParse(id); const parsed = mealSchema.safeParse(input)
  if (!parsedId.success) return { status: "error", message: "Invalid meal identifier." }
  if (!parsed.success) return validation(parsed.error.flatten().fieldErrors)
  let result
  try { result = await updateMeal(parsedId.data, parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/meals"); revalidatePath(`/meals/${id}`); redirect(`/meals/${id}`)
}

export async function deleteMealAction(id: string): Promise<MealActionState> {
  const parsed = mealIdSchema.safeParse(id); if (!parsed.success) return { status: "error", message: "Invalid meal identifier." }
  let result; try { result = await deleteMeal(parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/meals"); redirect("/meals")
}

export async function addMealItemAction(mealId: string, input: MealItemInput): Promise<MealActionState> {
  const id = mealIdSchema.safeParse(mealId); const parsed = mealItemSchema.safeParse(input)
  if (!id.success) return { status: "error", message: "Invalid meal identifier." }
  if (!parsed.success) return validation(parsed.error.flatten().fieldErrors)
  let result; try { result = await addMealItem(id.data, parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/meals"); revalidatePath(`/meals/${mealId}`); return { status: "success", message: "Food added." }
}

export async function replaceMealItemAction(mealId: string, itemId: string, input: MealItemInput): Promise<MealActionState> {
  const meal = mealIdSchema.safeParse(mealId); const item = mealItemIdSchema.safeParse(itemId); const parsed = mealItemSchema.safeParse(input)
  if (!meal.success || !item.success) return { status: "error", message: "Invalid meal item." }
  if (!parsed.success) return validation(parsed.error.flatten().fieldErrors)
  let result; try { result = await replaceMealItem(meal.data, item.data, parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/meals"); revalidatePath(`/meals/${mealId}`); return { status: "success", message: "Meal item replaced." }
}

export async function updateMealItemQuantityAction(mealId: string, itemId: string, quantityGrams: number): Promise<MealActionState> {
  const meal = mealIdSchema.safeParse(mealId); const item = mealItemIdSchema.safeParse(itemId); const parsed = updateMealItemSchema.safeParse({ quantityGrams })
  if (!meal.success || !item.success) return { status: "error", message: "Invalid meal item." }
  if (!parsed.success) return validation(parsed.error.flatten().fieldErrors)
  let result; try { result = await updateMealItemQuantity(meal.data, item.data, parsed.data.quantityGrams) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/meals"); revalidatePath(`/meals/${mealId}`); return { status: "success", message: "Quantity updated." }
}

export async function deleteMealItemAction(mealId: string, itemId: string): Promise<MealActionState> {
  const meal = mealIdSchema.safeParse(mealId); const item = mealItemIdSchema.safeParse(itemId)
  if (!meal.success || !item.success) return { status: "error", message: "Invalid meal item." }
  let result; try { result = await deleteMealItem(meal.data, item.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/meals"); revalidatePath(`/meals/${mealId}`); return { status: "success", message: "Food removed." }
}
