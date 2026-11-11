import { Skeleton } from "@/components/ui/skeleton";

// Carregamento das páginas de projeto: a barra, a abertura e o vídeo em
// Skeleton, nas mesmas medidas da página pronta (components/case-study.tsx).
export default function CaseStudyLoading() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Carregando o projeto…</span>
      <div className="site-header sticky top-0 z-40">
        <div className="page flex h-16 items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>
      <div className="page pt-10 sm:pt-16">
        <div className="flex gap-2">
          <Skeleton className="h-[21px] w-24 rounded-full" />
          <Skeleton className="h-[21px] w-20 rounded-full" />
        </div>
        <Skeleton className="mt-5 h-[clamp(32px,4.4vw,56px)] w-full max-w-[680px]" />
        <Skeleton className="mt-3 h-[clamp(32px,4.4vw,56px)] w-2/3 max-w-[460px]" />
        <div className="mt-6 max-w-[62ch] space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/5" />
        </div>
        <div className="mt-8 flex gap-3">
          <Skeleton className="h-11 w-36 rounded-full" />
          <Skeleton className="h-11 w-44 rounded-full" />
        </div>
        <Skeleton className="mt-16 h-9 w-72 sm:mt-20" />
        <Skeleton className="mt-6 aspect-[4/3] w-full rounded-xl" />
      </div>
    </div>
  );
}
