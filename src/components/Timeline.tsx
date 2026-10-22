"use client";

import { useEffect, useRef } from "react";
import { education, experiences } from "@/lib/data";
import {
  registerScrollController,
  useReducedMotion,
  type ScrollController,
  type ScrollFrame,
} from "@/lib/scroll-orchestrator";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

// "2026-09" -> "set/2026"
function formatMonth(value: string) {
  const [year, month] = value.split("-");
  return `${MONTHS[Number(month) - 1]}/${year}`;
}

// Linha de leitura: 45% da altura útil, abaixo do cabeçalho fixo.
const READING_LINE = 0.45;
// Folga nas fronteiras para o cartão dominante não alternar a cada pixel.
const HYSTERESIS = 12;
// Opacidade do acento conforme o progresso do cartão: [0, .25, .70, 1] -> [0, 1, 1, 0].
const ACCENT_STOPS: Array<[number, number]> = [
  [0, 0],
  [0.25, 1],
  [0.7, 1],
  [1, 0],
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function interpolate(stops: Array<[number, number]>, x: number) {
  if (x <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [x1, y1] = stops[i];
    if (x <= x1) {
      const [x0, y0] = stops[i - 1];
      return x1 === x0 ? y1 : y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return stops[stops.length - 1][1];
}

// Progresso de 0 a 1 entre duas posições de rolagem. Faixa sem percurso (limitada
// pelo topo ou pelo fim da página) vira um degrau.
function rangeProgress(scrollY: number, start: number, end: number) {
  if (end - start < 1) return scrollY >= end ? 1 : 0;
  return clamp((scrollY - start) / (end - start), 0, 1);
}

type Geometry = {
  fillTop: number;
  length: number;
  /** Posição de cada marcador no eixo, a partir do primeiro. */
  axis: number[];
  /** Rolagem em que cada marcador cruza a linha de leitura (limitada à página). */
  thresholds: number[];
  markers: number[];
  cards: Array<{ top: number; bottom: number }>;
  ranges: Array<[number, number]>;
  reading: number;
};

function createController(root: HTMLElement): ScrollController & { reset(): void } {
  const fill = root.querySelector<HTMLElement>("[data-timeline-fill]")!;
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-timeline-item]"));
  const parts = items.map((item) => ({
    item,
    card: item.querySelector<HTMLElement>("[data-timeline-card]")!,
    marker: item.querySelector<HTMLElement>("[data-timeline-marker]")!,
    accent: item.querySelector<HTMLElement>("[data-timeline-accent]")!,
  }));

  let geometry: Geometry | null = null;
  let active = -1;

  // Preenchimento do eixo, interpolado por trechos entre os marcadores medidos:
  // o eixo chega a cada ponto exatamente quando ele cruza a linha de leitura.
  function fillAt(scrollY: number, g: Geometry) {
    const { thresholds: t, axis: a } = g;
    if (scrollY <= t[0]) return 0;
    for (let i = t.length - 1; i >= 0; i--) {
      if (scrollY < t[i]) continue;
      if (i === t.length - 1) return a[i];
      const span = t[i + 1] - t[i];
      return span < 1 ? a[i] : a[i] + ((a[i + 1] - a[i]) * (scrollY - t[i])) / span;
    }
    return 0;
  }

  function dominant(frame: ScrollFrame, g: Geometry) {
    const top = (i: number) => g.cards[i].top - frame.scrollY;
    const bottom = (i: number) => g.cards[i].bottom - frame.scrollY;
    const visible = (i: number) => bottom(i) > frame.headerOffset && top(i) < frame.viewportHeight;
    const indexes = g.cards.map((_, i) => i).filter(visible);
    if (indexes.length === 0) return -1;

    const line = g.reading;
    if (
      active !== -1 &&
      visible(active) &&
      line >= top(active) - HYSTERESIS &&
      line <= bottom(active) + HYSTERESIS
    ) {
      return active;
    }
    const crossed = indexes.find((i) => line >= top(i) && line <= bottom(i));
    if (crossed !== undefined) return crossed;

    // A linha está num espaço: vence o marcador visível mais próximo.
    const distance = (i: number) => Math.abs(g.markers[i] - frame.scrollY - line);
    const candidates = indexes.filter((i) => {
      const y = g.markers[i] - frame.scrollY;
      return y >= frame.headerOffset && y <= frame.viewportHeight;
    });
    const pool = candidates.length > 0 ? candidates : indexes;
    let best = pool[0];
    for (const i of pool) if (distance(i) < distance(best)) best = i;
    if (active !== -1 && pool.includes(active) && distance(active) <= distance(best) + HYSTERESIS) {
      return active;
    }
    return best;
  }

  function reset() {
    delete root.dataset.scroll;
    fill.style.removeProperty("top");
    fill.style.removeProperty("height");
    fill.style.removeProperty("transform");
    for (const { item, marker, accent } of parts) {
      delete item.dataset.active;
      delete marker.dataset.reached;
      accent.style.removeProperty("opacity");
    }
    active = -1;
  }

  return {
    element: root,
    measure(frame) {
      const y = frame.scrollY;
      const reading = frame.headerOffset + READING_LINE * (frame.viewportHeight - frame.headerOffset);
      const limit = (value: number) => clamp(value, 0, frame.maxScroll);
      const rootTop = root.getBoundingClientRect().top + y;
      const markers = parts.map(({ marker }) => {
        const rect = marker.getBoundingClientRect();
        return rect.top + rect.height / 2 + y;
      });
      const cards = parts.map(({ card }) => {
        const rect = card.getBoundingClientRect();
        return { top: rect.top + y, bottom: rect.bottom + y };
      });
      const thresholds = markers.map((marker) => limit(marker - reading));
      const length = markers[markers.length - 1] - markers[0];

      // Sem percurso útil (um item só, ou a página não rola o bastante): estática.
      if (parts.length < 2 || length <= 0 || thresholds[thresholds.length - 1] <= thresholds[0]) {
        geometry = null;
        return;
      }
      geometry = {
        fillTop: markers[0] - rootTop,
        length,
        axis: markers.map((marker) => marker - markers[0]),
        thresholds,
        markers,
        cards,
        ranges: cards.map((card) => [limit(card.top - reading), limit(card.bottom - reading)]),
        reading,
      };
    },
    write(frame) {
      const g = geometry;
      if (!g) {
        if (root.dataset.scroll) reset();
        return;
      }
      root.dataset.scroll = "on";
      fill.style.top = `${g.fillTop}px`;
      fill.style.height = `${g.length}px`;
      fill.style.transform = `scaleY(${(fillAt(frame.scrollY, g) / g.length).toFixed(4)})`;

      const next = dominant(frame, g);
      parts.forEach(({ item, marker, accent }, i) => {
        if (frame.scrollY >= g.thresholds[i]) marker.dataset.reached = "true";
        else delete marker.dataset.reached;

        const progress = rangeProgress(frame.scrollY, g.ranges[i][0], g.ranges[i][1]);
        accent.style.opacity = interpolate(ACCENT_STOPS, progress).toFixed(3);

        if (i === next) item.dataset.active = "true";
        else delete item.dataset.active;
      });
      active = next;
    },
    // Usado na limpeza do efeito (desmontagem ou movimento reduzido).
    reset,
  };
}

export function Timeline() {
  const reducedMotion = useReducedMotion();
  const axisRef = useRef<HTMLDivElement>(null);

  // A versão estática completa vem do servidor; o movimento só liga no cliente,
  // sem movimento reduzido, e só depois da primeira medição.
  useEffect(() => {
    const root = axisRef.current;
    if (!root || reducedMotion) return;
    const controller = createController(root);
    const unregister = registerScrollController(controller);
    return () => {
      unregister();
      controller.reset();
    };
  }, [reducedMotion]);

  return (
    <section
      id="trajetoria"
      aria-labelledby="trajetoria-titulo"
      className="timeline-section mx-auto max-w-content px-6 py-16"
    >
      <span className="text-sm font-medium uppercase tracking-widest text-accent">
        Trajetória
      </span>
      <h2
        id="trajetoria-titulo"
        className="mb-8 mt-2 text-2xl font-semibold text-foreground sm:text-3xl"
      >
        Como cheguei até aqui
      </h2>

      <div ref={axisRef} className="timeline">
        <div aria-hidden="true" className="timeline-fill" data-timeline-fill />
        <ol className="timeline-list">
          {experiences.map((item) => (
            <li key={item.id} className="timeline-item" data-timeline-item>
              <span aria-hidden="true" className="timeline-marker" data-timeline-marker />
              <article className="timeline-card" data-timeline-card>
                <span aria-hidden="true" className="timeline-accent" data-timeline-accent />
                <div className="relative">
                  <p className="text-xs font-medium uppercase tracking-wide text-accent-text">
                    <time dateTime={item.start}>{formatMonth(item.start)}</time>
                    {" – "}
                    {item.end ? <time dateTime={item.end}>{formatMonth(item.end)}</time> : "Atual"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground md:text-xl">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-[0.9375rem] font-medium text-foreground/80">
                    {item.company}
                  </p>
                  <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>

      <div className="timeline-education">
        <article className="timeline-card">
          <p className="text-xs font-medium uppercase tracking-wide text-accent-text">
            Formação · {education.status}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-foreground md:text-xl">
            {education.course}
          </h3>
          <p className="mt-1 text-[0.9375rem] font-medium text-foreground/80">
            {education.institution}
          </p>
        </article>
      </div>
    </section>
  );
}
