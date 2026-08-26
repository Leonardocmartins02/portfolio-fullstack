import { skills } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-content px-6 py-16">
      <span className="text-sm font-medium uppercase tracking-widest text-accent">
        Skills &amp; Ferramentas
      </span>
      <h2 className="mb-6 mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
        Ferramentas e tecnologias
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <div
            key={group.group}
            className="rounded-2xl border border-border bg-surface/60 p-5"
          >
            <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted">
              {group.group}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-foreground/90 transition-colors hover:border-accent/60"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
