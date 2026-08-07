import type { Database, ProfileGoal, UnitSystem } from "@/types/database"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export interface ProfileInput {
  fullName: string
  dateOfBirth: string
  goal: ProfileGoal | ""
  unitSystem: UnitSystem
}

export type ProfileActionStatus = "idle" | "success" | "error"

export interface ProfileActionState {
  status: ProfileActionStatus
  message?: string
  fieldErrors?: Record<string, string[]>
}

