import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DashboardPreview } from "./DashboardPreview"

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute -right-64 -top-72 size-[42rem] rounded-full bg-[radial-gradient(circle,var(--muted)_0%,transparent_68%)]" aria-hidden="true" />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:px-8">
        <div><p data-landing-hero="1" className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-2 text-xs font-semibold text-muted-foreground"><span className="size-1.5 rounded-full bg-foreground" aria-hidden="true" />A clearer way to track nutrition</p><h1 data-landing-hero="2" id="hero-heading" className="mt-6 max-w-2xl text-[2.65rem] leading-[0.99] font-bold tracking-[-0.055em] sm:text-6xl lg:text-[4.15rem]">Nutrition tracking that keeps the important things clear.</h1><p data-landing-hero="3" className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Log meals, understand your macros, track water and weight, and review every day from one focused dashboard.</p>
          <div data-landing-hero="4" className="mt-8 flex flex-col gap-3 min-[390px]:flex-row"><Button asChild className="landing-button h-12 px-6"><Link href="/register">Start tracking free <ArrowRight aria-hidden="true" /></Link></Button><Button asChild variant="outline" className="landing-button h-12 px-6"><Link href="#how-it-works">See how it works</Link></Button></div>
          <ul data-landing-hero="5" className="mt-7 grid gap-2 text-xs text-muted-foreground sm:flex sm:flex-wrap sm:gap-5">{["Free to start", "Your data stays private", "Built for everyday tracking"].map((note) => <li key={note} className="flex items-center gap-1.5"><Check className="size-3.5 text-foreground" aria-hidden="true" />{note}</li>)}</ul>
        </div><div data-landing-hero="6" className="landing-dashboard-entrance"><DashboardPreview compact /></div>
      </div>
    </section>
  )
}
