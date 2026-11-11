import { Skeleton } from "@/components/ui/skeleton";

// Carregamento da home (volta de uma página de projeto, revalidação): a mesma
// grade do hero em Skeleton, para a troca não pular de layout.
export default function HomeLoading() {
  return (
    <div role="status" aria-live="polite" className="min-h-[100svh] bg-background">
      <span className="sr-only">Carregando…</span>
      <div className="frame flex h-16 items-center justify-between shadow-[inset_0_-1px_0_rgb(var(--border))]">
        <Skeleton className="h-5 w-36" />
        <div className="flex items-center gap-2">
          <Skeleton className="hidden h-8 w-[320px] md:block" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>
      <div className="frame grid-12 items-center gap-y-10 py-12 lg:min-h-[calc(100svh-4rem)]">
        <div className="col-span-12 space-y-6 lg:col-span-5">
          <Skeleton className="h-[clamp(40px,6vw,72px)] w-3/4" />
          <Skeleton className="h-[clamp(40px,6vw,72px)] w-2/3" />
          <div className="space-y-3 pt-2">
            <Skeleton className="h-5 w-full max-w-[38ch]" />
            <Skeleton className="h-5 w-4/5 max-w-[32ch]" />
          </div>
          <Skeleton className="h-12 w-40 rounded-full" />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <Skeleton className="aspect-[10/7] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
