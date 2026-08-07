"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { weightEntryIdSchema, weightEntrySchema } from "./schemas/weight-entry.schema"
import { createWeightEntry, deleteWeightEntry, updateWeightEntry } from "./services/weight-entry.service"
import type { WeightActionState, WeightEntryInput } from "./types"

const unexpected = (): WeightActionState => ({ status: "error", message: "Something went wrong. Please try again later." })
const validation = (errors: Record<string, string[] | undefined>): WeightActionState => ({ status: "error", message: "Please check the highlighted fields.", fieldErrors: Object.fromEntries(Object.entries(errors).filter((entry): entry is [string, string[]] => Boolean(entry[1]))) })

export async function createWeightEntryAction(input: WeightEntryInput): Promise<WeightActionState> {
  const parsed = weightEntrySchema.safeParse(input)
  if (!parsed.success) return validation(parsed.error.flatten().fieldErrors)
  let result
  try { result = await createWeightEntry(parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message, fieldErrors: result.error.fieldErrors }
  revalidatePath("/weight")
  redirect("/weight")
}

export async function updateWeightEntryAction(id: string, input: WeightEntryInput): Promise<WeightActionState> {
  const parsedId = weightEntryIdSchema.safeParse(id); const parsed = weightEntrySchema.safeParse(input)
  if (!parsedId.success) return { status: "error", message: "Invalid weight entry identifier." }
  if (!parsed.success) return validation(parsed.error.flatten().fieldErrors)
  let result
  try { result = await updateWeightEntry(parsedId.data, parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message, fieldErrors: result.error.fieldErrors }
  revalidatePath("/weight"); revalidatePath(`/weight/${id}/edit`); redirect("/weight")
}

export async function deleteWeightEntryAction(id: string): Promise<WeightActionState> {
  const parsed = weightEntryIdSchema.safeParse(id)
  if (!parsed.success) return { status: "error", message: "Invalid weight entry identifier." }
  let result
  try { result = await deleteWeightEntry(parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/weight")
  return { status: "success", message: "Weight entry deleted." }
}
