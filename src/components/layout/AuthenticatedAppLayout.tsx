import { redirect } from "next/navigation"

import { getCurrentProfile } from "@/features/profile"

import { AppNavigation } from "./AppNavigation"

interface AuthenticatedAppLayoutProps {
  children: React.ReactNode
  loginPath: string
}

export async function AuthenticatedAppLayout({
  children,
  loginPath,
}: AuthenticatedAppLayoutProps) {
  const result = await getCurrentProfile()

  if (!result.success) {
    if (result.error.code === "UNAUTHENTICATED") {
      redirect(`/login?next=${encodeURIComponent(loginPath)}`)
    }

    throw new Error(result.error.message)
  }

  if (!result.data.profile_completed) {
    redirect("/onboarding")
  }

  return (
    <div className="min-h-screen bg-muted/30 md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <AppNavigation />
      <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  )
}
