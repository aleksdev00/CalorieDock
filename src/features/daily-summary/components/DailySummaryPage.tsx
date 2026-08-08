import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatWaterAmount } from "@/features/water-tracking"
import { formatDisplayWeight } from "@/features/weight-tracking"
import type { DailySummaryData } from "../types"
import { formatNumber, formatSelectedDate, formatZonedDateTime } from "../utils/daily-summary"
import { DailySummaryToolbar } from "./DailySummaryToolbar"

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="rounded-2xl border bg-card p-5 shadow-sm"><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight">{value}</p><p className="mt-2 text-sm text-muted-foreground">{detail}</p></article>
}

export function DailySummaryPage({ summary }: { summary: DailySummaryData }) {
  const { nutrition, meals, weight } = summary
  const weightSystem = summary.weightUnit === "lbs" ? "imperial" : "metric"
  const weightValue = weight ? formatDisplayWeight(weight.weightKg, weightSystem) : null
  const weightUnit = summary.weightUnit === "lbs" ? "lb" : "kg"
  return <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
    <header className="mb-8"><p className="text-sm font-medium text-primary">Daily summary</p><h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{formatSelectedDate(summary.selectedDate)}</h1><p className="mt-2 text-muted-foreground">Nutrition, hydration, meals, and the latest available weight for this day.</p></header>
    <div className="space-y-8">
      <DailySummaryToolbar selectedDate={summary.selectedDate} timeZone={summary.timeZone}/>
      <section aria-label="Daily totals" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Calories" value={`${formatNumber(nutrition.calories)} kcal`} detail={`${summary.mealCount} ${summary.mealCount === 1 ? "meal" : "meals"}`}/>
        <Metric label="Protein" value={`${formatNumber(nutrition.protein)} g`} detail="Meal-item snapshots"/>
        <Metric label="Carbohydrates" value={`${formatNumber(nutrition.carbohydrates)} g`} detail="Meal-item snapshots"/>
        <Metric label="Fat" value={`${formatNumber(nutrition.fat)} g`} detail="Meal-item snapshots"/>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <Metric label="Hydration" value={formatWaterAmount(summary.hydrationMl, summary.waterUnit)} detail="Total consumed during the selected local day"/>
        <Metric label="Latest weight by day end" value={weightValue ? `${weightValue} ${weightUnit}` : "No entry"} detail={weight ? `Recorded ${formatZonedDateTime(weight.recordedAt, summary.timeZone)}` : "No weight was recorded on or before this day."}/>
      </section>
      <section aria-labelledby="meal-overview-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 id="meal-overview-heading" className="text-2xl font-semibold">Meal overview</h2><p className="mt-1 text-sm text-muted-foreground">Nutrition is preserved from the values captured when each item was logged.</p></div><Button asChild variant="outline"><Link href="/meals">Manage meals</Link></Button></div>
        {meals.length === 0 ? <div className="rounded-2xl border border-dashed bg-card p-8 text-center"><h3 className="font-semibold">No meals for this day</h3><p className="mt-2 text-sm text-muted-foreground">Meals logged inside this local calendar day will appear here.</p></div> : <div className="space-y-4">{meals.map((meal) => <article key={meal.id} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">{meal.meal_type}</p><h3 className="mt-1 text-lg font-semibold">{meal.name}</h3><p className="mt-1 text-sm text-muted-foreground">{formatZonedDateTime(meal.consumed_at, summary.timeZone)} · {meal.meal_items.length} {meal.meal_items.length === 1 ? "item" : "items"}</p></div><p className="font-semibold">{formatNumber(meal.totals.calories)} kcal</p></div><div className="mt-4 grid grid-cols-3 gap-3 border-t pt-4 text-sm"><p><span className="block text-muted-foreground">Protein</span>{formatNumber(meal.totals.protein)} g</p><p><span className="block text-muted-foreground">Carbs</span>{formatNumber(meal.totals.carbohydrates)} g</p><p><span className="block text-muted-foreground">Fat</span>{formatNumber(meal.totals.fat)} g</p></div></article>)}</div>}
      </section>
      <aside className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">Numeric calorie, macro, hydration, and target-weight goals are not shown because CalorieDock’s approved MVP tables do not store them. Your profile goal is directional context only.</aside>
    </div>
  </main>
}
