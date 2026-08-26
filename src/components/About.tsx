import { profile } from "@/lib/data";

export function About() {
  return (
    <section id="sobre" className="mx-auto max-w-content px-6 py-16">
      <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-accent">
        Sobre
      </h2>
      <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">
        {profile.bio}
      </p>
    </section>
  );
}
