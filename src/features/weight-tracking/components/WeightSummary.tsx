import type { UnitSystem } from "@/types/database"
import type { WeightProgress } from "../types"
import { displayUnit, formatDisplayWeight, kilogramsToDisplay } from "../utils/weight"

function change(value: number | null, unitSystem: UnitSystem) {
  if (value === null) return "Not enough history"
  const shown = kilogramsToDisplay(value, unitSystem)
  return `${shown > 0 ? "+" : ""}${shown.toFixed(1)} ${displayUnit(unitSystem)}`
}

export function WeightSummary({ progress, unitSystem }: { progress: WeightProgress; unitSystem: UnitSystem }) {
  if (progress.latestKg === null) return null
  const cards = [
    ["Latest", `${formatDisplayWeight(progress.latestKg, unitSystem)} ${displayUnit(unitSystem)}`],
    ["Starting", `${formatDisplayWeight(progress.startingKg!, unitSystem)} ${displayUnit(unitSystem)}`],
    ["Total change", change(progress.totalChangeKg, unitSystem)],
    ["7-day change", change(progress.weeklyChangeKg, unitSystem)],
    ["Monthly change", change(progress.monthlyChangeKg, unitSystem)],
    ["Trend", progress.direction ?? "Not available"],
  ]
  const alignment = progress.goalAlignment === "toward_goal" ? "Moving toward your profile goal" : progress.goalAlignment === "away_from_goal" ? "Moving away from your profile goal" : progress.goalAlignment === "stable" ? "Weight is stable" : null
  return <section aria-labelledby="progress-heading"><div className="mb-4 flex flex-wrap items-baseline justify-between gap-2"><h2 id="progress-heading" className="text-xl font-semibold">Progress</h2>{alignment ? <p className="text-sm text-muted-foreground">{alignment}</p> : null}</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([label, value]) => <div key={label} className="rounded-2xl border bg-card p-4"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold capitalize">{value}</p></div>)}</div></section>
}
