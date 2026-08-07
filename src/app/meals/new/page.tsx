import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MealForm } from "@/features/meal-tracking"

export const metadata: Metadata = { title: "Create meal | CalorieDock" }

export default function NewMealPage() {
  return <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6"><Button asChild variant="ghost"><Link href="/meals">← Back to meals</Link></Button><section className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-bold tracking-tight">Create a meal</h1><p className="mb-8 mt-2 text-muted-foreground">Save the meal first, then add one or more foods.</p><MealForm /></section></main>
}
