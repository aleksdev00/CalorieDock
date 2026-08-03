import type { Metadata } from "next"

import { AuthShell } from "@/features/authentication/components/AuthShell"
import { ForgotPasswordForm } from "@/features/authentication/components/ForgotPasswordForm"

export const metadata: Metadata = {
  title: "Forgot password | CalorieDock",
}

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email and we will send instructions if an account exists."
    >
      <ForgotPasswordForm />
    </AuthShell>
  )
}

