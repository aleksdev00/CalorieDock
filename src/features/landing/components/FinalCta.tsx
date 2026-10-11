import Link from "next/link"
import type { CSSProperties } from "react"

import { Button } from "@/components/ui/button"

export function FinalCta() {
  return <section aria-labelledby="final-cta-heading" className="px-5 pb-14 sm:px-6 sm:pb-20 lg:px-8"><div data-landing-reveal data-landing-composition className="landing-final-cta relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 sm:py-16"><div className="pointer-events-none absolute -right-28 -top-48 size-96 rounded-full border border-primary-foreground/10" aria-hidden="true" /><h2 data-landing-stagger id="final-cta-heading" className="relative mx-auto max-w-3xl text-3xl leading-tight font-bold tracking-[-0.045em] sm:text-5xl">Start with your next meal.</h2><p data-landing-stagger style={{ "--landing-delay": "60ms" } as CSSProperties} className="relative mx-auto mt-5 max-w-xl text-base text-primary-foreground/85 sm:text-lg">A clearer day starts with one simple entry.</p><div data-landing-stagger style={{ "--landing-delay": "120ms" } as CSSProperties} className="relative mt-8 flex flex-col justify-center gap-3 min-[390px]:flex-row"><Button asChild variant="secondary" className="landing-button h-12 px-6"><Link href="/register">Start tracking free</Link></Button><Button asChild variant="outline" className="landing-button h-12 border-primary-foreground/30 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link href="/login">Sign in</Link></Button></div></div></section>
}
