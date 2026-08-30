import { ArrowDownRight } from "lucide-react"
import type { CSSProperties } from "react"

import { audiences } from "../data/landing-content"

export function AudienceSection() {
  return <section aria-labelledby="audience-heading" className="pb-20 sm:pb-28"><div className="mx-auto grid w-full max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8"><div data-landing-reveal><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Built for real routines</p><h2 id="audience-heading" className="mt-4 text-3xl leading-tight font-bold tracking-[-0.04em] sm:text-5xl">Useful wherever your focus starts.</h2><p className="mt-5 text-base leading-7 text-muted-foreground">CalorieDock gives you a clearer record. Your approach and goals remain your own.</p></div><div className="grid gap-3">{audiences.map(({ title, description }, index) => <article data-landing-reveal key={title} style={{ "--landing-delay": `${80 + index * 60}ms` } as CSSProperties} className="landing-card grid grid-cols-[2.75rem_1fr] gap-4 rounded-2xl border p-5 sm:p-6"><span className="landing-card-icon grid size-11 place-items-center rounded-xl bg-muted"><ArrowDownRight className="size-5" aria-hidden="true" /></span><div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></div></article>)}</div></div></section>
}
