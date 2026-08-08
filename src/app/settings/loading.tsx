export default function SettingsLoading() {
  return <div className="mx-auto w-full max-w-4xl animate-pulse" aria-label="Loading settings"><div className="h-9 w-48 rounded bg-muted"/><div className="mt-8 space-y-6">{Array.from({ length: 5 }, (_, index) => <div key={index} className="h-40 rounded-2xl border bg-card"/>)}</div></div>
}
