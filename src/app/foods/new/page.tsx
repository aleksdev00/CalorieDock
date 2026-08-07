import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { CustomFoodForm, getFoodDatabaseAccess } from "@/features/food-database"

export const metadata: Metadata = { title: "Create custom food | CalorieDock" }

export default async function NewFoodPage() {
  const access = await getFoodDatabaseAccess()
  if (!access.success) redirect("/login?next=/foods/new")
  return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6"><p className="text-sm font-medium text-muted-foreground">Food database</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Create custom food</h1><p className="mt-2 text-muted-foreground">Nutrition values use the standard 100 g base quantity.</p><div className="mt-8 rounded-xl border bg-card p-5 sm:p-8"><CustomFoodForm mode="create" /></div></main>
}
