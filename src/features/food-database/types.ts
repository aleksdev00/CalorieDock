import type { Database, FoodSource } from "@/types/database"

export type Food = Database["public"]["Tables"]["foods"]["Row"]

export interface FoodInput {
  name: string
  brand: string
  category: string
  barcode: string
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number | null
  sugar: number | null
  sodium: number | null
  servingSize: 100
  servingUnit: "g"
}

export interface FoodSearchFilters {
  query: string
  category?: string
  source?: "all" | FoodSource
}

export interface FoodSearchItem {
  id: string
  name: string
  brand: string | null
  category: string
  barcode: string | null
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number | null
  sugar: number | null
  sodium: number | null
  servingSize: number
  servingUnit: "g"
  source: FoodSource
  isEditable: boolean
  isExternal: boolean
}

export interface FoodSearchResponse {
  items: FoodSearchItem[]
  externalUnavailable?: boolean
}

export type FoodActionStatus = "idle" | "success" | "error"

export interface FoodActionState {
  status: FoodActionStatus
  message?: string
  fieldErrors?: Record<string, string[]>
}
