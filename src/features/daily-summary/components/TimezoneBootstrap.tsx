"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

function localDate() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

export function DailySummaryTimezoneBootstrap({ date }: { date?: string }) {
  const router = useRouter()
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const parameters = new URLSearchParams({ date: date ?? localDate(), timeZone })
    router.replace(`/daily-summary?${parameters.toString()}`)
  }, [date, router])
  return <main className="mx-auto w-full max-w-6xl flex-1 animate-pulse px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading daily summary"><div className="h-10 w-64 rounded bg-muted"/><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 rounded-2xl bg-muted"/>)}</div></main>
}
