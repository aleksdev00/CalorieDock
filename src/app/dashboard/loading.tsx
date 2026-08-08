export default function Loading() {
  return <main className="mx-auto w-full max-w-7xl flex-1 animate-pulse px-4 py-8 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading dashboard"><div className="h-10 w-72 rounded bg-muted" /><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-36 rounded-2xl bg-muted" />)}</div><div className="mt-8 grid gap-6 lg:grid-cols-3"><div className="h-80 rounded-2xl bg-muted lg:col-span-2" /><div className="h-80 rounded-2xl bg-muted" /></div></main>
}
