"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"

import { resetPasswordAction } from "../actions"
import { resetPasswordSchema } from "../schemas/auth.schema"
import type { ResetPasswordInput } from "../types"
import { PasswordField } from "./PasswordField"

export function ResetPasswordForm() {
  const [serverMessage, setServerMessage] = useState<string>()
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  function onSubmit(values: ResetPasswordInput) {
    setServerMessage(undefined)
    startTransition(async () => {
      const result = await resetPasswordAction(values)
      setServerMessage(result.message)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <PasswordField
        id="password"
        label="New password"
        autoComplete="new-password"
        error={errors.password?.message}
        registration={register("password")}
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        registration={register("confirmPassword")}
      />
      <p className="text-xs text-muted-foreground">
        Use at least 8 characters with uppercase, lowercase, and a number.
      </p>
      {serverMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {serverMessage}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Updating password..." : "Update password"}
      </Button>
      <p className="text-center text-sm">
        <Link href="/forgot-password" className="underline underline-offset-4">
          Request a new reset link
        </Link>
      </p>
    </form>
  )
}

