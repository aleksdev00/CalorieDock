import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/features/authentication"
import { getCurrentProfile } from "@/features/profile"

export const metadata: Metadata = {
  title: "Dashboard | CalorieDock",
}

export default async function DashboardPage() {
  const result = await getCurrentProfile()

  if (!result.success) {
    redirect("/login")
  }

  if (!result.data.profile_completed) {
    redirect("/onboarding")
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <section className="w-full max-w-lg rounded-2xl border bg-card p-6 text-center shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-primary">CalorieDock</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Profile setup complete
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Dashboard content belongs to F003 and is not included in this feature.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/meals">Track meals</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/profile">View profile</Link>
          </Button>
          <LogoutButton />
        </div>
      </section>
    </main>
  )
}
