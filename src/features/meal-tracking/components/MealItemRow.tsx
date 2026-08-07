"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { deleteMealItemAction, updateMealItemQuantityAction } from "../actions"
import type { MealActionState, MealItem } from "../types"
import { MealFoodForm } from "./MealFoodForm"

export function MealItemRow({ mealId, item }: { mealId: string; item: MealItem }) {
  const [quantity, setQuantity] = useState(item.quantity_grams)
  const [replacing, setReplacing] = useState(false)
  const [state, setState] = useState<MealActionState>({ status: "idle" })
  const [pending, startTransition] = useTransition()
  const run = (action: () => Promise<MealActionState>) => startTransition(async () => setState(await action()))
  return <li className="rounded-xl border p-4"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-medium">{item.food_name}</p><p className="text-sm text-muted-foreground">{item.food_brand ? `${item.food_brand} · ` : ""}{item.food_source.replaceAll("_", " ")}</p><p className="mt-2 text-sm">{item.calories} kcal · P {item.protein} g · C {item.carbohydrates} g · F {item.fat} g</p></div><div className="flex flex-wrap items-end gap-2"><div><label className="block text-xs text-muted-foreground" htmlFor={`quantity-${item.id}`}>Grams</label><input id={`quantity-${item.id}`} className="h-8 w-24 rounded-lg border bg-background px-2 text-sm" type="number" min="0.01" max="100000" step="0.01" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></div><Button size="sm" variant="outline" disabled={pending} onClick={() => run(() => updateMealItemQuantityAction(mealId, item.id, quantity))}>Update</Button><Button size="sm" variant="outline" onClick={() => setReplacing((value) => !value)}>Replace</Button><Button size="sm" variant="destructive" disabled={pending} onClick={() => { if (window.confirm("Remove this food from the meal?")) run(() => deleteMealItemAction(mealId, item.id)) }}>Remove</Button></div></div>{replacing ? <div className="mt-4"><MealFoodForm mealId={mealId} replaceItemId={item.id} onDone={() => setReplacing(false)} /></div> : null}{state.message ? <p role="status" className={`mt-3 text-sm ${state.status === "error" ? "text-destructive" : "text-primary"}`}>{state.message}</p> : null}</li>
}
