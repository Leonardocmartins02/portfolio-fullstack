import { skills } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-content px-6 py-16">
      <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-accent">
        Skills &amp; Ferramentas
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {skills.map((group) => (
          <div
            key={group.group}
            className="rounded-2xl border border-border bg-surface/60 p-5"
          >
            <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">
              {group.group}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground/90"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
