import type { Metadata } from "next"

import { LandingPage } from "@/features/landing"

export const metadata: Metadata = {
  title: "CalorieDock | Simple calorie and nutrition tracking",
  description: "Track meals, calories, macros, water and weight with a clear daily nutrition dashboard.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CalorieDock | Nutrition tracking made clear",
    description: "One focused place for meals, macros, hydration, weight and daily summaries.",
    type: "website",
  },
}

export default function Home() {
  return <LandingPage />
}
