import Link from "next/link"
import { ArrowRight, Droplets, Plus, Scale, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatWaterAmount } from "@/features/water-tracking"
import { formatDisplayWeight } from "@/features/weight-tracking"
import type { DashboardData } from "../types"
import { formatNumber, formatSelectedDate, formatZonedDateTime } from "@/features/daily-summary/utils/daily-summary"

const quickActions = [
  { href: "/meals/new", label: "Add meal", icon: Plus },
  { href: "/water/new", label: "Add water", icon: Droplets },
  { href: "/weight/new", label: "Add weight", icon: Scale },
  { href: "/foods", label: "Search foods", icon: Search },
]

const navigation = [
  ["Daily Summary", "/daily-summary"],
  ["Meals", "/meals"],
  ["Foods", "/foods"],
  ["Weight", "/weight"],
  ["Water", "/water"],
  ["Profile", "/profile"],
] as const

function greeting(timeZone: string) {
  const hour = Number(new Intl.DateTimeFormat("en", { hour: "numeric", hourCycle: "h23", timeZone }).format(new Date()))
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </article>
  )
}

export function DashboardPage({ dashboard }: { dashboard: DashboardData }) {
  const { nutrition, meals, weight, profile } = dashboard
  const name = profile.fullName?.trim().split(/\s+/)[0]
  const weightSystem = dashboard.weightUnit === "lbs" ? "imperial" : "metric"
  const weightUnit = dashboard.weightUnit === "lbs" ? "lb" : "kg"
  const summaryHref = `/daily-summary?${new URLSearchParams({ date: dashboard.selectedDate, timeZone: dashboard.timeZone }).toString()}`

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Today at CalorieDock</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{greeting(dashboard.timeZone)}{name ? `, ${name}` : ""}.</h1>
          <p className="mt-2 text-muted-foreground">{formatSelectedDate(dashboard.selectedDate)} · {dashboard.timeZone}</p>
        </div>
        <Button asChild variant="outline"><Link href="/profile">View profile</Link></Button>
      </header>

      <section aria-labelledby="nutrition-heading" className="mt-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div><h2 id="nutrition-heading" className="text-2xl font-semibold">Today’s nutrition</h2><p className="mt-1 text-sm text-muted-foreground">Totals from the foods recorded in today’s meals.</p></div>
          <Button asChild variant="ghost"><Link href={summaryHref}>Open Daily Summary <ArrowRight /></Link></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Calories" value={`${formatNumber(nutrition.calories)} kcal`} detail={`${dashboard.mealCount} ${dashboard.mealCount === 1 ? "meal" : "meals"} logged`} />
          <MetricCard label="Protein" value={`${formatNumber(nutrition.protein)} g`} detail="Consumed today" />
          <MetricCard label="Carbohydrates" value={`${formatNumber(nutrition.carbohydrates)} g`} detail="Consumed today" />
          <MetricCard label="Fat" value={`${formatNumber(nutrition.fat)} g`} detail="Consumed today" />
        </div>
      </section>

      <section aria-labelledby="quick-actions-heading" className="mt-8">
        <h2 id="quick-actions-heading" className="text-xl font-semibold">Quick actions</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map(({ href, label, icon: Icon }) => <Button key={href} asChild variant="outline" className="h-auto justify-start gap-3 p-4"><Link href={href}><Icon aria-hidden="true" />{label}</Link></Button>)}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="meals-heading" className="rounded-2xl border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="flex items-end justify-between gap-3"><div><h2 id="meals-heading" className="text-2xl font-semibold">Today’s meals</h2><p className="mt-1 text-sm text-muted-foreground">Chronological meal overview</p></div><Button asChild variant="ghost"><Link href="/meals">All meals</Link></Button></div>
          {meals.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed p-8 text-center"><h3 className="font-semibold">No meals tracked today</h3><p className="mt-2 text-sm text-muted-foreground">Add your first meal to see today’s nutrition.</p><Button asChild className="mt-5"><Link href="/meals/new">Add meal</Link></Button></div>
          ) : (
            <div className="mt-5 divide-y">{meals.map((meal) => <Link key={meal.id} href={`/meals/${meal.id}`} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:text-primary"><div><p className="font-semibold">{meal.name}</p><p className="mt-1 text-sm text-muted-foreground">{meal.meal_type} · {formatZonedDateTime(meal.consumed_at, dashboard.timeZone)}</p></div><p className="shrink-0 font-semibold">{formatNumber(meal.totals.calories)} kcal</p></Link>)}</div>
          )}
        </section>

        <div className="space-y-6">
          <section aria-labelledby="hydration-heading" className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between"><h2 id="hydration-heading" className="text-xl font-semibold">Hydration</h2><Droplets className="text-primary" aria-hidden="true" /></div>
            {dashboard.hydrationMl > 0 ? <><p className="mt-4 text-3xl font-bold">{formatWaterAmount(dashboard.hydrationMl, dashboard.waterUnit)}</p><p className="mt-2 text-sm text-muted-foreground">Recorded today</p></> : <><p className="mt-4 font-semibold">No water recorded today</p><p className="mt-2 text-sm text-muted-foreground">Add an entry to start tracking hydration.</p></>}
            <Button asChild variant="outline" className="mt-5 w-full"><Link href="/water">View water</Link></Button>
          </section>

          <section aria-labelledby="weight-heading" className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between"><h2 id="weight-heading" className="text-xl font-semibold">Latest weight</h2><Scale className="text-primary" aria-hidden="true" /></div>
            {weight ? <><p className="mt-4 text-3xl font-bold">{formatDisplayWeight(weight.weightKg, weightSystem)} {weightUnit}</p><p className="mt-2 text-sm text-muted-foreground">Recorded {formatZonedDateTime(weight.recordedAt, dashboard.timeZone)}</p></> : <><p className="mt-4 font-semibold">No weight data available</p><p className="mt-2 text-sm text-muted-foreground">Add your first measurement to track progress.</p></>}
            <Button asChild variant="outline" className="mt-5 w-full"><Link href="/weight">View weight</Link></Button>
          </section>
        </div>
      </div>

      <nav aria-label="Dashboard navigation" className="mt-8 rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="text-xl font-semibold">Explore CalorieDock</h2>
        <div className="mt-4 flex flex-wrap gap-2">{navigation.map(([label, href]) => <Button key={href} asChild variant="ghost"><Link href={label === "Daily Summary" ? summaryHref : href}>{label}</Link></Button>)}</div>
      </nav>

      <p className="mt-6 text-sm text-muted-foreground">Goals and percentages are omitted because the approved MVP data model does not store numeric nutrition, hydration, or target-weight goals.</p>
    </main>
  )
}
