import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { DailySummaryPage, DailySummaryTimezoneBootstrap, getDailySummary } from "@/features/daily-summary"
import { dailySummaryQuerySchema } from "@/features/daily-summary/schemas/daily-summary.schema"

export const metadata: Metadata = { title: "Daily summary | CalorieDock" }

export default async function Page({ searchParams }: PageProps<"/daily-summary">) {
  const parameters = await searchParams
  const date = typeof parameters.date === "string" ? parameters.date : undefined
  const timeZone = typeof parameters.timeZone === "string" ? parameters.timeZone : undefined
  if (!date || !timeZone) return <DailySummaryTimezoneBootstrap date={date}/>
  const query = dailySummaryQuerySchema.safeParse({ date, timeZone })
  if (!query.success) throw new Error("Invalid daily summary date or timezone.")
  const result = await getDailySummary(query.data.date, query.data.timeZone)
  if (!result.success && result.error.code === "UNAUTHENTICATED") redirect(`/login?next=${encodeURIComponent(`/daily-summary?date=${query.data.date}&timeZone=${query.data.timeZone}`)}`)
  if (!result.success) throw new Error(result.error.message)
  return <DailySummaryPage summary={result.data}/>
}
