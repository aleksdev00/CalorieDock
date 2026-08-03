export type AuthActionStatus = "idle" | "success" | "error"

export interface AuthActionState {
  status: AuthActionStatus
  message?: string
  fieldErrors?: Record<string, string[]>
}

export interface LoginInput {
  email: string
  password: string
  next?: string
}

export interface RegisterInput {
  email: string
  password: string
  confirmPassword: string
}

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  password: string
  confirmPassword: string
}

export interface ResendVerificationInput {
  email: string
}

