import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { MealWithItems } from "../types"
import { calculateTotals } from "../utils/nutrition"

function formatNumber(value: number) { return Number(value).toFixed(1).replace(/\.0$/, "") }

export function MealTimeline({ meals }: { meals: MealWithItems[] }) {
  if (meals.length === 0) return <section className="rounded-2xl border border-dashed p-10 text-center"><h2 className="text-lg font-semibold">No meals tracked yet</h2><p className="mt-2 text-sm text-muted-foreground">Create your first meal, then add foods from the catalogue.</p><Button asChild className="mt-5"><Link href="/meals/new">Create meal</Link></Button></section>
  return <div className="space-y-4">{meals.map((meal) => {
    const totals = calculateTotals(meal.meal_items)
    return <article key={meal.id} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm capitalize text-muted-foreground">{meal.meal_type} · {new Date(meal.consumed_at).toLocaleString()}</p><h2 className="mt-1 text-xl font-semibold">{meal.name}</h2></div><Button asChild variant="outline"><Link href={`/meals/${meal.id}`}>View meal</Link></Button></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"><p><span className="font-semibold">{formatNumber(totals.calories)}</span> kcal</p><p><span className="font-semibold">{formatNumber(totals.protein)}</span> g protein</p><p><span className="font-semibold">{formatNumber(totals.carbohydrates)}</span> g carbs</p><p><span className="font-semibold">{formatNumber(totals.fat)}</span> g fat</p></div><p className="mt-4 text-sm text-muted-foreground">{meal.meal_items.length} {meal.meal_items.length === 1 ? "food" : "foods"}</p></article>
  })}</div>
}
