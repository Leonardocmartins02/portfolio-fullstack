import { stats } from "@/lib/data";

export function Stats() {
  return (
    <section className="mx-auto max-w-content px-6 pb-16">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-lg font-semibold text-foreground sm:text-xl">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
