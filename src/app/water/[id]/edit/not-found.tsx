import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WaterEntryNotFound() {
  return <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-16"><section className="w-full rounded-2xl border bg-card p-8 text-center"><h1 className="text-2xl font-bold">Water entry not found</h1><p className="mt-2 text-muted-foreground">This entry does not exist or is not available to your account.</p><Button asChild className="mt-6"><Link href="/water">Return to water tracking</Link></Button></section></main>
}
