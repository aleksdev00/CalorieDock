import type { WeightHistoryItem, WeightUnit } from "../types"
import { displayUnit, formatDisplayWeight } from "../utils/weight"

export function WeightTrendChart({ entries, weightUnit }: { entries: WeightHistoryItem[]; weightUnit: WeightUnit }) {
  if (entries.length < 2) return null
  const chronological = [...entries].reverse(); const values = chronological.map((entry) => entry.weight_kg); const min = Math.min(...values); const max = Math.max(...values); const span = max - min || 1
  const points = chronological.map((entry, index) => `${(index / (chronological.length - 1)) * 100},${90 - ((entry.weight_kg - min) / span) * 80}`).join(" ")
  return <section className="rounded-2xl border bg-card p-5" aria-labelledby="trend-chart-heading"><div className="flex items-baseline justify-between gap-3"><h2 id="trend-chart-heading" className="text-xl font-semibold">Weight trend</h2><p className="text-sm text-muted-foreground">{formatDisplayWeight(min, weightUnit)}–{formatDisplayWeight(max, weightUnit)} {displayUnit(weightUnit)}</p></div><svg className="mt-5 h-52 w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Weight history line chart"><line x1="0" y1="90" x2="100" y2="90" vectorEffect="non-scaling-stroke" className="stroke-border"/><polyline points={points} fill="none" vectorEffect="non-scaling-stroke" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><div className="flex justify-between text-xs text-muted-foreground"><span>{new Date(chronological[0].recorded_at).toLocaleDateString()}</span><span>{new Date(chronological[chronological.length - 1].recorded_at).toLocaleDateString()}</span></div></section>
}
