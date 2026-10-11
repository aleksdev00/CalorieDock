import Link from "next/link"
import { Leaf } from "lucide-react"

import { Button } from "@/components/ui/button"

export function LandingHeader() {
  const linkClass = "landing-nav-link rounded-sm text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  return (
    <header data-landing-header className="landing-header sticky top-0 z-50 h-16 border-b border-transparent bg-background/80 backdrop-blur-sm md:h-[4.5rem]">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-3 px-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 rounded-sm text-lg font-semibold tracking-[-0.03em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground"><Leaf className="size-4" aria-hidden="true" /></span>CalorieDock<span className="-ml-2 text-primary">.</span></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          <Link className={linkClass} href="#features">Features</Link>
          <Link className={linkClass} href="#how-it-works">How it works</Link>
          <Link className={linkClass} href="#dashboard">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button asChild variant="ghost" className="landing-button h-11 px-2.5 sm:px-3"><Link href="/login">Sign in</Link></Button>
          <Button asChild className="landing-button h-11 px-3 sm:px-5"><Link href="/register"><span className="sm:hidden">Start</span><span className="hidden sm:inline">Start tracking</span></Link></Button>
        </div>
      </div>
    </header>
  )
}
