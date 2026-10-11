import { ArrowRight, Check, Leaf } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DashboardPreview } from "./DashboardPreview"

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="px-4 pt-14 pb-12 sm:px-6 sm:pt-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p data-landing-hero="1" className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-xs font-medium text-primary"><Leaf className="size-3.5" aria-hidden="true" /> A little clarity, every day.</p>
          <h1 data-landing-hero="2" id="hero-heading" className="mt-6 text-5xl font-semibold leading-[1.05] tracking-[-0.06em] sm:text-6xl lg:text-7xl">Your meals.<br /><span className="text-primary">Your day, understood.</span></h1>
          <p data-landing-hero="3" className="mx-auto mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">A simple place to log what you eat and see your calories, macros and daily habits come together.</p>
          <div data-landing-hero="4" className="mt-7 flex flex-col justify-center gap-3 min-[390px]:flex-row"><Button asChild className="landing-button h-12 rounded-xl px-6"><Link href="/register">Start tracking free <ArrowRight aria-hidden="true" /></Link></Button><Button asChild variant="outline" className="landing-button h-12 rounded-xl bg-card px-6"><Link href="#dashboard">Take a look inside</Link></Button></div>
          <ul data-landing-hero="5" className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">{["Free to start", "Private by default", "Built for real life"].map((note) => <li key={note} className="flex items-center gap-1.5"><Check className="size-3.5 text-primary" aria-hidden="true" />{note}</li>)}</ul>
        </div>
        <div id="dashboard" data-landing-hero="6" className="mt-12 scroll-mt-24 sm:mt-16"><DashboardPreview /></div>
      </div>
    </section>
  )
}
