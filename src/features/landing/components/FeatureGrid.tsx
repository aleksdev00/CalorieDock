import { BookOpenCheck, Search, Utensils } from "lucide-react"

const features = [
  { title: "Log your meal.", description: "Find a food, enter the portion and keep an accurate record of what you ate.", icon: Utensils, number: "01" },
  { title: "Make it your own.", description: "Search foods or save your own. Edit a portion whenever you need to correct an entry.", icon: Search, number: "02" },
  { title: "Understand your day.", description: "See calories and macros together, with water and weight close by when you need them.", icon: BookOpenCheck, number: "03" },
]

export function FeatureGrid() {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-20 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <div data-landing-reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><h2 id="features-heading" className="max-w-lg text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Less to figure out.<br />More of your day back.</h2><p className="max-w-sm text-sm leading-6 text-muted-foreground">The essentials of nutrition tracking, in one calm workspace.</p></div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{features.map(({ title, description, icon: Icon, number }) => <article data-landing-reveal key={title} className="landing-card rounded-3xl border bg-card p-7"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-accent text-primary"><Icon className="size-5" aria-hidden="true" /></span><span className="text-xs text-muted-foreground">{number}</span></div><h3 className="mt-7 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p></article>)}</div>
      </div>
    </section>
  )
}
