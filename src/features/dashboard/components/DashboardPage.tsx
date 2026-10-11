import Link from "next/link"
import { ArrowRight, Coffee, Droplets, Plus, Scale, Search, Utensils } from "lucide-react"

import { NutritionOverview } from "@/components/nutrition/NutritionOverview"
import { Button } from "@/components/ui/button"
import { formatWaterAmount } from "@/features/water-tracking"
import { formatDisplayWeight } from "@/features/weight-tracking"
import { formatNumber, formatSelectedDate, formatZonedDateTime } from "@/features/daily-summary/utils/daily-summary"
import type { DashboardData } from "../types"

function greeting(timeZone: string) {
  const hour = Number(new Intl.DateTimeFormat("en", { hour: "numeric", hourCycle: "h23", timeZone }).format(new Date()))
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function DashboardPage({ dashboard }: { dashboard: DashboardData }) {
  const { nutrition, meals, weight, profile } = dashboard
  const name = profile.fullName?.trim().split(/\s+/)[0]
  const weightUnit = dashboard.weightUnit === "lbs" ? "lb" : "kg"
  const summaryHref = `/daily-summary?${new URLSearchParams({ date: dashboard.selectedDate, timeZone: dashboard.timeZone }).toString()}`

  return (
    <main className="mx-auto w-full max-w-6xl py-4 sm:py-6">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your daily overview</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{greeting(dashboard.timeZone)}{name ? `, ${name}` : ""}.</h1>
          <p className="mt-2 text-sm text-muted-foreground">{formatSelectedDate(dashboard.selectedDate)} <span className="ml-1 text-xs">· {dashboard.timeZone}</span></p>
        </div>
        <Button asChild size="lg" className="h-12 rounded-xl px-6"><Link href="/meals/new"><Plus aria-hidden="true" /> Add meal</Link></Button>
      </header>

      <section aria-label="Today’s nutrition" className="mt-8">
        <NutritionOverview calories={formatNumber(nutrition.calories)} protein={formatNumber(nutrition.protein)} carbohydrates={formatNumber(nutrition.carbohydrates)} fat={formatNumber(nutrition.fat)} mealCount={dashboard.mealCount} />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="meals-heading" className="rounded-3xl border bg-card p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div><h2 id="meals-heading" className="text-xl font-semibold tracking-tight">Today’s meals</h2><p className="mt-1 text-sm text-muted-foreground">A little structure for your day.</p></div>
            <Button asChild variant="ghost" size="sm"><Link href="/meals">All meals <ArrowRight aria-hidden="true" /></Link></Button>
          </div>
          {meals.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed bg-muted/30 px-5 py-10 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent text-primary"><Utensils aria-hidden="true" /></span>
              <h3 className="mt-4 font-semibold">Your day starts with one meal.</h3><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Add what you ate and your nutrition totals will appear here.</p>
              <Button asChild className="mt-5"><Link href="/meals/new"><Plus aria-hidden="true" /> Add your first meal</Link></Button>
            </div>
          ) : (
            <ul className="mt-5 divide-y">{meals.map((meal) => (
              <li key={meal.id}><Link href={`/meals/${meal.id}`} className="group flex items-center gap-3 rounded-lg py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">{meal.meal_type === "breakfast" ? <Coffee className="size-5" aria-hidden="true" /> : <Utensils className="size-5" aria-hidden="true" />}</span>
                <div className="min-w-0 flex-1"><p className="break-words font-semibold group-hover:text-primary">{meal.name}</p><p className="mt-1 text-xs text-muted-foreground"><span className="capitalize">{meal.meal_type}</span> · {formatZonedDateTime(meal.consumed_at, dashboard.timeZone)}</p></div>
                <p className="shrink-0 text-right font-semibold tabular-nums">{formatNumber(meal.totals.calories)}<span className="mt-0.5 block text-xs font-normal text-muted-foreground">kcal</span></p>
              </Link></li>
            ))}</ul>
          )}
          <Button asChild variant="outline" className="mt-5 h-11 w-full rounded-xl"><Link href="/foods"><Search aria-hidden="true" /> Find a food</Link></Button>
        </section>

        <div className="space-y-4">
          <section aria-labelledby="hydration-heading" className="rounded-3xl border bg-card p-6">
            <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-accent text-primary"><Droplets className="size-5" aria-hidden="true" /></span><h2 id="hydration-heading" className="font-semibold">Hydration</h2></div>
            <p className="mt-5 text-3xl font-semibold tracking-tight tabular-nums">{formatWaterAmount(dashboard.hydrationMl, dashboard.waterUnit)}</p>
            <p className="mt-1 text-sm text-muted-foreground">{dashboard.hydrationMl > 0 ? "Water recorded today" : "No water recorded yet today"}</p>
            <div className="mt-5 flex items-center gap-2"><Button asChild variant="outline" className="flex-1 rounded-xl"><Link href="/water/new"><Plus aria-hidden="true" /> Add water</Link></Button><Button asChild variant="ghost" size="sm"><Link href="/water">History</Link></Button></div>
          </section>
          <section aria-labelledby="weight-heading" className="rounded-3xl border bg-card p-6">
            <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground"><Scale className="size-5" aria-hidden="true" /></span><h2 id="weight-heading" className="font-semibold">Latest weight</h2></div>
            {weight ? <><p className="mt-5 text-3xl font-semibold tracking-tight tabular-nums">{formatDisplayWeight(weight.weightKg, dashboard.weightUnit)} <span className="text-sm font-normal text-muted-foreground">{weightUnit}</span></p><p className="mt-1 text-xs text-muted-foreground">Recorded {formatZonedDateTime(weight.recordedAt, dashboard.timeZone)}</p></> : <><p className="mt-5 text-lg font-semibold">Your first measurement</p><p className="mt-1 text-sm text-muted-foreground">Keep a dated record of your weight.</p></>}
            <div className="mt-5 flex items-center gap-2"><Button asChild variant="outline" className="flex-1 rounded-xl"><Link href="/weight/new"><Plus aria-hidden="true" /> Add weight</Link></Button><Button asChild variant="ghost" size="sm"><Link href="/weight">History</Link></Button></div>
          </section>
        </div>
      </div>
      <Link href={summaryHref} className="mt-6 flex items-center justify-between gap-4 rounded-2xl border bg-card px-5 py-4 text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><span><span className="font-semibold">See the whole picture.</span><span className="ml-2 text-muted-foreground">Open your daily summary.</span></span><ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link>
    </main>
  )
}
