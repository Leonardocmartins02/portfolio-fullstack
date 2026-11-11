import type { CSSProperties } from "react";
import { profile, stats } from "@/lib/data";
import { Card } from "@/components/ui/card";

// Capítulo elevado: a bio em tamanho de leitura confortável e os números como
// cards ao lado (why-card do DESIGN.md). As ferramentas ficam no capítulo Skills.
export function About() {
  return (
    <section id="sobre" data-chapter="raised" className="chapter chapter-raised">
      <div className="frame grid-12 gap-y-10 py-[var(--section-gap)] lg:gap-y-12">
        <div className="col-span-12 lg:col-span-5">
          <h2 data-reveal className="t-title">
            Quem sou eu
          </h2>
          <dl className="about__facts mt-8 [&>*:last-child:nth-child(odd)]:col-span-2 lg:mt-10">
            {stats.map((stat, i) => (
              // A entrada fica no invólucro: o card tem a própria transição de hover.
              <div key={stat.label} data-reveal style={{ "--i": i + 1 } as CSSProperties}>
                <Card className="card-hover flex h-full flex-col justify-between gap-3 p-4 sm:p-6">
                  <dt className="t-small text-muted-foreground">{stat.label}</dt>
                  <dd className="text-xl font-medium leading-tight tracking-tight tabular-nums sm:text-[22px]">
                    {stat.value}
                  </dd>
                </Card>
              </div>
            ))}
          </dl>
        </div>

        <p
          data-reveal
          style={{ "--i": 1 } as CSSProperties}
          className="t-lead col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-3"
        >
          {profile.bio}
        </p>
      </div>
    </section>
  );
}
