"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import type { WaterUnit } from "@/types/database"
import { createWaterEntryAction, updateWaterEntryAction } from "../actions"
import { waterEntrySchema } from "../schemas/water-entry.schema"
import type { WaterActionState, WaterEntryInput } from "../types"

const INPUT = "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive"

export function WaterEntryForm({ entryId, waterUnit, timeZone, defaultValues }: { entryId?: string; waterUnit: WaterUnit; timeZone: string; defaultValues: Omit<WaterEntryInput, "timeZone"> }) {
  const [state, setState] = useState<WaterActionState>({ status: "idle" }); const [pending, startTransition] = useTransition()
  const { register, handleSubmit, formState: { errors } } = useForm<WaterEntryInput>({ resolver: zodResolver(waterEntrySchema), defaultValues: { ...defaultValues, timeZone } })
  const amountError = state.fieldErrors?.amount?.[0] ?? errors.amount?.message
  const consumedAtError = state.fieldErrors?.consumedAt?.[0] ?? errors.consumedAt?.message
  function submit(values: WaterEntryInput) {
    setState({ status: "idle" })
    startTransition(async () => setState(entryId ? await updateWaterEntryAction(entryId, values) : await createWaterEntryAction(values)))
  }
  return <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
    <input type="hidden" {...register("timeZone")}/>
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2"><label htmlFor="amount" className="text-sm font-medium">Amount ({waterUnit})</label><input id="amount" type="number" inputMode="decimal" step="any" required className={INPUT} aria-invalid={Boolean(amountError)} {...register("amount", { valueAsNumber: true })}/>{amountError ? <p className="text-sm text-destructive">{amountError}</p> : <p className="text-xs text-muted-foreground">Stored canonically in millilitres.</p>}</div>
      <div className="space-y-2"><label htmlFor="consumed-at" className="text-sm font-medium">Consumed at</label><input id="consumed-at" type="datetime-local" required className={INPUT} aria-invalid={Boolean(consumedAtError)} {...register("consumedAt")}/>{consumedAtError ? <p className="text-sm text-destructive">{consumedAtError}</p> : <p className="text-xs text-muted-foreground">Local time in {timeZone}.</p>}</div>
    </div>
    {state.message ? <p role="alert" className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-primary"}>{state.message}</p> : null}
    <Button type="submit" size="lg" disabled={pending}>{pending ? "Saving..." : entryId ? "Save changes" : "Add water"}</Button>
  </form>
}
