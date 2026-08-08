import type { WaterUnit } from "@/types/database"

export const ML_PER_US_FLUID_OUNCE = 29.5735295625

export function displayToMillilitres(amount: number, unit: WaterUnit) {
  if (unit === "L") return amount * 1000
  if (unit === "oz") return amount * ML_PER_US_FLUID_OUNCE
  return amount
}

export function millilitresToDisplay(amountMl: number, unit: WaterUnit) {
  if (unit === "L") return amountMl / 1000
  if (unit === "oz") return amountMl / ML_PER_US_FLUID_OUNCE
  return amountMl
}

export function formatWaterAmount(amountMl: number, unit: WaterUnit) {
  const value = millilitresToDisplay(amountMl, unit)
  const maximumFractionDigits = unit === "ml" ? 0 : 2
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value)} ${unit}`
}
