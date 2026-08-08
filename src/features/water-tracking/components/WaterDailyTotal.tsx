import type { WaterUnit } from "@/types/database"
import { formatWaterAmount } from "../utils/water"

export function WaterDailyTotal({ amountMl, selectedDate, waterUnit }: { amountMl: number; selectedDate: string; waterUnit: WaterUnit }) {
  return <section aria-labelledby="daily-water-heading" className="rounded-2xl border bg-primary/5 p-6"><p className="text-sm font-medium text-muted-foreground">{selectedDate}</p><h2 id="daily-water-heading" className="mt-1 text-lg font-semibold">Daily hydration total</h2><p className="mt-3 text-4xl font-bold tracking-tight text-primary">{formatWaterAmount(amountMl, waterUnit)}</p><p className="mt-2 text-sm text-muted-foreground">Calculated dynamically from entries for this local calendar day.</p></section>
}
