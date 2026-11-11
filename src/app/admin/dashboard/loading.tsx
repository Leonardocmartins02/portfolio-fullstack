import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Carregamento do painel: as mesmas caixas da página pronta (cabeçalho, o
// formulário ao lado da lista de projetos e as mensagens).
export default function DashboardLoading() {
  return (
    <main role="status" aria-live="polite" className="page py-10 sm:py-12">
      <span className="sr-only">Carregando o painel…</span>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-44" />
        </div>
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>

      <Skeleton className="mb-4 h-4 w-24" />
      <div className="mb-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card className="space-y-4 p-6">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
          <Skeleton className="h-11 w-40 rounded-full" />
        </Card>
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i} className="flex items-start justify-between gap-4 p-5">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3.5 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Skeleton className="mb-4 h-4 w-48" />
      <Card className="space-y-3 p-5">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </Card>
    </main>
  );
}
