import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSettings, SettingsForm } from "@/features/settings"

export const metadata: Metadata = { title: "Settings | CalorieDock" }

export default async function SettingsPage() {
  const result = await getSettings()
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect("/login?next=/settings")
  if (!result.success) throw new Error(result.error.message)
  return <div className="mx-auto w-full max-w-4xl"><div className="mb-8"><p className="text-sm font-medium text-muted-foreground">Preferences</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Settings</h1><p className="mt-2 text-muted-foreground">Manage units, appearance, language, notifications, and account links.</p></div><SettingsForm settings={result.data}/></div>
}
