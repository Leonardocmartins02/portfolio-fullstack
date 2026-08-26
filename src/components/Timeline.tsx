import { timeline } from "@/lib/data";

export function Timeline() {
  return (
    <section id="trajetoria" className="mx-auto max-w-content px-6 py-16">
      <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-accent">
        Trajetória
      </h2>
      <ol className="space-y-8 border-l border-border pl-6">
        {timeline.map((item) => (
          <li key={item.year} className="relative">
            <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-accent" />
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {item.year}
            </span>
            <h3 className="mt-1 text-base font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 text-sm text-muted">{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
