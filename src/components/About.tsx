import type { CSSProperties } from "react";
import { profile, stats } from "@/lib/data";

// Capítulo elevado: a bio em tamanho de leitura confortável e os números como fatos
// ao lado. As ferramentas ficam no capítulo Skills.
export function About() {
  return (
    <section id="sobre" data-chapter="raised" className="chapter chapter-raised">
      <div className="frame grid-12 gap-y-12 py-[var(--section-gap)]">
        <div className="col-span-12 lg:col-span-4">
          <h2 data-reveal className="t-title">
            Quem sou eu
          </h2>
          <dl className="about__facts mt-10">
            {stats.map((stat, i) => (
              <div key={stat.label} data-reveal style={{ "--i": i + 1 } as CSSProperties}>
                <dt className="t-small text-muted">{stat.label}</dt>
                <dd className="t-lead mt-1 font-semibold tabular-nums">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p
          data-reveal
          style={{ "--i": 1 } as CSSProperties}
          className="t-lead col-span-12 lg:col-span-7 lg:col-start-6"
        >
          {profile.bio}
        </p>
      </div>
    </section>
  );
}
