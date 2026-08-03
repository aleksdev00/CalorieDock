"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"

import { forgotPasswordAction } from "../actions"
import { forgotPasswordSchema } from "../schemas/auth.schema"
import type { AuthActionStatus, ForgotPasswordInput } from "../types"
import { FormField } from "./FormField"

export function ForgotPasswordForm() {
  const [serverState, setServerState] = useState<{
    status: AuthActionStatus
    message?: string
  }>({ status: "idle" })
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  function onSubmit(values: ForgotPasswordInput) {
    setServerState({ status: "idle" })
    startTransition(async () => {
      const result = await forgotPasswordAction(values)
      setServerState(result)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        registration={register("email")}
      />
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
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Sending..." : "Send reset link"}
      </Button>
      <p className="text-center text-sm">
        <Link href="/login" className="underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}

