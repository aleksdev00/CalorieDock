export default function FoodsLoading() {
  return <main className="mx-auto w-full max-w-7xl flex-1 animate-pulse px-4 py-10 sm:px-6 lg:px-8" aria-label="Loading food database"><div className="h-9 w-64 rounded bg-muted" /><div className="mt-3 h-5 w-full max-w-xl rounded bg-muted" /><div className="mt-8 h-20 rounded-xl bg-muted" /><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-48 rounded-xl bg-muted" />)}</div></main>
}
