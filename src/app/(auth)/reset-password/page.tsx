import type { Metadata } from "next"

import { AuthShell } from "@/features/authentication/components/AuthShell"
import { ResetPasswordForm } from "@/features/authentication/components/ResetPasswordForm"

export const metadata: Metadata = {
  title: "Choose new password | CalorieDock",
}

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Choose a new password"
      description="Your reset link must be valid before a new password can be saved."
    >
      <ResetPasswordForm />
    </AuthShell>
  )
}

