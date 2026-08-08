"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { logoutAction } from "../actions"

interface LogoutButtonProps {
  className?: string
  label?: string
  variant?: "default" | "ghost"
}

export function LogoutButton({
  className,
  label = "Sign out",
  variant = "default",
}: LogoutButtonProps) {
  const [error, setError] = useState<string>()
  const [isPending, startTransition] = useTransition()

  function logout() {
    setError(undefined)
    startTransition(async () => {
      const result = await logoutAction()
      setError(result.message)
    })
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        className="w-full justify-start"
        type="button"
        variant={variant}
        onClick={logout}
        disabled={isPending}
      >
        {isPending ? "Signing out..." : label}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
