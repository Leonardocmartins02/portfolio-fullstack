import { timeline } from "@/lib/data";

const MONTHS: Record<string, string> = {
  jan: "01",
  fev: "02",
  mar: "03",
  abr: "04",
  mai: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  set: "09",
  out: "10",
  nov: "11",
  dez: "12",
};

// item.year e um rotulo livre ("set/2025 – Atual", "Formacao"), nem sempre uma
// data de verdade. So gera dateTime quando reconhece o formato "mes/ano".
function toDateTime(year: string): string | undefined {
  const match = year.match(/([a-zç]{3})\/(\d{4})/i);
  if (!match) return undefined;
  const month = MONTHS[match[1].toLowerCase()];
  if (!month) return undefined;
  return `${match[2]}-${month}`;
}

export function Timeline() {
  return (
    <section id="trajetoria" className="mx-auto max-w-content px-6 py-16">
      <span className="text-sm font-medium uppercase tracking-widest text-accent">
        Trajetória
      </span>
      <h2 className="mb-6 mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
        Como cheguei até aqui
      </h2>
      <ol className="space-y-6 border-l border-border pl-6">
        {timeline.map((item) => {
          const dateTime = toDateTime(item.year);
          return (
            <li key={item.year} className="relative">
              <span className="absolute -left-[29px] top-6 h-3 w-3 rounded-full bg-accent" />
              <div className="rounded-2xl border border-border bg-surface/60 p-5">
                {dateTime ? (
                  <time
                    dateTime={dateTime}
                    className="text-xs font-medium uppercase tracking-wide text-accent"
                  >
                    {item.year}
                  </time>
                ) : (
                  <span className="text-xs font-medium uppercase tracking-wide text-accent">
                    {item.year}
                  </span>
                )}
                <h3 className="mt-1 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
