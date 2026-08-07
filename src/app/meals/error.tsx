"use client"

import { Button } from "@/components/ui/button"

export default function MealsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center"><h1 className="text-2xl font-bold">Unable to load meals</h1><p className="mt-3 text-muted-foreground">Something went wrong while loading meal tracking.</p><Button className="mt-6" onClick={reset}>Try again</Button></main>
}
