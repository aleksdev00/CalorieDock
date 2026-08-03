"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
} from "./schemas/auth.schema"
import {
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resendVerificationEmail,
  updatePassword,
} from "./services/auth.service"
import type {
  AuthActionState,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResendVerificationInput,
  ResetPasswordInput,
} from "./types"
import { getSafeRedirectPath } from "./utils/redirect"

function validationError(fieldErrors: Record<string, string[] | undefined>) {
  return {
    status: "error",
    message: "Please check the highlighted fields.",
    fieldErrors: Object.fromEntries(
      Object.entries(fieldErrors).filter(
        (entry): entry is [string, string[]] => Boolean(entry[1]),
      ),
    ),
  } satisfies AuthActionState
}

function unexpectedError(): AuthActionState {
  return {
    status: "error",
    message: "Something went wrong. Please try again later.",
  }
}

async function getRequestOrigin() {
  const requestHeaders = await headers()
  const origin = requestHeaders.get("origin")

  if (!origin) {
    return null
  }

  try {
    const url = new URL(origin)

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null
    }

    return url.origin
  } catch {
    return null
  }
}

export async function loginAction(input: LoginInput): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(input)

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors)
  }

  let result

  try {
    result = await loginUser(parsed.data)
  } catch {
    return unexpectedError()
  }

  if (!result.success) {
    return { status: "error", message: result.error.message }
  }

  redirect(getSafeRedirectPath(parsed.data.next))
}

export async function registerAction(
  input: RegisterInput,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse(input)

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors)
  }

  const origin = await getRequestOrigin()

  if (!origin) {
    return unexpectedError()
  }

  let result

  try {
    result = await registerUser({
      email: parsed.data.email,
      password: parsed.data.password,
      emailRedirectTo: `${origin}/auth/callback`,
    })
  } catch {
    return unexpectedError()
  }

  if (!result.success) {
    return { status: "error", message: result.error.message }
  }

  redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`)
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<AuthActionState> {
  const parsed = forgotPasswordSchema.safeParse(input)

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors)
  }

  const origin = await getRequestOrigin()

  if (!origin) {
    return unexpectedError()
  }

  let result

  try {
    result = await requestPasswordReset({
      email: parsed.data.email,
      emailRedirectTo: `${origin}/auth/callback?next=/reset-password`,
    })
  } catch {
    return unexpectedError()
  }

  if (!result.success) {
    return { status: "error", message: result.error.message }
  }

  return {
    status: "success",
    message:
      "If an account exists for this email, a password reset link has been sent.",
  }
}

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<AuthActionState> {
  const parsed = resetPasswordSchema.safeParse(input)

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors)
  }

  let result

  try {
    result = await updatePassword(parsed.data.password)
  } catch {
    return unexpectedError()
  }

  if (!result.success) {
    return { status: "error", message: result.error.message }
  }

  redirect("/login?passwordReset=true")
}

export async function resendVerificationAction(
  input: ResendVerificationInput,
): Promise<AuthActionState> {
  const parsed = resendVerificationSchema.safeParse(input)

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors)
  }

  const origin = await getRequestOrigin()

  if (!origin) {
    return unexpectedError()
  }

  let result

  try {
    result = await resendVerificationEmail({
      email: parsed.data.email,
      emailRedirectTo: `${origin}/auth/callback`,
    })
  } catch {
    return unexpectedError()
  }

  if (!result.success) {
    return { status: "error", message: result.error.message }
  }

  return {
    status: "success",
    message: "A new verification email has been sent.",
  }
}

export async function logoutAction(): Promise<AuthActionState> {
  let result

  try {
    result = await logoutUser()
  } catch {
    return unexpectedError()
  }

  if (!result.success) {
    return { status: "error", message: result.error.message }
  }

  redirect("/")
}

