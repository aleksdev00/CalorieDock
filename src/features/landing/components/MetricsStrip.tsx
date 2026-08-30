import { metrics } from "../data/landing-content"

export function MetricsStrip() {
  return <section aria-labelledby="metrics-heading" className="border-y bg-muted/35 py-10 sm:py-14"><div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8"><h2 id="metrics-heading" className="sr-only">Example product metrics</h2><p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">A day in view · example data</p><div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border lg:grid-cols-4">{metrics.map(({ label, value, unit }) => <div key={label} className="bg-background p-5 sm:p-6"><p className="text-xs text-muted-foreground sm:text-sm">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight tabular-nums sm:text-3xl">{value} <span className="text-sm font-medium text-muted-foreground">{unit}</span></p></div>)}</div></div></section>
}
