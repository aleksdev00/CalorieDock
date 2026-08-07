import Link from "next/link"

import { Button } from "@/components/ui/button"

import type { Food } from "../types"
import { DeleteFoodButton } from "./DeleteFoodButton"

const SOURCE_LABELS = { system: "CalorieDock internal database", custom: "Your custom food", open_food_facts: "Open Food Facts" } as const

export function FoodDetails({ food, canEdit }: { food: Food; canEdit: boolean }) {
  const nutrients = [
    ["Calories", food.calories, "kcal"], ["Protein", food.protein, "g"],
    ["Carbohydrates", food.carbohydrates, "g"], ["Fat", food.fat, "g"],
    ["Fiber", food.fiber, "g"], ["Sugar", food.sugar, "g"], ["Sodium", food.sodium, "mg"],
  ] as const
  return <div className="space-y-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-muted-foreground">{food.brand ?? food.category}</p><h1 className="mt-1 text-3xl font-bold tracking-tight">{food.name}</h1><p className="mt-2 text-sm text-muted-foreground">Source: {SOURCE_LABELS[food.source]}</p></div>{canEdit ? <div className="flex gap-2"><Button asChild variant="outline"><Link href={`/foods/${food.id}/edit`}>Edit</Link></Button><DeleteFoodButton foodId={food.id} /></div> : null}</div><section><h2 className="text-lg font-semibold">Nutrition per {food.serving_size} {food.serving_unit}</h2><dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{nutrients.map(([label, value, unit]) => <div className="rounded-xl border bg-card p-4" key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 text-xl font-semibold">{value === null ? "Unavailable" : `${value} ${unit}`}</dd></div>)}</dl></section>{food.barcode ? <p className="text-sm text-muted-foreground">Barcode: {food.barcode}</p> : null}<Button asChild variant="outline"><Link href="/foods">Back to foods</Link></Button></div>
}
