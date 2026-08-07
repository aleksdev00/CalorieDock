import Link from "next/link"

interface ProfileShellProps {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}

export function ProfileShell({
  eyebrow,
  title,
  description,
  children,
}: ProfileShellProps) {
  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10 sm:py-16">
      <section className="mx-auto w-full max-w-2xl rounded-2xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
        <Link
          href="/"
          className="mb-8 inline-flex rounded-sm text-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          CalorieDock
        </Link>
        <div className="mb-8 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </section>
    </main>
  )
}

