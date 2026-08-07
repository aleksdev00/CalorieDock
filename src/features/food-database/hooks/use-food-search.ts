"use client"

import { useQuery } from "@tanstack/react-query"

import type { FoodSearchFilters, FoodSearchResponse } from "../types"

export const foodQueryKeys = {
  search: (filters: FoodSearchFilters) => ["foods", "search", filters] as const,
}

async function requestFoods(filters: FoodSearchFilters): Promise<FoodSearchResponse> {
  const parameters = new URLSearchParams({ query: filters.query, source: filters.source ?? "all" })
  if (filters.category) parameters.set("category", filters.category)
  const response = await fetch(`/api/foods/search?${parameters}`)
  const body = (await response.json()) as { data?: FoodSearchResponse; error?: { message?: string } }
  if (!response.ok || !body.data) throw new Error(body.error?.message ?? "Unable to search foods.")
  return body.data
}

export function useFoodSearch(filters: FoodSearchFilters) {
  return useQuery({ queryKey: foodQueryKeys.search(filters), queryFn: () => requestFoods(filters) })
}
