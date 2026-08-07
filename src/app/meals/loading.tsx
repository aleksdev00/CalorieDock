export default function MealsLoading() {
  return <main className="mx-auto w-full max-w-5xl flex-1 animate-pulse px-4 py-10 sm:px-6" aria-label="Loading meals"><div className="h-9 w-48 rounded bg-muted" /><div className="mt-3 h-5 w-full max-w-xl rounded bg-muted" /><div className="mt-8 space-y-4">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-40 rounded-2xl bg-muted" />)}</div></main>
}
