"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"

import { loginAction } from "../actions"
import { loginSchema } from "../schemas/auth.schema"
import type { LoginInput } from "../types"
import { FormField } from "./FormField"
import { PasswordField } from "./PasswordField"

interface LoginFormProps {
  next?: string
  notice?: string
}

export function LoginForm({ next, notice }: LoginFormProps) {
  const [serverMessage, setServerMessage] = useState<string>()
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", next },
  })

  function onSubmit(values: LoginInput) {
    setServerMessage(undefined)
    startTransition(async () => {
      const result = await loginAction(values)
      setServerMessage(result.message)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {notice ? (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm" role="status">
          {notice}
        </p>
      ) : null}
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
        autoComplete="current-password"
        error={errors.password?.message}
        registration={register("password")}
      />
      {serverMessage ? (
        <p className="text-sm text-destructive" role="alert">
          {serverMessage}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
      <div className="flex flex-col gap-3 text-center text-sm">
        <Link href="/forgot-password" className="underline underline-offset-4">
          Forgot your password?
        </Link>
        <p className="text-muted-foreground">
          New to CalorieDock?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </div>
    </form>
  )
}

