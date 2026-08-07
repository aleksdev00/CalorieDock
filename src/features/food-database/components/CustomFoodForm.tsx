"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"

import { createCustomFoodAction, updateCustomFoodAction } from "../actions"
import { foodSchema } from "../schemas/food.schema"
import type { FoodActionState, FoodInput } from "../types"

interface CustomFoodFormProps { defaultValues?: FoodInput; foodId?: string; mode: "create" | "edit" }

const INPUT_CLASS = "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive"
const NUTRIENTS: { name: "calories" | "protein" | "carbohydrates" | "fat" | "fiber" | "sugar" | "sodium"; label: string; unit: string; required: boolean }[] = [
  { name: "calories", label: "Calories", unit: "kcal", required: true },
  { name: "protein", label: "Protein", unit: "g", required: true },
  { name: "carbohydrates", label: "Carbohydrates", unit: "g", required: true },
  { name: "fat", label: "Fat", unit: "g", required: true },
  { name: "fiber", label: "Fiber", unit: "g", required: false },
  { name: "sugar", label: "Sugar", unit: "g", required: false },
  { name: "sodium", label: "Sodium", unit: "mg", required: false },
]

export function CustomFoodForm({ defaultValues, foodId, mode }: CustomFoodFormProps) {
  const [serverState, setServerState] = useState<FoodActionState>({ status: "idle" })
  const [isPending, startTransition] = useTransition()
  const { register, handleSubmit, formState: { errors } } = useForm<FoodInput>({
    resolver: zodResolver(foodSchema),
    defaultValues: defaultValues ?? { name: "", brand: "", category: "", barcode: "", calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: null, sugar: null, sodium: null, servingSize: 100, servingUnit: "g" },
  })

  function onSubmit(values: FoodInput) {
    setServerState({ status: "idle" })
    startTransition(async () => {
      const result = mode === "create" ? await createCustomFoodAction(values) : await updateCustomFoodAction(foodId ?? "", values)
      setServerState(result)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        {[{ name: "name", label: "Food name", required: true }, { name: "brand", label: "Brand", required: false }, { name: "category", label: "Category", required: true }, { name: "barcode", label: "Barcode", required: false }].map((field) => {
          const name = field.name as "name" | "brand" | "category" | "barcode"
          return <div className="space-y-2" key={name}><label htmlFor={name} className="text-sm font-medium">{field.label}{!field.required ? <span className="text-muted-foreground"> (optional)</span> : null}</label><input id={name} required={field.required} aria-invalid={Boolean(errors[name])} className={INPUT_CLASS} {...register(name)} />{errors[name] ? <p className="text-sm text-destructive">{errors[name]?.message}</p> : null}</div>
        })}
      </div>

      <fieldset className="space-y-4"><legend className="font-semibold">Nutrition per 100 g</legend><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{NUTRIENTS.map((nutrient) => <div className="space-y-2" key={nutrient.name}><label htmlFor={nutrient.name} className="text-sm font-medium">{nutrient.label} ({nutrient.unit}){!nutrient.required ? <span className="text-muted-foreground"> (optional)</span> : null}</label><input id={nutrient.name} type="number" min="0" step="0.01" required={nutrient.required} aria-invalid={Boolean(errors[nutrient.name])} className={INPUT_CLASS} {...register(nutrient.name, nutrient.required ? { valueAsNumber: true } : { setValueAs: (value) => value === "" ? null : Number(value) })} />{errors[nutrient.name] ? <p className="text-sm text-destructive">{errors[nutrient.name]?.message}</p> : null}</div>)}</div></fieldset>
      <input type="hidden" value="100" {...register("servingSize", { valueAsNumber: true })} /><input type="hidden" value="g" {...register("servingUnit")} />
      {serverState.message ? <p className="text-sm text-destructive" role="alert">{serverState.message}</p> : null}
      <Button type="submit" size="lg" disabled={isPending}>{isPending ? "Saving food..." : mode === "create" ? "Create custom food" : "Save changes"}</Button>
    </form>
  )
}
