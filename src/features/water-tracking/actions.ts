"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { waterEntryIdSchema, waterEntrySchema, waterUnitSchema } from "./schemas/water-entry.schema"
import { createWaterEntry, deleteWaterEntry, updateWaterEntry, updateWaterUnit } from "./services/water-entry.service"
import type { WaterActionState, WaterEntryInput } from "./types"

const unexpected = (): WaterActionState => ({ status: "error", message: "Something went wrong. Please try again later." })
const validation = (errors: Record<string, string[] | undefined>): WaterActionState => ({ status: "error", message: "Please check the highlighted fields.", fieldErrors: Object.fromEntries(Object.entries(errors).filter((entry): entry is [string, string[]] => Boolean(entry[1]))) })

export async function createWaterEntryAction(input: WaterEntryInput): Promise<WaterActionState> {
  const parsed = waterEntrySchema.safeParse(input)
  if (!parsed.success) return validation(parsed.error.flatten().fieldErrors)
  let result
  try { result = await createWaterEntry(parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message, fieldErrors: result.error.fieldErrors }
  revalidatePath("/water")
  redirect("/water")
}

export async function updateWaterEntryAction(id: string, input: WaterEntryInput): Promise<WaterActionState> {
  const parsedId = waterEntryIdSchema.safeParse(id); const parsed = waterEntrySchema.safeParse(input)
  if (!parsedId.success) return { status: "error", message: "Invalid water entry identifier." }
  if (!parsed.success) return validation(parsed.error.flatten().fieldErrors)
  let result
  try { result = await updateWaterEntry(parsedId.data, parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message, fieldErrors: result.error.fieldErrors }
  revalidatePath("/water"); revalidatePath(`/water/${id}/edit`); redirect("/water")
}

export async function deleteWaterEntryAction(id: string): Promise<WaterActionState> {
  const parsed = waterEntryIdSchema.safeParse(id)
  if (!parsed.success) return { status: "error", message: "Invalid water entry identifier." }
  let result
  try { result = await deleteWaterEntry(parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/water")
  return { status: "success", message: "Water entry deleted." }
}

export async function updateWaterUnitAction(input: string): Promise<WaterActionState> {
  const parsed = waterUnitSchema.safeParse(input)
  if (!parsed.success) return { status: "error", message: "Select a valid water unit." }
  let result
  try { result = await updateWaterUnit(parsed.data) } catch { return unexpected() }
  if (!result.success) return { status: "error", message: result.error.message }
  revalidatePath("/water")
  return { status: "success", message: "Water unit updated." }
}
