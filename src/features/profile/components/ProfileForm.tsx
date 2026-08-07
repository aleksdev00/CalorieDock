"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"

import { completeProfileAction, updateProfileAction } from "../actions"
import { profileSchema } from "../schemas/profile.schema"
import type { ProfileActionState, ProfileInput } from "../types"

interface ProfileFormProps {
  defaultValues: ProfileInput
  mode: "onboarding" | "edit"
}

const GOALS = [
  { value: "weight_loss", label: "Weight loss" },
  { value: "maintenance", label: "Maintenance" },
  { value: "weight_gain", label: "Weight gain" },
] as const

export function ProfileForm({ defaultValues, mode }: ProfileFormProps) {
  const [serverState, setServerState] = useState<ProfileActionState>({
    status: "idle",
  })
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  })

  function onSubmit(values: ProfileInput) {
    setServerState({ status: "idle" })
    startTransition(async () => {
      const action =
        mode === "onboarding" ? completeProfileAction : updateProfileAction
      const result = await action(values)
      setServerState(result)
    })
  }

  const fieldClassName =
    "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
      {mode === "onboarding" ? (
        <div className="space-y-2" aria-label="Profile completion">
          <div className="flex items-center justify-between text-xs font-medium">
            <span>Profile setup</span>
            <span>1 of 1</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-full rounded-full bg-primary" />
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="fullName" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            className={fieldClassName}
            {...register("fullName")}
          />
          {errors.fullName ? (
            <p id="fullName-error" className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="dateOfBirth" className="text-sm font-medium">
            Date of birth <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="dateOfBirth"
            type="date"
            autoComplete="bday"
            max={new Date().toISOString().slice(0, 10)}
            aria-invalid={Boolean(errors.dateOfBirth)}
            aria-describedby={
              errors.dateOfBirth ? "dateOfBirth-error" : undefined
            }
            className={fieldClassName}
            {...register("dateOfBirth")}
          />
          {errors.dateOfBirth ? (
            <p id="dateOfBirth-error" className="text-sm text-destructive">
              {errors.dateOfBirth.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="unitSystem" className="text-sm font-medium">
            Unit system
          </label>
          <select
            id="unitSystem"
            aria-invalid={Boolean(errors.unitSystem)}
            aria-describedby={errors.unitSystem ? "unitSystem-error" : undefined}
            className={fieldClassName}
            {...register("unitSystem")}
          >
            <option value="metric">Metric</option>
            <option value="imperial">Imperial</option>
          </select>
          {errors.unitSystem ? (
            <p id="unitSystem-error" className="text-sm text-destructive">
              {errors.unitSystem.message}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Primary goal</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {GOALS.map((goal) => (
            <label
              key={goal.value}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border bg-background px-3 py-2 text-sm has-checked:border-primary has-checked:ring-2 has-checked:ring-primary/20"
            >
              <input
                type="radio"
                value={goal.value}
                className="size-4 accent-primary"
                {...register("goal")}
              />
              {goal.label}
            </label>
          ))}
        </div>
        {errors.goal ? (
          <p className="text-sm text-destructive">{errors.goal.message}</p>
        ) : null}
      </fieldset>

      {serverState.message ? (
        <p
          className={
            serverState.status === "success"
              ? "rounded-lg bg-muted px-3 py-2 text-sm"
              : "text-sm text-destructive"
          }
          role={serverState.status === "success" ? "status" : "alert"}
        >
          {serverState.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending
          ? "Saving profile..."
          : mode === "onboarding"
            ? "Complete profile"
            : "Save changes"}
      </Button>
    </form>
  )
}

