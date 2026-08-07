"use client"

import { FormEvent, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { useFoodSearch } from "@/features/food-database/hooks/use-food-search"
import type { FoodSearchItem } from "@/features/food-database/types"
import { addMealItemAction, replaceMealItemAction } from "../actions"
import type { MealActionState } from "../types"

const INPUT = "h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"

export function MealFoodForm({ mealId, replaceItemId, onDone }: { mealId: string; replaceItemId?: string; onDone?: () => void }) {
  const [draft, setDraft] = useState("")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<FoodSearchItem | null>(null)
  const [quantity, setQuantity] = useState(100)
  const [state, setState] = useState<MealActionState>({ status: "idle" })
  const [pending, startTransition] = useTransition()
  const search = useFoodSearch({ query, source: "all" })

  function searchSubmit(event: FormEvent) { event.preventDefault(); setSelected(null); setQuery(draft.trim()) }
  function save() {
    if (!selected) { setState({ status: "error", message: "Select a food first." }); return }
    startTransition(async () => {
      const input = { foodReference: selected.id, quantityGrams: quantity }
      const result = replaceItemId ? await replaceMealItemAction(mealId, replaceItemId, input) : await addMealItemAction(mealId, input)
      setState(result)
      if (result.status === "success") { setSelected(null); setDraft(""); setQuery(""); setQuantity(100); onDone?.() }
    })
  }

  return <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
    <form onSubmit={searchSubmit} className="flex flex-col gap-2 sm:flex-row"><label className="sr-only" htmlFor={`food-search-${replaceItemId ?? "new"}`}>Search food</label><input id={`food-search-${replaceItemId ?? "new"}`} value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={80} placeholder="Search name, brand, or barcode" className={INPUT} /><Button type="submit" variant="outline">Search</Button></form>
    {search.isPending ? <p role="status" className="text-sm text-muted-foreground">Searching...</p> : null}
    {search.isError ? <p role="alert" className="text-sm text-destructive">{search.error.message}</p> : null}
    {search.data?.items.length ? <div className="max-h-64 space-y-2 overflow-y-auto">{search.data.items.map((food) => <button type="button" key={food.id} onClick={() => setSelected(food)} className={`w-full rounded-lg border p-3 text-left text-sm ${selected?.id === food.id ? "border-primary bg-primary/5" : "bg-background"}`}><span className="font-medium">{food.name}</span>{food.brand ? <span className="text-muted-foreground"> · {food.brand}</span> : null}<span className="mt-1 block text-xs text-muted-foreground">{food.calories} kcal / 100 g · {food.source.replaceAll("_", " ")}</span></button>)}</div> : query && !search.isPending ? <p className="text-sm text-muted-foreground">No foods found.</p> : null}
    {selected ? <div className="grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-end"><p className="text-sm"><span className="font-medium">Selected:</span> {selected.name}</p><div><label htmlFor={`quantity-${replaceItemId ?? "new"}`} className="text-sm font-medium">Quantity (g)</label><input id={`quantity-${replaceItemId ?? "new"}`} type="number" min="0.01" max="100000" step="0.01" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className={INPUT} /></div><Button type="button" disabled={pending} onClick={save}>{pending ? "Saving..." : replaceItemId ? "Replace food" : "Add food"}</Button></div> : null}
    {state.message ? <p role="alert" className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-primary"}>{state.message}</p> : null}
  </div>
}
