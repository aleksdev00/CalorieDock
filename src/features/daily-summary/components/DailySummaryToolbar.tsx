"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

function shiftDate(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number)
  const shifted = new Date(Date.UTC(year, month - 1, day + days))
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}-${String(shifted.getUTCDate()).padStart(2, "0")}`
}

function today() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

export function DailySummaryToolbar({ selectedDate, timeZone }: { selectedDate: string; timeZone: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  function navigate(date: string) {
    startTransition(() => router.push(`/daily-summary?${new URLSearchParams({ date, timeZone }).toString()}`))
  }
  const buttonClass = "h-11 rounded-lg border bg-background px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
  return <nav aria-label="Daily summary date" className="flex flex-wrap items-end gap-3 rounded-2xl border bg-card p-4 shadow-sm">
    <button type="button" className={buttonClass} disabled={pending} onClick={() => navigate(shiftDate(selectedDate, -1))}>Previous day</button>
    <div className="min-w-48 flex-1 space-y-2"><label htmlFor="summary-date" className="block text-sm font-medium">Selected day</label><input id="summary-date" type="date" value={selectedDate} disabled={pending} onChange={(event) => navigate(event.target.value)} className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"/></div>
    <button type="button" className={buttonClass} disabled={pending} onClick={() => navigate(shiftDate(selectedDate, 1))}>Next day</button>
    <button type="button" className={buttonClass} disabled={pending || selectedDate === today()} onClick={() => navigate(today())}>Today</button>
    <p className="w-full text-xs text-muted-foreground">Day boundary: {timeZone}{pending ? " · Loading…" : ""}</p>
  </nav>
}
