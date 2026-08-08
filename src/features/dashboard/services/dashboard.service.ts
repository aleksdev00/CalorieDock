import "server-only"

import { getDailySummary } from "@/features/daily-summary"
import type { ActionResult } from "@/types/api"
import type { DashboardData } from "../types"

export async function getDashboard(
  selectedDate: string,
  timeZone: string,
): Promise<ActionResult<DashboardData>> {
  return getDailySummary(selectedDate, timeZone)
}
