import Link from "next/link"

interface AuthShellProps {
  title: string
  description: string
  children: React.ReactNode
}

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
        <Link
          href="/"
          className="mb-8 inline-flex rounded-sm text-sm font-semibold text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          CalorieDock
        </Link>
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </section>
    </main>
  )
}

