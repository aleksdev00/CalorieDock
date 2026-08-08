import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getWeightPageData, WeightHistory, WeightSummary, WeightTrendChart } from "@/features/weight-tracking"

export const metadata: Metadata = { title: "Weight tracking | CalorieDock" }

export default async function WeightPage() {
  const result = await getWeightPageData()
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect("/login?next=/weight")
  if (!result.success) throw new Error(result.error.message)
  return <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-muted-foreground">Weight tracking</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Your progress</h1><p className="mt-2 text-muted-foreground">Review measurements and changes over time.</p></div><Button asChild size="lg"><Link href="/weight/new">Log weight</Link></Button></div><div className="space-y-8"><WeightSummary progress={result.data.progress} weightUnit={result.data.weightUnit}/><WeightTrendChart entries={result.data.entries} weightUnit={result.data.weightUnit}/><WeightHistory entries={result.data.entries} weightUnit={result.data.weightUnit}/></div></main>
}
