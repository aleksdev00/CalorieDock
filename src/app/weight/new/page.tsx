import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getWeightPageData, WeightEntryForm } from "@/features/weight-tracking"

export const metadata: Metadata = { title: "Log weight | CalorieDock" }

export default async function NewWeightPage() {
  const result = await getWeightPageData()
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect("/login?next=/weight/new")
  if (!result.success) throw new Error(result.error.message)
  return <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6"><Button asChild variant="ghost"><Link href="/weight">← Back to weight history</Link></Button><section className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-bold tracking-tight">Log weight</h1><p className="mb-8 mt-2 text-muted-foreground">Enter the value in your Settings weight unit.</p><WeightEntryForm weightUnit={result.data.weightUnit}/></section></main>
}
