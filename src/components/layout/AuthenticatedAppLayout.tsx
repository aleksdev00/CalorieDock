import { redirect } from "next/navigation"

import { getCurrentProfile } from "@/features/profile"
import { getThemePreference, ThemeSynchronizer } from "@/features/settings"

import { AppNavigation } from "./AppNavigation"

interface AuthenticatedAppLayoutProps {
  children: React.ReactNode
  loginPath: string
}

export async function AuthenticatedAppLayout({
  children,
  loginPath,
}: AuthenticatedAppLayoutProps) {
  const [result, theme] = await Promise.all([getCurrentProfile(), getThemePreference()])

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
    <div className="min-h-screen bg-background md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
      <ThemeSynchronizer theme={theme} />
      <AppNavigation />
      <div id="app-content" tabIndex={-1} className="min-w-0 px-4 pt-4 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-8 lg:px-10">{children}</div>
    </div>
  )
}
