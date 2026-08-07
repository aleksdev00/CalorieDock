"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"

import { deleteCustomFoodAction } from "../actions"

export function DeleteFoodButton({ foodId }: { foodId: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function remove() {
    if (!window.confirm("Delete this custom food? This cannot be undone.")) return
    setError("")
    startTransition(async () => {
      const result = await deleteCustomFoodAction(foodId)
      if (result.status === "error") setError(result.message ?? "Unable to delete food.")
    })
  }

  return <div><Button type="button" variant="destructive" onClick={remove} disabled={isPending}>{isPending ? "Deleting..." : "Delete"}</Button>{error ? <p className="mt-2 text-sm text-destructive" role="alert">{error}</p> : null}</div>
}
