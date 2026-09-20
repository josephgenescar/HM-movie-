export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-hm-bg px-5 text-hm-text">
      <div className="w-full max-w-md rounded-2xl border border-hm-border bg-hm-surface/60 p-8">
        <div className="mb-4 h-3 w-24 animate-pulse rounded-full bg-hm-border" />
        <div className="space-y-3">
          <div className="h-10 animate-pulse rounded-xl bg-hm-border/80" />
          <div className="h-10 animate-pulse rounded-xl bg-hm-border/60" />
          <div className="h-10 animate-pulse rounded-xl bg-hm-border/40" />
        </div>
      </div>
    </main>
  );
}
