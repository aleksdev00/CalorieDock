"use client"

import Link from "next/link"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"

import { resendVerificationAction } from "../actions"
import type { AuthActionStatus } from "../types"

interface VerificationPanelProps {
  email?: string
}

export function VerificationPanel({ email }: VerificationPanelProps) {
  const [serverState, setServerState] = useState<{
    status: AuthActionStatus
    message?: string
  }>({ status: "idle" })
  const [isPending, startTransition] = useTransition()

  function resendEmail() {
    if (!email) {
      setServerState({
        status: "error",
        message: "Return to registration and enter your email address again.",
      })
      return
    }

    startTransition(async () => {
      const result = await resendVerificationAction({ email })
      setServerState(result)
    })
  }

  return (
    <div className="space-y-5">
      {email ? (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm">
          Verification email sent to <strong>{email}</strong>.
        </p>
      ) : null}
      <p className="text-sm text-muted-foreground">
        Open the verification link in your email, then return to sign in. The
        link may expire, so request another one if necessary.
      </p>
      {serverState.message ? (
        <p
          className={
            serverState.status === "success"
              ? "text-sm text-foreground"
              : "text-sm text-destructive"
          }
          role={serverState.status === "success" ? "status" : "alert"}
        >
          {serverState.message}
        </p>
      ) : null}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isPending}
        onClick={resendEmail}
      >
        {isPending ? "Sending..." : "Resend verification email"}
      </Button>
      <p className="text-center text-sm">
        <Link href="/login" className="underline underline-offset-4">
          Continue to sign in
        </Link>
      </p>
    </div>
  )
}

