import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { UnitSystem } from "@/types/database"
import type { WeightHistoryItem } from "../types"
import { displayUnit, formatDisplayWeight, kilogramsToDisplay } from "../utils/weight"
import { DeleteWeightEntryButton } from "./DeleteWeightEntryButton"

function formatChange(changeKg: number | null, unitSystem: UnitSystem) {
  if (changeKg === null) return "Starting entry"
  const value = kilogramsToDisplay(changeKg, unitSystem)
  return `${value > 0 ? "+" : ""}${value.toFixed(1)} ${displayUnit(unitSystem)}`
}

export function WeightHistory({ entries, unitSystem }: { entries: WeightHistoryItem[]; unitSystem: UnitSystem }) {
  if (entries.length === 0) return <section className="rounded-2xl border border-dashed p-10 text-center"><h2 className="text-lg font-semibold">No weight entries yet</h2><p className="mt-2 text-sm text-muted-foreground">Log your first measurement to start seeing progress.</p><Button asChild className="mt-5"><Link href="/weight/new">Log weight</Link></Button></section>
  return <section aria-labelledby="weight-history-heading"><h2 id="weight-history-heading" className="mb-4 text-xl font-semibold">Weight history</h2><div className="space-y-3">{entries.map((entry) => <article key={entry.id} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-muted-foreground">{new Date(entry.recorded_at).toLocaleString()}</p><p className="mt-1 text-xl font-semibold">{formatDisplayWeight(entry.weight_kg, unitSystem)} {displayUnit(unitSystem)}</p><p className="mt-1 text-sm text-muted-foreground">{formatChange(entry.changeKg, unitSystem)} from previous</p>{entry.note ? <p className="mt-3 whitespace-pre-wrap text-sm">{entry.note}</p> : null}</div><div className="flex items-start gap-2"><Button asChild variant="outline" size="sm"><Link href={`/weight/${entry.id}/edit`}>Edit</Link></Button><DeleteWeightEntryButton entryId={entry.id} /></div></div></article>)}</div></section>
}
