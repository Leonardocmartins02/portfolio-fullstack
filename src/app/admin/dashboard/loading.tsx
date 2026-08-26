export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-content px-6 py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse rounded bg-surface" />
          <div className="h-4 w-32 animate-pulse rounded bg-surface" />
        </div>
        <div className="h-9 w-20 animate-pulse rounded-full bg-surface" />
      </div>

      <div className="mb-14 space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-surface" />
        <div className="h-40 animate-pulse rounded-2xl bg-surface" />
      </div>

      <div className="space-y-4">
        <div className="h-4 w-40 animate-pulse rounded bg-surface" />
        <div className="h-24 animate-pulse rounded-2xl bg-surface" />
      </div>
    </main>
  );
}
