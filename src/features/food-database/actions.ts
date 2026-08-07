"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { foodIdSchema, foodSchema } from "./schemas/food.schema"
import { createCustomFood, deleteCustomFood, updateCustomFood } from "./services/food.service"
import type { FoodActionState, FoodInput } from "./types"

function validationError(fieldErrors: Record<string, string[] | undefined>): FoodActionState {
  return {
    status: "error",
    message: "Please check the highlighted fields.",
    fieldErrors: Object.fromEntries(Object.entries(fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1]))),
  }
}

function unexpectedError(): FoodActionState {
  return { status: "error", message: "Something went wrong. Please try again later." }
}

export async function createCustomFoodAction(input: FoodInput): Promise<FoodActionState> {
  const parsed = foodSchema.safeParse(input)
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors)
  let result
  try { result = await createCustomFood(parsed.data) } catch { return unexpectedError() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/foods")
  redirect(`/foods/${result.data.id}`)
}

export async function updateCustomFoodAction(id: string, input: FoodInput): Promise<FoodActionState> {
  const parsedId = foodIdSchema.safeParse(id)
  const parsed = foodSchema.safeParse(input)
  if (!parsedId.success) return { status: "error", message: "Invalid food identifier." }
  if (!parsed.success) return validationError(parsed.error.flatten().fieldErrors)
  let result
  try { result = await updateCustomFood(parsedId.data, parsed.data) } catch { return unexpectedError() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/foods")
  revalidatePath(`/foods/${id}`)
  redirect(`/foods/${id}`)
}

export async function deleteCustomFoodAction(id: string): Promise<FoodActionState> {
  const parsedId = foodIdSchema.safeParse(id)
  if (!parsedId.success) return { status: "error", message: "Invalid food identifier." }
  let result
  try { result = await deleteCustomFood(parsedId.data) } catch { return unexpectedError() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/foods")
  redirect("/foods")
}
