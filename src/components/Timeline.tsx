"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { education, experiences } from "@/lib/data";
import { registerScrollController, useReducedMotion } from "@/lib/scroll-orchestrator";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// "2026-09" -> "set/2026"
function formatMonth(value: string) {
  const [year, month] = value.split("-");
  return `${MONTHS[Number(month) - 1]}/${year}`;
}

// Linha de leitura: 45% da altura útil, abaixo do cabeçalho fixo.
const READING_LINE = 0.45;

// Título centralizado e experiências em uma faixa de leitura, sem retrato.
// O período em leitura recebe destaque sem esconder o restante do conteúdo.
export function Timeline() {
  const reducedMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || reducedMotion) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-timeline-row]"));
    let active = -1;

    const unregister = registerScrollController({
      element: list,
      measure() {},
      // A linha da vez: a que contém a linha de leitura, ou a visível mais perto dela.
      read(frame) {
        const line = frame.headerOffset + READING_LINE * (frame.viewportHeight - frame.headerOffset);
        let next = -1;
        let best = Infinity;
        rows.forEach((row, i) => {
          const rect = row.getBoundingClientRect();
          if (rect.bottom < frame.headerOffset || rect.top > frame.viewportHeight) return;
          const distance =
            line < rect.top ? rect.top - line : line > rect.bottom ? line - rect.bottom : 0;
          if (distance < best) {
            best = distance;
            next = i;
          }
        });
        active = next;
      },
      write() {
        rows.forEach((row, i) => {
          if (i === active) row.dataset.active = "";
          else delete row.dataset.active;
        });
      },
    });
    return () => {
      unregister();
      for (const row of rows) delete row.dataset.active;
    };
  }, [reducedMotion]);

  return (
    <section
      id="trajetoria"
      aria-labelledby="trajetoria-titulo"
      data-chapter="dark"
      className="timeline chapter chapter-dark"
    >
      <div className="frame py-[var(--section-gap)]">
        <h2
          id="trajetoria-titulo"
          data-reveal
          className="timeline__title t-title"
        >
          Como cheguei até aqui
        </h2>

        <div className="timeline__content mt-16">
          <div>
            <ol ref={listRef} className="timeline__list">
              {experiences.map((item, i) => (
                <li
                  key={item.id}
                  data-timeline-row
                  data-reveal="row"
                  style={{ "--i": i } as CSSProperties}
                  className="timeline__row"
                >
                  <p className="timeline__period t-small text-muted tabular-nums">
                    <time dateTime={item.start}>{formatMonth(item.start)}</time>
                    {" – "}
                    {item.end ? <time dateTime={item.end}>{formatMonth(item.end)}</time> : "atual"}
                  </p>
                  <div>
                    <h3 className="t-body font-semibold">{item.role}</h3>
                    <p className="t-body">{item.company}</p>
                    <p className="t-small mt-2 text-muted">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div data-reveal className="timeline__row timeline__education">
              <p className="t-small text-muted">Formação, {education.status.toLowerCase()}</p>
              <div>
                <h3 className="t-body font-semibold">{education.course}</h3>
                <p className="t-body">{education.institution}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
