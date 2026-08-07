export default function WeightLoading() {
  return <main className="mx-auto w-full max-w-5xl flex-1 animate-pulse px-4 py-10 sm:px-6" aria-busy="true" aria-label="Loading weight history"><div className="h-9 w-56 rounded bg-muted"/><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-24 rounded-2xl bg-muted"/>)}</div><div className="mt-8 h-64 rounded-2xl bg-muted"/><div className="mt-8 space-y-3">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-32 rounded-2xl bg-muted"/>)}</div></main>
}
