import type { Metadata } from "next"
import { redirect } from "next/navigation"

import {
  getCurrentProfile,
  ProfileForm,
  ProfileShell,
} from "@/features/profile"

export const metadata: Metadata = {
  title: "Your profile | CalorieDock",
}

export default async function ProfilePage() {
  const result = await getCurrentProfile()

  if (!result.success) {
    if (result.error.code === "UNAUTHENTICATED") {
      redirect("/login?next=/profile")
    }

    return (
      <ProfileShell
        eyebrow="Your profile"
        title="We could not load your profile"
        description="Unable to load your profile. Please try again."
      >
        <p className="text-sm text-destructive" role="alert">
          {result.error.message}
        </p>
      </ProfileShell>
    )
  }

  if (!result.data.profile_completed) {
    redirect("/onboarding")
  }

  return (
    <ProfileShell
      eyebrow="Your profile"
      title="Profile details"
      description="Keep your personal details, primary goal, and measurement preference current."
    >
      <ProfileForm
        mode="edit"
        defaultValues={{
          fullName: result.data.full_name ?? "",
          dateOfBirth: result.data.date_of_birth ?? "",
          goal: result.data.goal ?? "",
          unitSystem: result.data.unit_system,
        }}
      />
    </ProfileShell>
  )
}

