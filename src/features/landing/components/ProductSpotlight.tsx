import { Check } from "lucide-react"

import { DashboardPreview } from "./DashboardPreview"

export function ProductSpotlight() {
  return <section id="dashboard" aria-labelledby="dashboard-heading" className="scroll-mt-16 bg-muted/50 py-20 sm:py-28"><div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-6 lg:grid-cols-[0.65fr_1.35fr] lg:gap-16 lg:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Dashboard spotlight</p><h2 id="dashboard-heading" className="mt-4 text-3xl leading-tight font-bold tracking-[-0.045em] sm:text-5xl">The whole day, without the noise.</h2><p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">A clear daily view puts calories and macros beside the actions and records you use most.</p><ul className="mt-7 grid gap-4">{["Important numbers first", "Fast paths to everyday actions", "Responsive from desktop to mobile"].map((point) => <li key={point} className="flex items-center gap-3 text-sm font-semibold"><span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="size-3.5" aria-hidden="true" /></span>{point}</li>)}</ul></div><DashboardPreview /></div></section>
}
