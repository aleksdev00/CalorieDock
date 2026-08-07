import type { Metadata } from "next"
import { redirect } from "next/navigation"

import {
  getCurrentProfile,
  ProfileForm,
  ProfileShell,
} from "@/features/profile"

export const metadata: Metadata = {
  title: "Set up your profile | CalorieDock",
}

export default async function OnboardingPage() {
  const result = await getCurrentProfile()

  if (!result.success) {
    if (result.error.code === "UNAUTHENTICATED") {
      redirect("/login?next=/onboarding")
    }

    return (
      <ProfileShell
        eyebrow="Profile setup"
        title="We could not load your profile"
        description="Unable to load your profile. Please try again."
      >
        <p className="text-sm text-destructive" role="alert">
          {result.error.message}
        </p>
      </ProfileShell>
    )
  }

  if (result.data.profile_completed) {
    redirect("/dashboard")
  }

  return (
    <ProfileShell
      eyebrow="Welcome to CalorieDock"
      title="Complete your profile"
      description="Add the essentials CalorieDock needs to personalize your experience. You can update these details later."
    >
      <ProfileForm
        mode="onboarding"
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

