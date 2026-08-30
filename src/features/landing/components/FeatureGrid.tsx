import type { CSSProperties } from "react"

import { features } from "../data/landing-content"

export function FeatureGrid() {
  return <section id="features" aria-labelledby="features-heading" className="scroll-mt-20 py-20 sm:py-28"><div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8"><div data-landing-reveal className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Everything essential</p><h2 id="features-heading" className="mt-4 text-3xl leading-tight font-bold tracking-[-0.04em] sm:text-5xl">The daily tools, kept together.</h2><p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">CalorieDock turns the core parts of nutrition tracking into one consistent, private workspace.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{features.map(({ title, description, icon: Icon }, index) => <article data-landing-reveal key={title} style={{ "--landing-delay": `${(index % 3) * 60}ms` } as CSSProperties} className="landing-card group rounded-2xl border bg-card p-6 shadow-sm sm:p-7"><span className="landing-card-icon grid size-11 place-items-center rounded-xl bg-muted"><Icon className="size-5" aria-hidden="true" /></span><h3 className="mt-7 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p></article>)}</div></div></section>
}
