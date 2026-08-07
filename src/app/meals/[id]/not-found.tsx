import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MealNotFound() {
  return <main className="mx-auto w-full max-w-xl px-4 py-16 text-center"><h1 className="text-2xl font-bold">Meal not found</h1><p className="mt-3 text-muted-foreground">This meal does not exist or is not available to your account.</p><Button asChild className="mt-6"><Link href="/meals">Back to meals</Link></Button></main>
}
