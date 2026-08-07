import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { CustomFoodForm, getFoodById } from "@/features/food-database"
import { foodIdSchema } from "@/features/food-database/schemas/food.schema"

export const metadata: Metadata = { title: "Edit custom food | CalorieDock" }

export default async function EditFoodPage(props: PageProps<"/foods/[id]/edit">) {
  const { id } = await props.params
  if (!foodIdSchema.safeParse(id).success) notFound()
  const result = await getFoodById(id)
  if (!result.success) {
    if (result.error.code === "UNAUTHENTICATED") redirect(`/login?next=/foods/${id}/edit`)
    notFound()
  }
  if (result.data.source !== "custom" || result.data.user_id === null) notFound()
  return <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6"><p className="text-sm font-medium text-muted-foreground">Food database</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Edit custom food</h1><div className="mt-8 rounded-xl border bg-card p-5 sm:p-8"><CustomFoodForm mode="edit" foodId={id} defaultValues={{ name: result.data.name, brand: result.data.brand ?? "", category: result.data.category, barcode: result.data.barcode ?? "", calories: result.data.calories, protein: result.data.protein, carbohydrates: result.data.carbohydrates, fat: result.data.fat, fiber: result.data.fiber, sugar: result.data.sugar, sodium: result.data.sodium, servingSize: 100, servingUnit: "g" }} /></div></main>
}
