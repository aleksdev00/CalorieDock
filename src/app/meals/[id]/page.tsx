import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getMeal, MealDetails } from "@/features/meal-tracking"

export const metadata: Metadata = { title: "Meal details | CalorieDock" }

export default async function MealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getMeal(id)
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect(`/login?next=/meals/${id}`)
  if (!result.success && result.error.code === "NOT_FOUND") notFound()
  if (!result.success) throw new Error(result.error.message)
  return <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6"><Button asChild variant="ghost"><Link href="/meals">← Back to meals</Link></Button><div className="mt-6"><MealDetails meal={result.data} /></div></main>
}
