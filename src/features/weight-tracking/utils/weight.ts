import type { ProfileGoal } from "@/types/database"
import type { GoalAlignment, TrendDirection, WeightEntry, WeightHistoryItem, WeightProgress, WeightUnit } from "../types"

export const KG_TO_LB = 2.2046226218

export function kilogramsToDisplay(weightKg: number, weightUnit: WeightUnit) {
  return weightUnit === "lbs" ? weightKg * KG_TO_LB : weightKg
}

export function displayToKilograms(weight: number, weightUnit: WeightUnit) {
  const kilograms = weightUnit === "lbs" ? weight / KG_TO_LB : weight
  return Math.round((kilograms + Number.EPSILON) * 100) / 100
}

export function displayUnit(weightUnit: WeightUnit) {
  return weightUnit === "lbs" ? "lb" : "kg"
}

export function formatDisplayWeight(weightKg: number, weightUnit: WeightUnit) {
  return kilogramsToDisplay(weightKg, weightUnit).toFixed(1).replace(/\.0$/, "")
}

function direction(change: number): TrendDirection {
  if (change > 0) return "increasing"
  if (change < 0) return "decreasing"
  return "stable"
}

function alignment(goal: ProfileGoal | null, trend: TrendDirection): GoalAlignment {
  if (trend === "stable") return "stable"
  if (goal === "weight_loss") return trend === "decreasing" ? "toward_goal" : "away_from_goal"
  if (goal === "weight_gain") return trend === "increasing" ? "toward_goal" : "away_from_goal"
  return null
}

function changeFromCutoff(entries: WeightEntry[], latest: WeightEntry, cutoff: Date) {
  const comparison = entries.find((entry) => new Date(entry.recorded_at) <= cutoff)
  return comparison ? latest.weight_kg - comparison.weight_kg : null
}

export function calculateWeightProgress(entries: WeightEntry[], goal: ProfileGoal | null): { history: WeightHistoryItem[]; progress: WeightProgress } {
  if (entries.length === 0) return { history: [], progress: { latestKg: null, startingKg: null, totalChangeKg: null, weeklyChangeKg: null, monthlyChangeKg: null, direction: null, goalAlignment: null } }

  const ordered = [...entries].sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime() || b.id.localeCompare(a.id))
  const history = ordered.map((entry, index) => ({ ...entry, changeKg: ordered[index + 1] ? entry.weight_kg - ordered[index + 1].weight_kg : null }))
  const latest = ordered[0]
  const starting = ordered[ordered.length - 1]
  const totalChange = latest.weight_kg - starting.weight_kg
  const weeklyCutoff = new Date(latest.recorded_at); weeklyCutoff.setUTCDate(weeklyCutoff.getUTCDate() - 7)
  const monthlyCutoff = new Date(latest.recorded_at); monthlyCutoff.setUTCMonth(monthlyCutoff.getUTCMonth() - 1)
  const trend = direction(totalChange)

  return { history, progress: { latestKg: latest.weight_kg, startingKg: starting.weight_kg, totalChangeKg: totalChange, weeklyChangeKg: changeFromCutoff(ordered, latest, weeklyCutoff), monthlyChangeKg: changeFromCutoff(ordered, latest, monthlyCutoff), direction: trend, goalAlignment: alignment(goal, trend) } }
}
