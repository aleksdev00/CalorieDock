import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getWaterEntry, isValidTimeZone, millilitresToDisplay, toZonedLocalDateTime, WaterEntryForm } from "@/features/water-tracking"

export const metadata: Metadata = { title: "Edit water entry | CalorieDock" }

export default async function EditWaterPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ timeZone?: string }> }) {
  const [{ id }, { timeZone }] = await Promise.all([params, searchParams])
  if (!timeZone || !isValidTimeZone(timeZone)) redirect("/water")
  const result = await getWaterEntry(id)
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect(`/login?next=${encodeURIComponent(`/water/${id}/edit?timeZone=${timeZone}`)}`)
  if (!result.success && result.error.code === "NOT_FOUND") notFound()
  if (!result.success) throw new Error(result.error.message)
  const { entry, waterUnit } = result.data
  const selectedDate = toZonedLocalDateTime(entry.consumed_at, timeZone).slice(0, 10)
  return <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6"><Button asChild variant="ghost"><Link href={`/water?date=${selectedDate}&timeZone=${encodeURIComponent(timeZone)}`}>← Back to water history</Link></Button><section className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-bold tracking-tight">Edit water entry</h1><p className="mb-8 mt-2 text-muted-foreground">Update the amount or consumption time.</p><WaterEntryForm entryId={entry.id} waterUnit={waterUnit} timeZone={timeZone} defaultValues={{ amount: Number(millilitresToDisplay(entry.amount_ml, waterUnit).toFixed(waterUnit === "ml" ? 0 : 4)), consumedAt: toZonedLocalDateTime(entry.consumed_at, timeZone) }}/></section></main>
}
