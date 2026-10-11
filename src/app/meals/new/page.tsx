import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MealForm } from "@/features/meal-tracking"

export const metadata: Metadata = { title: "Add meal | CalorieDock" }

export default function NewMealPage() {
  return (
    <main className="mx-auto w-full max-w-2xl py-4 sm:py-6">
      <Button asChild variant="ghost" className="-ml-3"><Link href="/meals"><ArrowLeft aria-hidden="true" /> Back to meals</Link></Button>
      <header className="mt-6"><span className="grid size-12 place-items-center rounded-2xl bg-accent text-primary"><Utensils className="size-6" aria-hidden="true" /></span><h1 className="mt-5 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">What’s on your plate?</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Give your meal a name. You’ll add foods and portions next.</p></header>
      <ol aria-label="Meal logging steps" className="mt-7 grid grid-cols-2 gap-3 text-sm"><li aria-current="step" className="flex items-center gap-2 rounded-xl bg-accent px-4 py-3 font-medium text-primary"><span className="grid size-6 place-items-center rounded-full bg-primary text-xs text-primary-foreground">1</span> Create meal</li><li className="flex items-center gap-2 rounded-xl border px-4 py-3 text-muted-foreground"><span className="grid size-6 place-items-center rounded-full border text-xs">2</span> Add foods</li></ol>
      <section aria-label="Meal details" className="mt-5 rounded-3xl border bg-card p-5 sm:p-8"><MealForm /></section>
    </main>
  )
}
