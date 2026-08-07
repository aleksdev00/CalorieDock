import Link from "next/link"

import type { FoodSearchItem } from "../types"

interface FoodCardProps { food: FoodSearchItem }

const SOURCE_LABELS = { system: "CalorieDock", custom: "Your custom food", open_food_facts: "Open Food Facts" } as const

export function FoodCard({ food }: FoodCardProps) {
  const content = (
    <article className="h-full rounded-xl border bg-card p-5 shadow-sm transition hover:border-foreground/25">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{SOURCE_LABELS[food.source]}</p>
          <h2 className="mt-1 text-lg font-semibold">{food.name}</h2>
          <p className="text-sm text-muted-foreground">{food.brand ?? food.category}</p>
        </div>
        <p className="whitespace-nowrap text-sm font-semibold">{food.calories} kcal</p>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-2 text-sm">
        <div><dt className="text-muted-foreground">Protein</dt><dd className="font-medium">{food.protein} g</dd></div>
        <div><dt className="text-muted-foreground">Carbs</dt><dd className="font-medium">{food.carbohydrates} g</dd></div>
        <div><dt className="text-muted-foreground">Fat</dt><dd className="font-medium">{food.fat} g</dd></div>
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">Nutrition per {food.servingSize} {food.servingUnit}</p>
    </article>
  )
  return food.isExternal ? content : <Link href={`/foods/${food.id}`} className="block h-full">{content}</Link>
}
