import type { Metadata } from "next"

import { AuthShell } from "@/features/authentication/components/AuthShell"
import { RegisterForm } from "@/features/authentication/components/RegisterForm"

export const metadata: Metadata = {
  title: "Create account | CalorieDock",
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start tracking your nutrition with a secure CalorieDock account."
    >
      <RegisterForm />
    </AuthShell>
  )
}

