"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { createMealAction, updateMealAction } from "../actions"
import { mealSchema } from "../schemas/meal.schema"
import type { MealActionState, MealInput } from "../types"
import { toLocalDateTime } from "../utils/date-time"

const INPUT = "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive"

export function MealForm({ mealId, defaultValues }: { mealId?: string; defaultValues?: MealInput }) {
  const [state, setState] = useState<MealActionState>({ status: "idle" })
  const [pending, startTransition] = useTransition()
  const { register, handleSubmit, formState: { errors } } = useForm<MealInput>({ resolver: zodResolver(mealSchema), defaultValues: defaultValues ?? { name: "", mealType: "breakfast", consumedAt: toLocalDateTime() } })

  function submit(values: MealInput) {
    setState({ status: "idle" })
    startTransition(async () => setState(mealId ? await updateMealAction(mealId, values) : await createMealAction(values)))
  }

  return <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
    <div className="space-y-2"><label htmlFor="meal-name" className="text-sm font-medium">Meal name</label><input id="meal-name" className={INPUT} required maxLength={100} aria-invalid={Boolean(errors.name)} {...register("name")} />{errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}</div>
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2"><label htmlFor="meal-type" className="text-sm font-medium">Meal type</label><select id="meal-type" className={INPUT} {...register("mealType")}><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="snack">Snack</option></select>{errors.mealType ? <p className="text-sm text-destructive">{errors.mealType.message}</p> : null}</div>
      <div className="space-y-2"><label htmlFor="consumed-at" className="text-sm font-medium">Consumed at</label><input id="consumed-at" type="datetime-local" className={INPUT} required aria-invalid={Boolean(errors.consumedAt)} {...register("consumedAt")} />{errors.consumedAt ? <p className="text-sm text-destructive">{errors.consumedAt.message}</p> : null}</div>
    </div>
    {state.message ? <p role="alert" className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-primary"}>{state.message}</p> : null}
    <Button type="submit" size="lg" disabled={pending}>{pending ? "Saving meal..." : mealId ? "Save meal" : "Create meal"}</Button>
  </form>
}
