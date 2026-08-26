import { profile } from "@/lib/data";

export function About() {
  return (
    <section id="sobre" className="mx-auto max-w-content px-6 py-16">
      <span className="text-sm font-medium uppercase tracking-widest text-accent">
        Sobre
      </span>
      <h2 className="mb-6 mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
        Quem sou eu
      </h2>
      <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">
        {profile.bio}
      </p>
    </section>
  );
}
