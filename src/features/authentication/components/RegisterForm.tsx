"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { ConsentFields } from "@/features/legal-consent/client"

import { registerAction } from "../actions"
import { registerSchema } from "../schemas/auth.schema"
import type { RegisterInput } from "../types"
import { FormField } from "./FormField"
import { PasswordField } from "./PasswordField"

export function RegisterForm({ onSwitch }: { onSwitch?: () => void }) {
  const [serverMessage, setServerMessage] = useState<string>()
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "", legalAccepted: false, healthAccepted: false },
  })

  function onSubmit(values: RegisterInput) {
    setServerMessage(undefined)
    startTransition(async () => {
      const result = await registerAction(values)
      setServerMessage(result.message)
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
      <PasswordField
        id="password"
        label="Password"
        autoComplete="new-password"
        describedBy="password-instructions"
        error={errors.password?.message}
        registration={register("password")}
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        registration={register("confirmPassword")}
      />
      <p id="password-instructions" className="text-xs text-muted-foreground">
        Use at least 8 characters with uppercase, lowercase, and a number.
      </p>
      <ConsentFields
        legalRegistration={register("legalAccepted")}
        healthRegistration={register("healthAccepted")}
        legalError={errors.legalAccepted?.message}
        healthError={errors.healthAccepted?.message}
      />
      <p className="text-xs text-muted-foreground">
        After verifying your email and signing in, confirm these choices to save them to your account before tracking begins.
      </p>
      {serverMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {serverMessage}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        {onSwitch ? <button type="button" onClick={onSwitch} className="font-medium text-foreground underline underline-offset-4">Sign in</button> : <Link href="/login" className="font-medium text-foreground underline underline-offset-4">Sign in</Link>}
      </p>
    </form>
  )
}
