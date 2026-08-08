"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

function localDate() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

export function TimezoneBootstrap({ date }: { date?: string }) {
  const router = useRouter()
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const parameters = new URLSearchParams({ date: date ?? localDate(), timeZone })
    router.replace(`/water?${parameters.toString()}`)
  }, [date, router])
  return <main className="mx-auto w-full max-w-5xl flex-1 animate-pulse px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading water tracking"><div className="h-9 w-56 rounded bg-muted"/><div className="mt-8 h-32 rounded-2xl bg-muted"/><div className="mt-8 space-y-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-28 rounded-2xl bg-muted"/>)}</div></main>
}
