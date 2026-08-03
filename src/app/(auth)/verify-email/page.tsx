import type { Metadata } from "next"

import { AuthShell } from "@/features/authentication/components/AuthShell"
import { VerificationPanel } from "@/features/authentication/components/VerificationPanel"

export const metadata: Metadata = {
  title: "Verify email | CalorieDock",
}

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { email } = await searchParams

  return (
    <AuthShell
      title="Verify your email"
      description="Confirm that this email address belongs to you before signing in."
    >
      <VerificationPanel email={email} />
    </AuthShell>
  )
}

