import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getWaterPageData, TimezoneBootstrap, WaterDailyTotal, WaterHistory, WaterToolbar } from "@/features/water-tracking"
import { waterPageQuerySchema } from "@/features/water-tracking/schemas/water-entry.schema"

export const metadata: Metadata = { title: "Water tracking | CalorieDock" }

export default async function WaterPage({ searchParams }: { searchParams: Promise<{ date?: string; timeZone?: string }> }) {
  const parameters = await searchParams
  if (!parameters.date || !parameters.timeZone) return <TimezoneBootstrap date={parameters.date}/>
  const query = waterPageQuerySchema.safeParse({ date: parameters.date, timeZone: parameters.timeZone })
  if (!query.success) throw new Error("Invalid water tracking date or timezone.")
  const result = await getWaterPageData(query.data.date, query.data.timeZone)
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect(`/login?next=${encodeURIComponent(`/water?date=${query.data.date}&timeZone=${query.data.timeZone}`)}`)
  if (!result.success) throw new Error(result.error.message)
  const { entries, dailyTotalMl, selectedDate, timeZone, waterUnit } = result.data
  return <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-muted-foreground">Water tracking</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Hydration</h1><p className="mt-2 text-muted-foreground">Record drinks and review your daily intake.</p></div><Button asChild size="lg"><Link href={`/water/new?timeZone=${encodeURIComponent(timeZone)}`}>Add water</Link></Button></div><div className="space-y-8"><WaterToolbar selectedDate={selectedDate} timeZone={timeZone} waterUnit={waterUnit}/><WaterDailyTotal amountMl={dailyTotalMl} selectedDate={selectedDate} waterUnit={waterUnit}/><WaterHistory entries={entries} waterUnit={waterUnit} timeZone={timeZone}/></div></main>
}
