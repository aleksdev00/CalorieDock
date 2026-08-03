"use client"

import { useState } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"

interface PasswordFieldProps {
  id: string
  label: string
  autoComplete: string
  error?: string
  registration: UseFormRegisterReturn
}

export function PasswordField({
  id,
  label,
  autoComplete,
  error,
  registration,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const errorId = `${id}-error`

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="h-10 w-full rounded-lg border bg-background px-3 pr-16 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 aria-invalid:border-destructive"
          {...registration}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          className="absolute inset-y-0 right-0 rounded-r-lg px-3 text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={isVisible ? `Hide ${label}` : `Show ${label}`}
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

