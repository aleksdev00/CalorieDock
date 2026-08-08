"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { createWeightEntryAction, updateWeightEntryAction } from "../actions"
import { weightEntrySchema } from "../schemas/weight-entry.schema"
import type { WeightActionState, WeightEntryInput, WeightUnit } from "../types"
import { toLocalDateTime } from "../utils/date-time"

const INPUT = "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive"

export function WeightEntryForm({ entryId, weightUnit, defaultValues, recordedAtInstant }: { entryId?: string; weightUnit: WeightUnit; defaultValues?: WeightEntryInput; recordedAtInstant?: string }) {
  const [state, setState] = useState<WeightActionState>({ status: "idle" })
  const [pending, startTransition] = useTransition()
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<WeightEntryInput>({ resolver: zodResolver(weightEntrySchema), defaultValues: defaultValues ?? { recordedAt: toLocalDateTime(), note: "" } })
  const unit = weightUnit === "lbs" ? "lb" : "kg"
  const fieldError = state.fieldErrors?.weight?.[0] ?? errors.weight?.message

  useEffect(() => {
    if (recordedAtInstant) setValue("recordedAt", toLocalDateTime(recordedAtInstant))
  }, [recordedAtInstant, setValue])

  function submit(values: WeightEntryInput) {
    setState({ status: "idle" })
    const input = { ...values, recordedAt: new Date(values.recordedAt).toISOString() }
    startTransition(async () => setState(entryId ? await updateWeightEntryAction(entryId, input) : await createWeightEntryAction(input)))
  }

  return <form onSubmit={handleSubmit(submit)} className="space-y-6" noValidate>
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2"><label htmlFor="weight" className="text-sm font-medium">Weight ({unit})</label><input id="weight" type="number" inputMode="decimal" step="0.1" className={INPUT} required aria-invalid={Boolean(fieldError)} {...register("weight", { valueAsNumber: true })} />{fieldError ? <p className="text-sm text-destructive">{fieldError}</p> : <p className="text-xs text-muted-foreground">Saved securely in canonical kilograms.</p>}</div>
      <div className="space-y-2"><label htmlFor="recorded-at" className="text-sm font-medium">Measured at</label><input id="recorded-at" type="datetime-local" className={INPUT} required aria-invalid={Boolean(errors.recordedAt)} {...register("recordedAt")} />{errors.recordedAt ? <p className="text-sm text-destructive">{errors.recordedAt.message}</p> : null}</div>
    </div>
    <div className="space-y-2"><label htmlFor="note" className="text-sm font-medium">Note <span className="font-normal text-muted-foreground">(optional)</span></label><textarea id="note" rows={4} maxLength={500} className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive" aria-invalid={Boolean(errors.note)} {...register("note")} />{errors.note ? <p className="text-sm text-destructive">{errors.note.message}</p> : null}</div>
    {state.message ? <p role="alert" className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-primary"}>{state.message}</p> : null}
    <Button type="submit" size="lg" disabled={pending}>{pending ? "Saving..." : entryId ? "Save changes" : "Log weight"}</Button>
  </form>
}
