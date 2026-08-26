import { stats } from "@/lib/data";

export function Stats() {
  return (
    <section className="mx-auto max-w-content px-6 pb-16">
      <h2 className="sr-only">Resumo profissional</h2>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className="text-lg font-semibold text-foreground sm:text-xl">{stat.value}</dd>
            <dt className="mt-1 text-xs uppercase tracking-wide text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
