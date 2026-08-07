"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { deleteWeightEntryAction } from "../actions"

export function DeleteWeightEntryButton({ entryId }: { entryId: string }) {
  const router = useRouter(); const [message, setMessage] = useState(""); const [pending, startTransition] = useTransition()
  return <div><Button variant="destructive" size="sm" disabled={pending} onClick={() => { if (window.confirm("Delete this weight entry? This cannot be undone.")) startTransition(async () => { const result = await deleteWeightEntryAction(entryId); if (result.status === "error") setMessage(result.message ?? "Unable to delete entry."); else router.refresh() }) }}>{pending ? "Deleting..." : "Delete"}</Button>{message ? <p role="alert" className="mt-2 text-sm text-destructive">{message}</p> : null}</div>
}
