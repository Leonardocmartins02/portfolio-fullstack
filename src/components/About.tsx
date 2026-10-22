import type { CSSProperties } from "react";
import { profile, skills, stats } from "@/lib/data";

// Capítulo claro: a bio em tamanho de leitura confortável, os números como fatos
// ao lado e as ferramentas em listas, sem caixas nem etiquetas.
export function About() {
  return (
    <section id="sobre" data-chapter="light" className="chapter chapter-light">
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

        <div id="skills" className="col-span-12 grid-12 mt-8 gap-y-8 lg:mt-24">
          <h3 data-reveal className="t-lead col-span-12 font-semibold lg:col-span-4">
            Ferramentas e tecnologias
          </h3>
          <div className="about__tools col-span-12 lg:col-span-7 lg:col-start-6">
            {skills.map((group, i) => (
              <div key={group.group} data-reveal style={{ "--i": i } as CSSProperties}>
                <h4 className="t-body font-semibold">{group.group}</h4>
                <ul className="t-body mt-3 space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
