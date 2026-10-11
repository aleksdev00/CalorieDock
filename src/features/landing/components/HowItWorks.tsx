import type { CSSProperties } from "react"

import { steps } from "../data/landing-content"

export function HowItWorks() {
  return <section id="how-it-works" aria-labelledby="steps-heading" className="scroll-mt-16 py-14 sm:py-20"><div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8"><div data-landing-reveal className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">How it works</p><h2 id="steps-heading" className="mt-4 text-3xl leading-tight font-bold tracking-[-0.04em] sm:text-4xl">A simple rhythm for every day.</h2></div><ol className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">{steps.map(({ title, description }, index) => <li data-landing-reveal key={title} style={{ "--landing-delay": `${index * 100}ms` } as CSSProperties}><span className="text-xs font-bold text-muted-foreground">0{index + 1}</span><div className="landing-step-line my-5 h-px bg-border" /><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p></li>)}</ol></div></section>
}
