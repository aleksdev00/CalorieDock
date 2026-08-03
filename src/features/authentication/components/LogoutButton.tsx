"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"

import { logoutAction } from "../actions"

export function LogoutButton() {
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
    <div className="space-y-2">
      <Button type="button" onClick={logout} disabled={isPending}>
        {isPending ? "Signing out..." : "Sign out"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

