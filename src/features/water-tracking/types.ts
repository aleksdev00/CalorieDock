import type { WaterUnit } from "@/types/database"

export interface WaterEntry {
  id: string
  user_id: string
  amount_ml: number
  consumed_at: string
  created_at: string
}

export interface WaterEntryInput {
  amount: number
  consumedAt: string
  timeZone: string
}

export interface WaterPageData {
  entries: WaterEntry[]
  dailyTotalMl: number
  selectedDate: string
  timeZone: string
  waterUnit: WaterUnit
}

export type WaterActionState = {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Record<string, string[]>
}
