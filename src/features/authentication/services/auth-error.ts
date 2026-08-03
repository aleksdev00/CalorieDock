import type { AuthError } from "@supabase/supabase-js"

import type { ApiError } from "@/types/api"

const AUTH_ERROR_MESSAGES: Record<string, ApiError> = {
  email_not_confirmed: {
    code: "EMAIL_NOT_VERIFIED",
    message: "Verify your email address before signing in.",
  },
  invalid_credentials: {
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password.",
  },
  over_email_send_rate_limit: {
    code: "RATE_LIMITED",
    message: "Too many email requests. Please wait before trying again.",
  },
  same_password: {
    code: "PASSWORD_UNCHANGED",
    message: "Choose a password you have not used before.",
  },
  session_not_found: {
    code: "SESSION_EXPIRED",
    message: "This link is invalid or has expired. Request a new one.",
  },
  user_already_exists: {
    code: "ACCOUNT_MAY_EXIST",
    message: "An account with this email may already exist.",
  },
  weak_password: {
    code: "WEAK_PASSWORD",
    message: "Password does not meet security requirements.",
  },
}

export function normalizeAuthError(error: AuthError): ApiError {
  const knownError = AUTH_ERROR_MESSAGES[error.code ?? ""]

  if (knownError) {
    return knownError
  }

  if (/fetch|network|connect/i.test(error.message)) {
    return {
      code: "NETWORK_ERROR",
      message: "Unable to connect. Please try again.",
    }
  }

  return {
    code: "AUTHENTICATION_ERROR",
    message: "Something went wrong. Please try again later.",
  }
}

