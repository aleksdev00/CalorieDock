import type { ProfileGoal, UnitSystem } from "@/types/database"

export interface WeightEntry {
  id: string
  user_id: string
  weight_kg: number
  recorded_at: string
  note: string | null
  created_at: string
  updated_at: string
}

export interface WeightEntryInput {
  weight: number
  recordedAt: string
  note: string
}

export type TrendDirection = "increasing" | "decreasing" | "stable"
export type GoalAlignment = "toward_goal" | "away_from_goal" | "stable" | null

export interface WeightHistoryItem extends WeightEntry {
  changeKg: number | null
}

export interface WeightProgress {
  latestKg: number | null
  startingKg: number | null
  totalChangeKg: number | null
  weeklyChangeKg: number | null
  monthlyChangeKg: number | null
  direction: TrendDirection | null
  goalAlignment: GoalAlignment
}

export interface WeightPageData {
  entries: WeightHistoryItem[]
  progress: WeightProgress
  unitSystem: UnitSystem
  goal: ProfileGoal | null
}

export type WeightActionState = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Record<string, string[]>
}
