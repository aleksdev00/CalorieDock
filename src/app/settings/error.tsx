"use client"

import { Button } from "@/components/ui/button"

export default function SettingsError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return <div className="mx-auto max-w-xl rounded-2xl border bg-card p-8 text-center"><h1 className="text-2xl font-semibold">Settings are unavailable</h1><p className="mt-2 text-muted-foreground">We could not load your settings. Please try again.</p><Button className="mt-5" onClick={() => unstable_retry()}>Try again</Button></div>
}
