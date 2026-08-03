import "server-only"

import type { EmailOtpType } from "@supabase/supabase-js"

import { createClient } from "@/services/supabase/server"
import type { ActionResult } from "@/types/api"

import { normalizeAuthError } from "./auth-error"

interface Credentials {
  email: string
  password: string
}

interface RegisterOptions extends Credentials {
  emailRedirectTo: string
}

interface EmailOptions {
  email: string
  emailRedirectTo: string
}

export async function registerUser({
  email,
  password,
  emailRedirectTo,
}: RegisterOptions): Promise<ActionResult<void>> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  })

  if (error) {
    return { success: false, error: normalizeAuthError(error) }
  }

  if (data.user?.identities?.length === 0) {
    return {
      success: false,
      error: {
        code: "ACCOUNT_MAY_EXIST",
        message: "An account with this email may already exist.",
      },
    }
  }

  return { success: true, data: undefined }
}

export async function loginUser({
  email,
  password,
}: Credentials): Promise<ActionResult<void>> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: normalizeAuthError(error) }
  }

  if (!data.user.email_confirmed_at) {
    await supabase.auth.signOut()

    return {
      success: false,
      error: {
        code: "EMAIL_NOT_VERIFIED",
        message: "Verify your email address before signing in.",
      },
    }
  }

  return { success: true, data: undefined }
}

export async function logoutUser(): Promise<ActionResult<void>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: normalizeAuthError(error) }
  }

  return { success: true, data: undefined }
}

export async function requestPasswordReset({
  email,
  emailRedirectTo,
}: EmailOptions): Promise<ActionResult<void>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: emailRedirectTo,
  })

  if (error) {
    return { success: false, error: normalizeAuthError(error) }
  }

  return { success: true, data: undefined }
}

export async function resendVerificationEmail({
  email,
  emailRedirectTo,
}: EmailOptions): Promise<ActionResult<void>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo },
  })

  if (error) {
    return { success: false, error: normalizeAuthError(error) }
  }

  return { success: true, data: undefined }
}

export async function updatePassword(
  password: string,
): Promise<ActionResult<void>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { success: false, error: normalizeAuthError(error) }
  }

  await supabase.auth.signOut()

  return { success: true, data: undefined }
}

export async function exchangeAuthCode(code: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  return { supabase, error }
}

export async function verifyAuthToken(tokenHash: string, type: EmailOtpType) {
  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  })

  return { supabase, error }
}

