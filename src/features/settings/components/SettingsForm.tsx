"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { updateSettingsAction } from "../actions"
import { settingsSchema } from "../schemas/settings.schema"
import type { SettingsActionState, SettingsInput, SettingsPageData } from "../types"
import { applyTheme } from "./ThemeSynchronizer"

const FIELD = "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive"

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p><div className="mt-5">{children}</div></section>
}

export function SettingsForm({ settings }: { settings: SettingsPageData }) {
  const [state, setState] = useState<SettingsActionState>({ status: "idle" })
  const [pending, startTransition] = useTransition()
  const defaultValues: SettingsInput = {
    weightUnit: settings.weightUnit,
    heightUnit: settings.heightUnit,
    waterUnit: settings.waterUnit,
    language: settings.language,
    theme: settings.theme,
    notificationPreferences: settings.notificationPreferences,
  }
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsInput>({ resolver: zodResolver(settingsSchema), defaultValues })

  function submit(values: SettingsInput) {
    setState({ status: "idle" })
    startTransition(async () => {
      const result = await updateSettingsAction(values)
      if (result.status === "success") applyTheme(values.theme)
      setState(result)
    })
  }

  return <form className="space-y-6" onSubmit={handleSubmit(submit)} noValidate>
    <Section title="Units" description="Choose how measurements are entered and displayed. Stored health records remain in canonical units.">
      <div className="grid gap-5 sm:grid-cols-3">
        <label className="space-y-2 text-sm font-medium">Weight unit<select className={FIELD} {...register("weightUnit")}><option value="kg">Kilograms (kg)</option><option value="lbs">Pounds (lbs)</option></select></label>
        <label className="space-y-2 text-sm font-medium">Height unit<select className={FIELD} {...register("heightUnit")}><option value="cm">Centimetres (cm)</option><option value="ft/in">Feet and inches (ft/in)</option></select></label>
        <label className="space-y-2 text-sm font-medium">Water unit<select className={FIELD} {...register("waterUnit")}><option value="ml">Millilitres (ml)</option><option value="L">Litres (L)</option><option value="oz">Fluid ounces (oz)</option></select></label>
      </div>
    </Section>
    <Section title="Appearance" description="Use your device theme or choose a fixed appearance.">
      <div className="grid gap-3 sm:grid-cols-3">{([['system','System'],['light','Light'],['dark','Dark']] as const).map(([value,label]) => <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm has-checked:border-primary has-checked:ring-2 has-checked:ring-primary/20"><input type="radio" value={value} className="size-4 accent-primary" {...register("theme")}/>{label}</label>)}</div>
    </Section>
    <Section title="Language" description="Save your preferred language. Full application localization is not yet available.">
      <label className="block max-w-sm space-y-2 text-sm font-medium">Preferred language<select className={FIELD} {...register("language")}><option value="en">English</option><option value="sr">Serbian</option></select></label>
    </Section>
    <Section title="Notifications" description="Store reminder preferences. Notification delivery and scheduling are not part of this feature.">
      <div className="space-y-3">{([['water_reminders','Water reminders'],['daily_reminders','Daily reminders'],['goal_completion_notifications','Goal completion notifications']] as const).map(([key,label]) => <label key={key} className="flex min-h-11 items-center justify-between gap-4 rounded-lg border px-4 py-3 text-sm font-medium"><span>{label}</span><input type="checkbox" className="size-5 accent-primary" {...register(`notificationPreferences.${key}`)}/></label>)}</div>
      {errors.notificationPreferences ? <p className="mt-3 text-sm text-destructive">Notification preferences are invalid.</p> : null}
    </Section>
    <Section title="Account" description="Review your profile or use the existing secure password-reset flow.">
      <p className="text-sm text-muted-foreground">Signed in as <span className="font-medium text-foreground">{settings.email}</span></p>
      <div className="mt-4 flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="/profile">Open profile</Link></Button><Button asChild variant="outline"><Link href="/forgot-password">Change password</Link></Button></div>
    </Section>
    {state.message ? <p role={state.status === "success" ? "status" : "alert"} className={state.status === "success" ? "rounded-lg bg-muted px-4 py-3 text-sm" : "text-sm text-destructive"}>{state.message}</p> : null}
    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>{pending ? "Saving settings..." : "Save settings"}</Button>
  </form>
}
