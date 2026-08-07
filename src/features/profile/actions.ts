"use server"

import { redirect } from "next/navigation"

import { profileSchema } from "./schemas/profile.schema"
import { updateCurrentProfile } from "./services/profile.service"
import type { ProfileActionState, ProfileInput } from "./types"

function validationError(
  fieldErrors: Record<string, string[] | undefined>,
): ProfileActionState {
  return {
    status: "error",
    message: "Please check the highlighted fields.",
    fieldErrors: Object.fromEntries(
      Object.entries(fieldErrors).filter(
        (entry): entry is [string, string[]] => Boolean(entry[1]),
      ),
    ),
  }
}

function unexpectedError(): ProfileActionState {
  return {
    status: "error",
    message: "Something went wrong. Please try again later.",
  }
}

async function saveProfile(input: ProfileInput): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse(input)

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors)
  }

  let result

  try {
    result = await updateCurrentProfile(parsed.data)
  } catch {
    return unexpectedError()
  }

  if (!result.success) {
    return { status: "error", message: result.error.message }
  }

  if (!result.data.profile_completed) {
    return unexpectedError()
  }

  return { status: "success", message: "Your profile has been saved." }
}

export async function completeProfileAction(
  input: ProfileInput,
): Promise<ProfileActionState> {
  const result = await saveProfile(input)

  if (result.status !== "success") {
    return result
  }

  redirect("/dashboard")
}

export async function updateProfileAction(
  input: ProfileInput,
): Promise<ProfileActionState> {
  return saveProfile(input)
}

