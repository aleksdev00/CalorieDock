import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { DashboardPage, DashboardTimezoneBootstrap, getDashboard } from "@/features/dashboard"
import { dailySummaryQuerySchema } from "@/features/daily-summary/schemas/daily-summary.schema"

export const metadata: Metadata = {
  title: "Dashboard | CalorieDock",
}

export default async function Page({ searchParams }: PageProps<"/dashboard">) {
  const parameters = await searchParams
  const date = typeof parameters.date === "string" ? parameters.date : undefined
  const timeZone = typeof parameters.timeZone === "string" ? parameters.timeZone : undefined

  if (!date || !timeZone) return <DashboardTimezoneBootstrap />

  const query = dailySummaryQuerySchema.safeParse({ date, timeZone })
  if (!query.success) throw new Error("Invalid dashboard date or timezone.")

  const result = await getDashboard(query.data.date, query.data.timeZone)
  if (!result.success && result.error.code === "UNAUTHENTICATED") {
    const next = `/dashboard?${new URLSearchParams(query.data).toString()}`
    redirect(`/login?next=${encodeURIComponent(next)}`)
  }
  if (!result.success) throw new Error(result.error.message)

  if (!result.data.profile.profileCompleted) redirect("/onboarding")

  return <DashboardPage dashboard={result.data} />
}
