import { NextResponse } from "next/server"

import { foodSearchSchema } from "@/features/food-database/schemas/food.schema"
import { searchFoods } from "@/features/food-database/services/food.service"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const parsed = foodSearchSchema.safeParse({
    query: url.searchParams.get("query") ?? "",
    category: url.searchParams.get("category") || undefined,
    source: url.searchParams.get("source") ?? "all",
  })
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "Invalid food search." } }, { status: 400 })
  }
  const result = await searchFoods(parsed.data)
  if (!result.success) {
    const status = result.error.code === "UNAUTHENTICATED" ? 401 : 500
    return NextResponse.json({ error: result.error }, { status })
  }
  return NextResponse.json({ data: result.data })
}
