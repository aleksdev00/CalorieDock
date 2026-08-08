"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import type { WaterUnit } from "@/types/database"
import { updateWaterUnitAction } from "../actions"

const CONTROL = "h-11 rounded-lg border bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30"

export function WaterToolbar({ selectedDate, timeZone, waterUnit }: { selectedDate: string; timeZone: string; waterUnit: WaterUnit }) {
  const router = useRouter(); const [pending, startTransition] = useTransition(); const [message, setMessage] = useState("")
  function changeDate(date: string) {
    const parameters = new URLSearchParams({ date, timeZone })
    router.push(`/water?${parameters.toString()}`)
  }
  function changeUnit(unit: WaterUnit) {
    setMessage("")
    startTransition(async () => { const result = await updateWaterUnitAction(unit); if (result.status === "error") setMessage(result.message ?? "Unable to update unit."); else router.refresh() })
  }
  return <div className="flex flex-wrap items-end gap-4 rounded-2xl border bg-card p-4 shadow-sm">
    <div className="space-y-2"><label htmlFor="water-date" className="block text-sm font-medium">Selected day</label><input id="water-date" type="date" value={selectedDate} onChange={(event) => changeDate(event.target.value)} className={CONTROL}/></div>
    <div className="space-y-2"><label htmlFor="water-unit" className="block text-sm font-medium">Display unit</label><select id="water-unit" value={waterUnit} disabled={pending} onChange={(event) => changeUnit(event.target.value as WaterUnit)} className={CONTROL}><option value="ml">Millilitres (ml)</option><option value="L">Litres (L)</option><option value="oz">US fluid ounces (oz)</option></select></div>
    <p className="pb-2 text-xs text-muted-foreground">Timezone: {timeZone}</p>
    {message ? <p role="alert" className="w-full text-sm text-destructive">{message}</p> : null}
  </div>
}
