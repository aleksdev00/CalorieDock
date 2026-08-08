"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

function localDate() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

export function DashboardTimezoneBootstrap() {
  const router = useRouter()

  useEffect(() => {
    const parameters = new URLSearchParams({
      date: localDate(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    router.replace(`/dashboard?${parameters.toString()}`)
  }, [router])

  return <DashboardSkeleton />
}

function DashboardSkeleton() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 animate-pulse px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-10 w-72 rounded bg-muted" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 rounded-2xl bg-muted" />)}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-2xl bg-muted lg:col-span-2" />
        <div className="h-80 rounded-2xl bg-muted" />
      </div>
    </main>
  )
}
