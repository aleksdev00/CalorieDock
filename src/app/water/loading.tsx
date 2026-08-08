export default function WaterLoading() {
  return <main className="mx-auto w-full max-w-5xl flex-1 animate-pulse px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading water history"><div className="h-9 w-56 rounded bg-muted"/><div className="mt-8 h-24 rounded-2xl bg-muted"/><div className="mt-8 h-40 rounded-2xl bg-muted"/><div className="mt-8 space-y-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-28 rounded-2xl bg-muted"/>)}</div></main>
}
