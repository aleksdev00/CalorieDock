export default function Loading() {
  return <main className="mx-auto w-full max-w-6xl flex-1 animate-pulse px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading daily summary"><div className="h-10 w-72 rounded bg-muted"/><div className="mt-8 h-28 rounded-2xl bg-muted"/><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 rounded-2xl bg-muted"/>)}</div><div className="mt-8 h-64 rounded-2xl bg-muted"/></main>
}
