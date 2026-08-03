import type { Metadata } from "next"

import { AuthShell } from "@/features/authentication/components/AuthShell"
import { LoginForm } from "@/features/authentication/components/LoginForm"

export const metadata: Metadata = {
  title: "Sign in | CalorieDock",
}

interface LoginPageProps {
  searchParams: Promise<{
    next?: string
    verified?: string
    passwordReset?: string
    error?: string
  }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const parameters = await searchParams
  let notice: string | undefined

  if (parameters.verified === "true") {
    notice = "Your email has been verified. You can now sign in."
  } else if (parameters.passwordReset === "true") {
    notice = "Your password has been updated. Sign in with your new password."
  } else if (parameters.error === "invalidVerificationLink") {
    notice = "This verification link is invalid or has expired."
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue to your CalorieDock account."
    >
      <LoginForm next={parameters.next} notice={notice} />
    </AuthShell>
  )
}

