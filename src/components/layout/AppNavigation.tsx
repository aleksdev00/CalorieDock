"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { LogoutButton } from "@/features/authentication/components/LogoutButton"
import { cn } from "@/lib/utils"

const NAVIGATION_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/daily-summary", label: "Daily Summary" },
  { href: "/meals", label: "Meals" },
  { href: "/foods", label: "Foods" },
  { href: "/weight", label: "Weight" },
  { href: "/water", label: "Water" },
  { href: "/profile", label: "Profile" },
] as const

function NavigationLinks() {
  const pathname = usePathname()

  return (
    <nav aria-label="Main navigation">
      <ul className="space-y-1">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isActive &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function AppNavigation() {
  return (
    <>
      <aside className="sticky top-0 hidden h-screen self-start overflow-y-auto border-r bg-sidebar p-4 text-sidebar-foreground md:flex md:flex-col">
        <Link
          href="/dashboard"
          className="mb-6 rounded-md px-3 py-2 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          CalorieDock
        </Link>
        <NavigationLinks />
        <LogoutButton
          className="mt-auto pt-4"
          label="Sign out"
          variant="ghost"
        />
      </aside>

      <header className="border-b bg-sidebar px-4 py-3 text-sidebar-foreground md:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="rounded-md text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            CalorieDock
          </Link>
          <div className="flex items-center gap-2">
            <LogoutButton label="Sign out" variant="ghost" />
            <details className="relative">
              <summary className="cursor-pointer rounded-md border px-3 py-2 text-sm font-medium hover:bg-sidebar-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                Menu
              </summary>
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-md border bg-sidebar p-2 shadow-lg">
                <NavigationLinks />
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  )
}
