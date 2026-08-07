import "server-only"

import { createClient } from "@/services/supabase/server"
import type { ActionResult, ApiError } from "@/types/api"

import type { Profile, ProfileInput } from "../types"

const AUTHENTICATION_ERROR: ApiError = {
  code: "UNAUTHENTICATED",
  message: "Sign in to access your profile.",
}

const PROFILE_LOAD_ERROR: ApiError = {
  code: "PROFILE_LOAD_FAILED",
  message: "Unable to load your profile. Please try again.",
}

const PROFILE_UPDATE_ERROR: ApiError = {
  code: "PROFILE_UPDATE_FAILED",
  message: "Your changes could not be saved. Please try again.",
}

export async function getCurrentProfile(): Promise<ActionResult<Profile>> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: AUTHENTICATION_ERROR }
  }

  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, full_name, date_of_birth, goal, unit_system, profile_completed, created_at, updated_at",
    )
    .eq("id", user.id)
    .maybeSingle()

  if (error) {
    return { success: false, error: PROFILE_LOAD_ERROR }
  }

  if (data) {
    return { success: true, data }
  }

  const { data: createdProfile, error: createError } = await supabase
    .from("profiles")
    .insert({ id: user.id })
    .select(
      "id, full_name, date_of_birth, goal, unit_system, profile_completed, created_at, updated_at",
    )
    .single()

  if (createError) {
    return { success: false, error: PROFILE_LOAD_ERROR }
  }

  return { success: true, data: createdProfile }
}

export async function updateCurrentProfile(
  input: ProfileInput,
): Promise<ActionResult<Profile>> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: AUTHENTICATION_ERROR }
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: input.fullName,
      date_of_birth: input.dateOfBirth || null,
      goal: input.goal || null,
      unit_system: input.unitSystem,
    })
    .eq("id", user.id)
    .select(
      "id, full_name, date_of_birth, goal, unit_system, profile_completed, created_at, updated_at",
    )
    .single()

  if (error) {
    return { success: false, error: PROFILE_UPDATE_ERROR }
  }

  return { success: true, data }
}

