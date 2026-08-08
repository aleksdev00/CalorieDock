import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { WaterUnit } from "@/types/database"
import type { WaterEntry } from "../types"
import { formatWaterAmount } from "../utils/water"
import { DeleteWaterEntryButton } from "./DeleteWaterEntryButton"

export function WaterHistory({ entries, waterUnit, timeZone }: { entries: WaterEntry[]; waterUnit: WaterUnit; timeZone: string }) {
  if (entries.length === 0) return <section className="rounded-2xl border border-dashed p-10 text-center"><h2 className="text-lg font-semibold">No water entries yet</h2><p className="mt-2 text-sm text-muted-foreground">Add your first drink to begin tracking hydration.</p><Button asChild className="mt-5"><Link href={`/water/new?timeZone=${encodeURIComponent(timeZone)}`}>Add water</Link></Button></section>
  return <section aria-labelledby="water-history-heading"><h2 id="water-history-heading" className="mb-4 text-xl font-semibold">Hydration history</h2><div className="space-y-3">{entries.map((entry) => <article key={entry.id} className="rounded-2xl border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-muted-foreground">{new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short", timeZone }).format(new Date(entry.consumed_at))}</p><p className="mt-1 text-xl font-semibold">{formatWaterAmount(entry.amount_ml, waterUnit)}</p></div><div className="flex items-start gap-2"><Button asChild variant="outline" size="sm"><Link href={`/water/${entry.id}/edit?timeZone=${encodeURIComponent(timeZone)}`}>Edit</Link></Button><DeleteWaterEntryButton entryId={entry.id}/></div></div></article>)}</div></section>
}
