import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { FoodDetails, getFoodById } from "@/features/food-database"
import { foodIdSchema } from "@/features/food-database/schemas/food.schema"

export const metadata: Metadata = { title: "Food details | CalorieDock" }

export default async function FoodDetailsPage(props: PageProps<"/foods/[id]">) {
  const { id } = await props.params
  if (!foodIdSchema.safeParse(id).success) notFound()
  const result = await getFoodById(id)
  if (!result.success) {
    if (result.error.code === "UNAUTHENTICATED") redirect(`/login?next=/foods/${id}`)
    if (result.error.code === "NOT_FOUND") notFound()
    return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16"><p className="text-destructive" role="alert">{result.error.message}</p></main>
  }
  return <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6"><FoodDetails food={result.data} canEdit={result.data.source === "custom" && result.data.user_id !== null} /></main>
}
