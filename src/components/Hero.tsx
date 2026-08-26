import { profile } from "@/lib/data";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-content flex-col gap-6 px-6 py-24 sm:py-32">
      <span className="text-sm font-medium uppercase tracking-widest text-accent">
        {profile.role}
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
        {profile.tagline}
      </h1>
      <p className="max-w-xl text-base text-muted">
        {profile.name} · {profile.location}
      </p>
      <div className="flex gap-4 pt-2">
        <a
          href="#projetos"
          className="focus-ring rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Ver projetos
        </a>
        <a
          href="#contato"
          className="focus-ring rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent"
        >
          Entrar em contato
        </a>
      </div>
    </section>
  );
}
