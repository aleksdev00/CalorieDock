import { CalendarDays, Coffee, Droplets, House, Leaf, Scale, Search, Utensils } from "lucide-react"

import { NutritionOverview } from "@/components/nutrition/NutritionOverview"

const meals = [
  { name: "Greek yogurt & berries", type: "Breakfast", time: "08:30", calories: "420", icon: Coffee },
  { name: "Chicken & rice bowl", type: "Lunch", time: "13:15", calories: "610", icon: Utensils },
  { name: "Almonds & a banana", type: "Snack", time: "16:00", calories: "250", icon: Coffee },
  { name: "Salmon & vegetables", type: "Dinner", time: "19:00", calories: "567", icon: Utensils },
]

/** Public, representative sample. Never connected to account data. */
export function DashboardPreview({ compact = false }: { compact?: boolean }) {
  return (
    <figure className="overflow-hidden rounded-3xl border bg-card shadow-xl shadow-primary/5">
      <div className="flex items-center gap-2 border-b px-4 py-3 sm:px-6"><span className="size-2 rounded-full bg-border" /><span className="size-2 rounded-full bg-border" /><span className="size-2 rounded-full bg-border" /><span className="ml-2 text-[10px] font-medium text-muted-foreground">CalorieDock / Today</span><span className="ml-auto rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-primary">Sample day</span></div>
      <div className="grid md:grid-cols-[170px_1fr]">
        <aside className="hidden border-r bg-card p-4 md:block" aria-label="Sample navigation">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight"><span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground"><Leaf className="size-4" aria-hidden="true" /></span>CalorieDock.</div>
          <p className="mt-9 mb-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your workspace</p>
          <div className="space-y-2">{[{ label: "Today", icon: House }, { label: "Meals", icon: Utensils }, { label: "Food library", icon: Search }, { label: "Daily summary", icon: CalendarDays }, { label: "Water", icon: Droplets }, { label: "Weight", icon: Scale }].map(({ label, icon: Icon }, index) => <div key={label} className={`flex items-center gap-2 rounded-xl px-3 py-3 text-xs ${index === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><Icon className="size-3.5" aria-hidden="true" />{label}</div>)}</div>
        </aside>
        <div className="landing-dashboard-groups min-w-0 space-y-5 bg-background p-4 sm:p-6 lg:p-8">
          <header><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your daily overview</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Good evening, Alex.</h2><p className="mt-1 text-xs text-muted-foreground">Sunday, August 30</p></header>
          <NutritionOverview calories="1,847" protein="142" carbohydrates="196" fat="61" mealCount={4} />
          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <section className="rounded-2xl border bg-card p-4 sm:p-5" aria-label="Sample meals"><div className="flex items-center justify-between"><h3 className="font-semibold">Today’s meals</h3><span className="text-xs text-muted-foreground">4 logged</span></div><ul className="mt-2 divide-y">{meals.slice(0, compact ? 2 : 4).map(({ name, type, time, calories, icon: Icon }) => <li key={name} className="flex items-center gap-3 py-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-primary"><Icon className="size-4" aria-hidden="true" /></span><div className="min-w-0 flex-1"><p className="text-xs font-medium sm:text-sm">{name}</p><p className="mt-1 text-[10px] text-muted-foreground">{type} · {time}</p></div><p className="shrink-0 text-right text-sm font-semibold tabular-nums">{calories}<span className="block text-[10px] font-normal text-muted-foreground">kcal</span></p></li>)}</ul></section>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1"><section className="rounded-2xl border bg-card p-5"><h3 className="flex items-center gap-2 text-sm font-semibold"><Droplets className="size-4 text-primary" aria-hidden="true" /> Hydration</h3><p className="mt-4 text-3xl font-semibold tracking-tight">2.1 <span className="text-sm font-normal text-muted-foreground">L</span></p><p className="mt-1 text-xs text-muted-foreground">Water recorded today</p></section><section className="rounded-2xl border bg-card p-5"><h3 className="flex items-center gap-2 text-sm font-semibold"><Scale className="size-4 text-muted-foreground" aria-hidden="true" /> Latest weight</h3><p className="mt-4 text-3xl font-semibold tracking-tight">92.4 <span className="text-sm font-normal text-muted-foreground">kg</span></p><p className="mt-1 text-xs text-muted-foreground">Your latest measurement</p></section></div>
          </div>
        </div>
      </div>
      <figcaption className="border-t bg-card px-4 py-3 text-center text-[11px] text-muted-foreground">A representative day with sample data. Your dashboard shows your own records.</figcaption>
    </figure>
  )
}
