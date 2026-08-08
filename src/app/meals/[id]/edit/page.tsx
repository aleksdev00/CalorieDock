import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getMeal, MealForm, toLocalDateTime } from "@/features/meal-tracking"

export const metadata: Metadata = { title: "Edit meal | CalorieDock" }

export default async function EditMealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const result = await getMeal(id)
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect(`/login?next=/meals/${id}/edit`)
  if (!result.success && result.error.code === "NOT_FOUND") notFound()
  if (!result.success) throw new Error(result.error.message)
  return <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6"><Button asChild variant="ghost"><Link href={`/meals/${id}`}>← Back to meal</Link></Button><section className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><h1 className="text-3xl font-bold tracking-tight">Edit meal</h1><div className="mt-8"><MealForm mealId={id} defaultValues={{ name: result.data.name, mealType: result.data.meal_type, consumedAt: toLocalDateTime(result.data.consumed_at) }} /></div></section></main>
}
