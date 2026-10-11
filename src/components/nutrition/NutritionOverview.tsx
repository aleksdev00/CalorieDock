import { Flame } from "lucide-react"

interface NutritionOverviewProps {
  calories: string
  protein: string
  carbohydrates: string
  fat: string
  mealCount: number
}

/** Presentational totals only: the MVP does not store numeric daily targets. */
export function NutritionOverview({ calories, protein, carbohydrates, fat, mealCount }: NutritionOverviewProps) {
  const macros = [
    { label: "Protein", value: protein, color: "bg-primary" },
    { label: "Carbs", value: carbohydrates, color: "bg-chart-2" },
    { label: "Fat", value: fat, color: "bg-chart-3" },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
      <article className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full border-[32px] border-primary-foreground/5" aria-hidden="true" />
        <div className="relative">
          <p className="flex items-center gap-2 text-sm font-medium"><Flame className="size-4" aria-hidden="true" /> Calories today</p>
          <p className="mt-5 flex flex-wrap items-baseline gap-x-3"><span className="text-5xl font-semibold tracking-[-0.06em] tabular-nums sm:text-6xl">{calories}</span><span className="text-sm text-primary-foreground/80">kcal</span></p>
          <p className="mt-5 text-sm text-primary-foreground/85">From {mealCount} {mealCount === 1 ? "meal" : "meals"} logged today</p>
        </div>
      </article>
      <article className="rounded-3xl border bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold">Your macros</p>
        <p className="mt-1 text-sm text-muted-foreground">Consumed today, in grams.</p>
        <dl className="mt-7 grid grid-cols-3 gap-3">
          {macros.map(({ label, value, color }) => (
            <div key={label} className="min-w-0">
              <dt className="flex items-center gap-2 text-xs text-muted-foreground"><span className={`size-2 shrink-0 rounded-full ${color}`} aria-hidden="true" />{label}</dt>
              <dd className="mt-3 text-2xl [overflow-wrap:anywhere] font-semibold tracking-tight tabular-nums sm:text-3xl">{value}<span className="ml-1 text-xs font-normal text-muted-foreground">g</span></dd>
            </div>
          ))}
        </dl>
      </article>
    </div>
  )
}
