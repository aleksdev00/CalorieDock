"use client"

import { Button } from "@/components/ui/button"

export default function Error({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return <main className="flex flex-1 items-center justify-center px-4 py-12"><section className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm"><p className="text-sm font-semibold text-destructive">Dashboard unavailable</p><h1 className="mt-3 text-2xl font-semibold">We couldn’t load your dashboard</h1><p className="mt-2 text-sm text-muted-foreground">Your tracking data was not changed. Please try loading the dashboard again.</p><Button className="mt-6" onClick={unstable_retry}>Try again</Button></section></main>
}
