import type { CSSProperties } from "react";
import { skills } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

// Capítulo elevado entre a Trajetória e o Contato: o título grande à esquerda, com o
// ✳ como marca, e os grupos numerados à direita, cada um com as ferramentas em
// etiquetas.
export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-titulo"
      data-chapter="raised"
      className="chapter chapter-raised"
    >
      <div className="frame grid-12 gap-y-12 py-[var(--section-gap)]">
        <h2 id="skills-titulo" data-reveal className="skills__title col-span-12 lg:col-span-6">
          Do código
          <br />
          <em>à infraestrutura.</em>
          {/* FE0E: força o ✳ como texto (na cor de destaque), nunca como emoji. */}
          <span aria-hidden="true" className="skills__star">
            {"✳︎"}
          </span>
        </h2>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          {skills.map((group, i) => (
            <div
              key={group.group}
              data-reveal
              style={{ "--i": i } as CSSProperties}
              className="skills__group"
            >
              <h3 className="flex items-baseline gap-4 text-lg font-medium">
                <span aria-hidden="true" className="t-small font-medium tabular-nums text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {group.group}
              </h3>
              <ul className="skills__tags mt-4">
                {group.items.map((item) => (
                  <li key={item}>
                    <Badge variant="outline" size="lg" className="max-w-full whitespace-normal leading-snug">
                      {item}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
