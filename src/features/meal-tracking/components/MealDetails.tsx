import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { MealWithItems } from "../types"
import { calculateTotals } from "../utils/nutrition"
import { DeleteMealButton } from "./DeleteMealButton"
import { MealFoodForm } from "./MealFoodForm"
import { MealItemRow } from "./MealItemRow"

export function MealDetails({ meal }: { meal: MealWithItems }) {
  const totals = calculateTotals(meal.meal_items)
  return <div className="space-y-8"><section className="rounded-2xl border bg-card p-5"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-sm capitalize text-muted-foreground">{meal.meal_type} · {new Date(meal.consumed_at).toLocaleString()}</p><h1 className="mt-1 text-3xl font-bold tracking-tight">{meal.name}</h1></div><div className="flex gap-2"><Button asChild variant="outline"><Link href={`/meals/${meal.id}/edit`}>Edit meal</Link></Button><DeleteMealButton mealId={meal.id} /></div></div><div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-4 text-sm sm:grid-cols-4"><p><strong>{totals.calories}</strong> kcal</p><p><strong>{totals.protein}</strong> g protein</p><p><strong>{totals.carbohydrates}</strong> g carbs</p><p><strong>{totals.fat}</strong> g fat</p></div></section><section><h2 className="text-xl font-semibold">Foods</h2>{meal.meal_items.length ? <ul className="mt-4 space-y-3">{meal.meal_items.map((item) => <MealItemRow key={item.id} mealId={meal.id} item={item} />)}</ul> : <p className="mt-3 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">This meal has no foods yet.</p>}</section><section><h2 className="text-xl font-semibold">Add food</h2><p className="mb-4 mt-1 text-sm text-muted-foreground">Nutrition is calculated from the selected food per 100 g and saved as a historical snapshot.</p><MealFoodForm mealId={meal.id} /></section></div>
}
