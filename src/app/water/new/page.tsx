import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getWaterPageData, isValidTimeZone, toZonedLocalDateTime, WaterEntryForm } from "@/features/water-tracking"

export const metadata: Metadata = { title: "Add water | CalorieDock" }

export default async function NewWaterPage({ searchParams }: { searchParams: Promise<{ timeZone?: string }> }) {
  const { timeZone } = await searchParams
  if (!timeZone || !isValidTimeZone(timeZone)) redirect("/water")
  const today = toZonedLocalDateTime(new Date().toISOString(), timeZone).slice(0, 10)
  const result = await getWaterPageData(today, timeZone)
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect(`/login?next=${encodeURIComponent(`/water/new?timeZone=${timeZone}`)}`)
  if (!result.success) throw new Error(result.error.message)
  return <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6"><Button asChild variant="ghost"><Link href={`/water?date=${today}&timeZone=${encodeURIComponent(timeZone)}`}>← Back to water history</Link></Button><section className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-bold tracking-tight">Add water</h1><p className="mb-8 mt-2 text-muted-foreground">Enter the amount in your selected display unit.</p><WaterEntryForm waterUnit={result.data.waterUnit} timeZone={timeZone} defaultValues={{ amount: 250, consumedAt: toZonedLocalDateTime(new Date().toISOString(), timeZone) }}/></section></main>
}
