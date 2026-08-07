"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { deleteMealAction } from "../actions"

export function DeleteMealButton({ mealId }: { mealId: string }) {
  const [message, setMessage] = useState(""); const [pending, startTransition] = useTransition()
  return <div><Button variant="destructive" disabled={pending} onClick={() => { if (window.confirm("Delete this meal and all of its foods?")) startTransition(async () => { const result = await deleteMealAction(mealId); if (result.status === "error") setMessage(result.message ?? "Unable to delete meal.") }) }}>{pending ? "Deleting..." : "Delete meal"}</Button>{message ? <p role="alert" className="mt-2 text-sm text-destructive">{message}</p> : null}</div>
}
