"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, CalendarDays, Droplets, House, Leaf, Scale, Search, Settings, UserRound, Utensils } from "lucide-react"

import { LogoutButton } from "@/features/authentication/components/LogoutButton"
import { cn } from "@/lib/utils"

const NAVIGATION_ITEMS = [
  { href: "/dashboard", label: "Today", icon: House },
  { href: "/meals", label: "Meals", icon: Utensils },
  { href: "/foods", label: "Food library", icon: Search },
  { href: "/daily-summary", label: "Daily summary", icon: CalendarDays },
  { href: "/water", label: "Water", icon: Droplets },
  { href: "/weight", label: "Weight", icon: Scale },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
] as const
const MOBILE_ITEMS = [NAVIGATION_ITEMS[0], NAVIGATION_ITEMS[1], NAVIGATION_ITEMS[3], NAVIGATION_ITEMS[6]]

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav aria-label="Main navigation"><ul className="space-y-1.5">
      {NAVIGATION_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`)
        return <li key={href}><Link href={href} onClick={onNavigate} aria-current={isActive ? "page" : undefined} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", isActive ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary" : "text-muted-foreground")}><Icon className="size-4" aria-hidden="true" />{label}</Link></li>
      })}
    </ul></nav>
  )
}

function Brand() {
  return <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Leaf className="size-5" aria-hidden="true" /></span><span>CalorieDock<span className="text-primary">.</span></span></Link>
}

export function AppNavigation() {
  const pathname = usePathname()
  return (
    <>
      <a href="#app-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:p-3">Skip to content</a>
      <aside className="sticky top-0 hidden h-dvh self-start overflow-y-auto border-r bg-sidebar p-5 text-sidebar-foreground md:flex md:flex-col">
        <div className="mb-10 px-2 pt-2"><Brand /></div>
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Your workspace</p>
        <NavigationLinks />
        <div className="mt-auto pt-10"><div className="mb-4 rounded-2xl border bg-accent/50 p-4"><BookOpen className="size-4 text-primary" aria-hidden="true" /><p className="mt-2 text-sm font-medium">One day at a time.</p><p className="mt-1 text-xs leading-5 text-muted-foreground">A clear record starts with your next meal.</p></div><LogoutButton label="Sign out" variant="ghost" /></div>
      </aside>
      <header className="sticky top-0 z-30 border-b bg-sidebar/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-4"><Brand /><details className="relative"><summary className="cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">Menu</summary><div className="absolute right-0 z-40 mt-3 max-h-[70dvh] w-60 overflow-auto rounded-2xl border bg-sidebar p-3 shadow-xl"><NavigationLinks onNavigate={() => { document.querySelector<HTMLDetailsElement>("header details[open]")?.removeAttribute("open") }} /><div className="mt-3 border-t pt-2"><LogoutButton label="Sign out" variant="ghost" /></div></div></details></div>
      </header>
      <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-sidebar/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        {MOBILE_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return <Link key={href} href={href} aria-current={isActive ? "page" : undefined} className={cn("flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-medium focus-visible:outline-2 focus-visible:outline-ring", isActive ? "bg-accent text-primary" : "text-muted-foreground")}><Icon className="size-5" aria-hidden="true" />{label}</Link>
        })}
      </nav>
    </>
  )
}
