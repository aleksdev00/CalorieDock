import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

import {
  exchangeAuthCode,
  verifyAuthToken,
} from "@/features/authentication/services/auth.service"
import { getSafeRedirectPath } from "@/features/authentication/utils/redirect"

const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  "email",
  "email_change",
  "invite",
  "magiclink",
  "recovery",
  "signup",
])

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return Boolean(value && EMAIL_OTP_TYPES.has(value as EmailOtpType))
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")
  const tokenHash = request.nextUrl.searchParams.get("token_hash")
  const type = request.nextUrl.searchParams.get("type")
  const requestedPath = request.nextUrl.searchParams.get("next")
  const fallbackPath = type === "recovery" ? "/reset-password" : "/login?verified=true"
  const nextPath = getSafeRedirectPath(requestedPath, fallbackPath)

  let verificationResult

  if (code) {
    verificationResult = await exchangeAuthCode(code)
  } else if (tokenHash && isEmailOtpType(type)) {
    verificationResult = await verifyAuthToken(tokenHash, type)
  } else {
    return NextResponse.redirect(
      new URL("/login?error=invalidVerificationLink", request.url),
    )
  }

  if (verificationResult.error) {
    return NextResponse.redirect(
      new URL("/login?error=invalidVerificationLink", request.url),
    )
  }

  const isRecovery = type === "recovery" || nextPath === "/reset-password"

  if (!isRecovery) {
    await verificationResult.supabase.auth.signOut({ scope: "local" })
  }

  return NextResponse.redirect(new URL(nextPath, request.url))
}
