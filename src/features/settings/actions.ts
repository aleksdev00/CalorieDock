"use server"

import { revalidatePath } from "next/cache"
import { settingsSchema } from "./schemas/settings.schema"
import { updateSettings } from "./services/settings.service"
import type { SettingsActionState, SettingsInput } from "./types"

export async function updateSettingsAction(input: SettingsInput): Promise<SettingsActionState> {
  const parsed = settingsSchema.safeParse(input)
  if (!parsed.success) {
    const flattened = parsed.error.flatten()
    return {
      status: "error",
      message: "Please check the highlighted settings.",
      fieldErrors: Object.fromEntries(Object.entries(flattened.fieldErrors).filter((entry): entry is [string, string[]] => Boolean(entry[1]))),
    }
  }

  try {
    const result = await updateSettings(parsed.data)
    if (!result.success) return { status: "error", message: result.error.message }
  } catch {
    return { status: "error", message: "Something went wrong. Please try again later." }
  }

  revalidatePath("/settings")
  revalidatePath("/weight")
  revalidatePath("/water")
  revalidatePath("/daily-summary")
  revalidatePath("/dashboard")
  return { status: "success", message: "Settings saved." }
}
