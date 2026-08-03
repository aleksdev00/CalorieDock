import { z } from "zod"

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")

const password = z
  .string()
  .min(8, "Password must contain at least 8 characters.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[0-9]/, "Password must contain a number.")

export const loginSchema = z.object({
  email,
  password,
  next: z.string().optional(),
})

export const registerSchema = z
  .object({
    email,
    password,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export const resendVerificationSchema = z.object({ email })

