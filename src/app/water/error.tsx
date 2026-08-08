"use client"

import { Button } from "@/components/ui/button"

export default function WaterError({ unstable_retry: retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-16"><section className="w-full rounded-2xl border bg-card p-8 text-center"><h1 className="text-2xl font-bold">Unable to load water tracking</h1><p className="mt-2 text-muted-foreground">Your hydration history could not be loaded. Please try again.</p><Button className="mt-6" onClick={retry}>Try again</Button></section></main>
}
