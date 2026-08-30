import { Droplets, Plus, Scale, Search } from "lucide-react"

const nutrition = [
  ["Calories", "1,847 kcal", "4 meals logged"],
  ["Protein", "142 g", "Consumed today"],
  ["Carbohydrates", "196 g", "Consumed today"],
  ["Fat", "61 g", "Consumed today"],
] as const

const actions = [[Plus, "Add meal"], [Droplets, "Add water"], [Scale, "Add weight"], [Search, "Search foods"]] as const

export function DashboardPreview({ compact = false }: { compact?: boolean }) {
  return (
    <figure aria-label="CalorieDock dashboard product preview" className={compact ? "w-full" : "w-full lg:min-w-[640px]"}>
      <div className="overflow-hidden rounded-2xl border bg-card shadow-[0_24px_70px_rgba(0,0,0,0.12)]">
        <div className="flex h-9 items-center gap-1.5 border-b bg-muted/60 px-4" aria-hidden="true">
          <span className="size-1.5 rounded-full bg-muted-foreground/30" /><span className="size-1.5 rounded-full bg-muted-foreground/30" /><span className="size-1.5 rounded-full bg-muted-foreground/30" />
          <span className="ml-2 text-[9px] font-semibold text-muted-foreground">Product preview</span>
        </div>
        <div className="grid min-h-[390px] md:grid-cols-[8rem_1fr]">
          <aside className="hidden border-r bg-muted/25 p-4 md:block" aria-label="Preview navigation">
            <p className="mb-5 text-[10px] font-bold">CalorieDock</p>
            {["Dashboard", "Daily Summary", "Meals", "Foods", "Weight", "Water"].map((item, index) => <div key={item} className={`mb-1 rounded-md px-2 py-2 text-[8px] font-semibold ${index === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{item}</div>)}
          </aside>
          <div className="landing-dashboard-groups min-w-0 p-4 sm:p-6">
            <p className="text-[10px] font-semibold">Today at CalorieDock</p>
            <div className="flex flex-wrap items-end justify-between gap-2"><div><h3 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Good morning.</h3><p className="mt-1 text-[9px] text-muted-foreground">Sunday, August 30</p></div><span className="rounded-md border px-2 py-1.5 text-[8px] font-medium">View profile</span></div>
            <p className="mt-5 text-xs font-semibold">Today’s nutrition</p>
            <div className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-4">
              {nutrition.map(([label, value, detail], index) => <div key={label} className={`${compact && index > 1 ? "hidden sm:block" : ""} rounded-xl border p-3 shadow-sm`}><p className="text-[8px] font-medium text-muted-foreground">{label}</p><p className="mt-1.5 text-sm font-bold tabular-nums">{value}</p><p className="mt-1 text-[7px] text-muted-foreground">{detail}</p></div>)}
            </div>
            <p className="mt-4 text-[10px] font-semibold">Quick actions</p>
            <div className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-4">
              {actions.map(([Icon, label], index) => <div key={label} className={`${compact && index > 1 ? "hidden sm:flex" : "flex"} min-h-9 items-center gap-2 rounded-lg border px-3 text-[8px] font-semibold`}><Icon className="size-3" aria-hidden="true" />{label}</div>)}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-[1.5fr_1fr]">
              <div className="rounded-xl border p-3"><p className="text-xs font-semibold">Today’s meals</p><p className="mt-0.5 text-[8px] text-muted-foreground">Chronological meal overview</p>{["Breakfast", "Lunch", "Dinner", "Snack"].slice(0, compact ? 2 : 4).map((meal, index) => <div key={meal} className="mt-2 flex justify-between border-t pt-2 text-[8px] font-semibold"><span>{meal}</span><span>{[420, 610, 567, 250][index]} kcal</span></div>)}</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-1"><div className="rounded-xl border p-3"><Droplets className="size-3" aria-hidden="true" /><p className="mt-2 text-base font-bold tabular-nums">2.1 L</p><p className="text-[8px] text-muted-foreground">Recorded today</p></div><div className="rounded-xl border p-3"><Scale className="size-3" aria-hidden="true" /><p className="mt-2 text-base font-bold tabular-nums">92.4 kg</p><p className="text-[8px] text-muted-foreground">Latest weight</p></div></div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">Static representative data showing calories, macros, meals, water and weight. No user account data is used.</figcaption>
    </figure>
  )
}
