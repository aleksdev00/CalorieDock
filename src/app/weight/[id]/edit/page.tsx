import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { formatDisplayWeight, getWeightEntry, kilogramsToDisplay, toLocalDateTime, WeightEntryForm } from "@/features/weight-tracking"

export const metadata: Metadata = { title: "Edit weight entry | CalorieDock" }

export default async function EditWeightPage({ params }: PageProps<"/weight/[id]/edit">) {
  const { id } = await params
  const result = await getWeightEntry(id)
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect(`/login?next=/weight/${id}/edit`)
  if (!result.success && result.error.code === "NOT_FOUND") notFound()
  if (!result.success) throw new Error(result.error.message)
  const { entry, unitSystem } = result.data
  return <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6"><Button asChild variant="ghost"><Link href="/weight">← Back to weight history</Link></Button><section className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-bold tracking-tight">Edit weight entry</h1><p className="mb-8 mt-2 text-muted-foreground">Current measurement: {formatDisplayWeight(entry.weight_kg, unitSystem)}</p><WeightEntryForm entryId={entry.id} unitSystem={unitSystem} defaultValues={{ weight: Number(kilogramsToDisplay(entry.weight_kg, unitSystem).toFixed(2)), recordedAt: toLocalDateTime(entry.recorded_at), note: entry.note ?? "" }}/></section></main>
}
