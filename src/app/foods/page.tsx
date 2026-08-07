import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { FoodSearch, getFoodDatabaseAccess } from "@/features/food-database"

export const metadata: Metadata = { title: "Food database | CalorieDock" }

export default async function FoodsPage() {
  const access = await getFoodDatabaseAccess()
  if (!access.success) redirect("/login?next=/foods")
  return <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-muted-foreground">Nutrition catalogue</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Food database</h1><p className="mt-2 max-w-2xl text-muted-foreground">Search CalorieDock foods, your private custom foods, and Open Food Facts products.</p></div><Button asChild size="lg"><Link href="/foods/new">Create custom food</Link></Button></div><FoodSearch /></main>
}
