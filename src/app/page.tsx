import { redirect } from "next/navigation"

import { getCurrentProfile } from "@/features/profile"

export default async function Home() {
  const result = await getCurrentProfile()

  if (!result.success) {
    if (result.error.code === "UNAUTHENTICATED") {
      redirect("/login")
    }

    throw new Error(result.error.message)
  }

  redirect(result.data.profile_completed ? "/dashboard" : "/onboarding")
}
