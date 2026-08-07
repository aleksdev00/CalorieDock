import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getMeals, MealTimeline } from "@/features/meal-tracking"

export const metadata: Metadata = { title: "Meals | CalorieDock" }

export default async function MealsPage() {
  const result = await getMeals()
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect("/login?next=/meals")
  if (!result.success) throw new Error(result.error.message)
  return <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-muted-foreground">Meal tracking</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Your meals</h1><p className="mt-2 text-muted-foreground">Review meals in reverse chronological order and open one to manage its foods.</p></div><Button asChild size="lg"><Link href="/meals/new">Create meal</Link></Button></div><MealTimeline meals={result.data} /></main>
}
