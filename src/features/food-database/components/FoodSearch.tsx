"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"

import { useFoodSearch } from "../hooks/use-food-search"
import type { FoodSearchFilters } from "../types"
import { FoodCard } from "./FoodCard"

export function FoodSearch() {
  const [draft, setDraft] = useState("")
  const [draftCategory, setDraftCategory] = useState("")
  const [filters, setFilters] = useState<FoodSearchFilters>({ query: "", source: "all" })
  const search = useFoodSearch(filters)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFilters((current) => ({
      ...current,
      query: draft.trim(),
      category: draftCategory.trim() || undefined,
    }))
  }

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-card p-4 lg:grid-cols-[1fr_12rem_12rem_auto]">
        <label className="sr-only" htmlFor="food-search">Search foods</label>
        <input id="food-search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Search name, brand, barcode, or category" maxLength={80} className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30" />
        <label className="sr-only" htmlFor="food-category">Category filter</label>
        <input id="food-category" value={draftCategory} onChange={(event) => setDraftCategory(event.target.value)} placeholder="Any category" maxLength={80} className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30" />
        <label className="sr-only" htmlFor="food-source">Food source</label>
        <select id="food-source" value={filters.source} onChange={(event) => setFilters((current) => ({ ...current, source: event.target.value as FoodSearchFilters["source"] }))} className="h-10 rounded-lg border bg-background px-3 text-sm">
          <option value="all">All sources</option><option value="custom">My foods</option><option value="system">CalorieDock</option><option value="open_food_facts">Open Food Facts</option>
        </select>
        <Button type="submit" size="lg">Search</Button>
      </form>

      {search.isPending ? <p className="text-sm text-muted-foreground" role="status">Searching foods...</p> : null}
      {search.isError ? <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">{search.error.message}</p> : null}
      {search.data?.externalUnavailable ? <p className="rounded-lg border p-4 text-sm" role="status">Open Food Facts is temporarily unavailable. Internal and cached foods are still available.</p> : null}
      {search.data && search.data.items.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center"><h2 className="font-semibold">No foods found</h2><p className="mt-2 text-sm text-muted-foreground">Try another search or create a custom food.</p><Button asChild className="mt-5"><Link href="/foods/new">Create custom food</Link></Button></div>
      ) : null}
      {search.data && search.data.items.length > 0 ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{search.data.items.map((food) => <FoodCard key={food.id} food={food} />)}</div> : null}
    </div>
  )
}
