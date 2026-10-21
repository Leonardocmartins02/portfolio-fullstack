"use client";

import { useEffect, useLayoutEffect, useRef, useState, type FocusEvent } from "react";
import { ProjectPanel, type ProjectPanelData } from "@/components/projects/ProjectPanel";
import {
  flushScroll,
  refreshScroll,
  registerScrollController,
  useMediaQuery,
  useReducedMotion,
  type ScrollFrame,
} from "@/lib/scroll-orchestrator";

// list: lista vertical (servidor, sem JS, movimento reduzido ou escolha manual).
// rail: trilho horizontal nativo (celular, tablet, desktop sem altura suficiente).
// sticky: seção fixa em que a rolagem vertical desloca os painéis (desktop).
type Mode = "list" | "rail" | "sticky";

const DESKTOP_QUERY = "(min-width: 64rem) and (pointer: fine)";
const STORAGE_KEY = "projetos:modo";
// Respiro entre o cabeçalho e o bloco fixo, e folga mínima abaixo dele.
const STICKY_GAP = 16;
const BOTTOM_MARGIN = 24;

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const pad = (value: number) => String(value).padStart(2, "0");

type Geometry = {
  /** Largura visível do viewport de projetos. */
  V: number;
  /** Deslocamento horizontal máximo (largura do trilho - V). */
  D: number;
  /** Altura do bloco fixo (cabeçalho + painéis + navegação). */
  H: number;
  /** Topo do bloco fixo na tela (cabeçalho + respiro). */
  T: number;
  /** Rolagem em que o bloco encaixa sob o cabeçalho. */
  S: number;
  lefts: number[];
  widths: number[];
  /** Deslocamento que alinha cada painel ao início do trilho. */
  dests: number[];
  sectionTop: number;
  padTop: number;
};

type Anchor = {
  element: Element | null;
  top: number;
  shift: number;
  focusIndex: number;
};

type Position = { index: number; atStart: boolean; atEnd: boolean };

function readStoredChoice() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "lista";
  } catch {
    return false;
  }
}

function storeChoice(list: boolean) {
  try {
    if (list) window.sessionStorage.setItem(STORAGE_KEY, "lista");
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sem armazenamento a escolha vale só até recarregar.
  }
}

function panelIndexOf(element: Element | null) {
  const panel = element?.closest<HTMLElement>("[data-panel-index]");
  return panel ? Number(panel.dataset.panelIndex) : -1;
}

export function ProjectsShowcase({ projects }: { projects: ProjectPanelData[] }) {
  const total = projects.length;
  const reducedMotion = useReducedMotion();
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const [enhanced, setEnhanced] = useState(false);
  const [manualList, setManualList] = useState(false);
  const [mode, setMode] = useState<Mode>("list");
  const [position, setPosition] = useState<Position>({ index: 0, atStart: true, atEnd: false });
  const [preload, setPreload] = useState(false);
  const [nextSectionId, setNextSectionId] = useState<string | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Estado lido pelo laço de rolagem a cada quadro, fora do ciclo de render.
  const live = useRef({
    mode: "list" as Mode,
    pending: null as Mode | null,
    allowed: false,
    desktop: false,
    geometry: null as Geometry | null,
    shift: 0,
    anchor: null as Anchor | null,
    position: { index: 0, atStart: true, atEnd: false } as Position,
    preload: false,
    /** Alvo da URL (#projetos ou abaixo) a reposicionar quando o layout final estiver pronto. */
    hashTarget: null as Element | null,
  });

  const horizontalAllowed = enhanced && !reducedMotion && !manualList && total > 1;

  useEffect(() => {
    const section = sectionRef.current;
    // A rolagem inicial até a âncora (suave pelo CSS) mira o layout em lista; se o
    // alvo for esta seção ou algo abaixo dela, a chegada é refeita no layout final.
    let target: HTMLElement | null = null;
    try {
      const id = decodeURIComponent(window.location.hash.slice(1));
      target = id ? document.getElementById(id) : null;
    } catch {
      // Hash malformado: segue sem reposicionar.
    }
    if (
      section &&
      target &&
      (target === section ||
        section.contains(target) ||
        section.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)
    ) {
      live.current.hashTarget = target;
    }
    let next = section?.nextElementSibling ?? null;
    while (next && !next.id) next = next.nextElementSibling;
    setNextSectionId(next?.id ?? null);
    setManualList(readStoredChoice());
    setEnhanced(true);
  }, []);

  // Guarda o que precisa continuar visível depois de uma troca de modo.
  function captureAnchor(frame: ScrollFrame) {
    const s = live.current;
    const section = sectionRef.current!;
    const rect = section.getBoundingClientRect();
    const active = document.activeElement;
    const focused = active instanceof HTMLElement && section.contains(active) ? active : null;

    let element: Element | null = null;
    if (focused) element = focused;
    else if (rect.bottom <= frame.headerOffset) element = section.nextElementSibling;
    else if (rect.top < frame.headerOffset - 1) element = stageRef.current;

    s.anchor = {
      element,
      top: element?.getBoundingClientRect().top ?? 0,
      shift: s.shift,
      focusIndex: panelIndexOf(focused),
    };
  }

  function restoreAnchor() {
    const s = live.current;
    const anchor = s.anchor;
    const hashTarget = s.hashTarget;
    s.anchor = null;
    s.hashTarget = null;
    if (hashTarget && s.mode !== "list") {
      // Instantâneo: interrompe a animação que ia para a posição do layout antigo.
      // A animação ainda pode aplicar um último passo; no quadro seguinte, confere.
      const land = () => hashTarget.scrollIntoView({ block: "start", behavior: "instant" });
      land();
      const expected = hashTarget.getBoundingClientRect().top;
      requestAnimationFrame(() => {
        if (Math.abs(hashTarget.getBoundingClientRect().top - expected) > 1) land();
      });
      return;
    }
    if (!anchor) return;
    const g = s.geometry;
    const viewport = viewportRef.current!;
    const dest = g
      ? anchor.focusIndex >= 0
        ? g.dests[anchor.focusIndex]
        : clamp(anchor.shift, 0, g.D)
      : 0;

    if (s.mode === "rail") viewport.scrollLeft = dest;
    if (
      s.mode === "sticky" &&
      g &&
      (anchor.focusIndex >= 0 || anchor.element === stageRef.current)
    ) {
      window.scrollTo({ top: g.S + dest, behavior: "instant" });
      return;
    }
    if (anchor.element?.isConnected) {
      const delta = anchor.element.getBoundingClientRect().top - anchor.top;
      if (Math.abs(delta) >= 1) window.scrollBy({ top: delta, behavior: "instant" });
    }
  }

  function decide(frame: ScrollFrame): Mode {
    const s = live.current;
    if (!s.allowed) return "list";
    if (!s.desktop) return "rail";
    // A elegibilidade do sticky se mede com a composição horizontal aplicada.
    if (s.mode === "list") return "rail";
    const available = frame.viewportHeight - frame.headerOffset - STICKY_GAP - BOTTOM_MARGIN;
    return stageRef.current!.offsetHeight <= available ? "sticky" : "rail";
  }

  // Controlador registrado no laço compartilhado.
  useIsomorphicLayoutEffect(() => {
    if (!enhanced) return;
    const s = live.current;
    const section = sectionRef.current!;
    const runway = runwayRef.current!;
    const stage = stageRef.current!;
    const viewport = viewportRef.current!;
    const track = trackRef.current!;

    return registerScrollController({
      element: section,
      measure(frame) {
        const want = decide(frame);
        if (want !== s.mode) {
          if (want !== s.pending) {
            if (!s.anchor) captureAnchor(frame);
            s.pending = want;
            setMode(want);
          }
          return false;
        }
        if (want === "list") {
          s.geometry = null;
          return;
        }
        const panels = Array.from(track.children) as HTMLElement[];
        const V = viewport.clientWidth;
        const D = Math.max(0, track.offsetWidth - V);
        const lefts = panels.map((panel) => panel.offsetLeft);
        const sectionTop = section.getBoundingClientRect().top + frame.scrollY;
        const runwayTop = runway.getBoundingClientRect().top + frame.scrollY;
        const T = frame.headerOffset + STICKY_GAP;
        s.geometry = {
          V,
          D,
          H: stage.offsetHeight,
          T,
          S: runwayTop - T,
          lefts,
          widths: panels.map((panel) => panel.offsetWidth),
          dests: lefts.map((left) => clamp(left - lefts[0], 0, D)),
          sectionTop,
          padTop: runwayTop - sectionTop,
        };
      },
      read(frame) {
        const g = s.geometry;
        if (!g || s.mode === "list") return;
        s.shift =
          s.mode === "sticky"
            ? g.D > 0
              ? g.D * clamp((frame.scrollY - g.S) / g.D, 0, 1)
              : 0
            : viewport.scrollLeft;
      },
      write(frame) {
        const g = s.geometry;
        if (!g || s.mode === "list") return;

        if (s.mode === "sticky") {
          // Altura interna = H + D: cada pixel rolado desloca um pixel do trilho.
          runway.style.height = `${g.H + g.D}px`;
          stage.style.top = `${g.T}px`;
          // A âncora #projetos chega com o bloco já encaixado sob o cabeçalho.
          section.style.scrollMarginTop = `${STICKY_GAP - g.padTop}px`;
          track.style.transform = `translate3d(${(-s.shift).toFixed(2)}px, 0, 0)`;
        }

        // Contador: painel com maior área visível; empate, o mais próximo do alinhamento.
        let index = 0;
        let bestVisible = -1;
        let bestDistance = Infinity;
        g.lefts.forEach((left, i) => {
          const start = left - s.shift;
          const visible = Math.max(0, Math.min(start + g.widths[i], g.V) - Math.max(start, 0));
          const distance = Math.abs(g.dests[i] - s.shift);
          if (
            visible > bestVisible + 0.5 ||
            (Math.abs(visible - bestVisible) <= 0.5 && distance < bestDistance)
          ) {
            index = i;
            bestVisible = visible;
            bestDistance = distance;
          }
        });
        const next = { index, atStart: s.shift <= 0.5, atEnd: s.shift >= g.D - 0.5 };
        const prev = s.position;
        if (prev.index !== next.index || prev.atStart !== next.atStart || prev.atEnd !== next.atEnd) {
          s.position = next;
          setPosition(next);
        }

        // Imagens dos painéis fora da área visível carregam antes de a seção chegar.
        if (!s.preload && g.sectionTop - frame.scrollY < frame.viewportHeight * 2) {
          s.preload = true;
          setPreload(true);
        }
      },
    });
  }, [enhanced]);

  // Cada troca de modo limpa o que o modo anterior escreveu, mede a página de
  // cima para baixo (a Trajetória logo abaixo depende da altura desta seção) e
  // devolve a tela ao mesmo ponto.
  useIsomorphicLayoutEffect(() => {
    const s = live.current;
    s.allowed = horizontalAllowed;
    s.desktop = desktop;
    if (s.mode !== mode) {
      s.mode = mode;
      s.pending = null;
      if (mode !== "sticky") {
        runwayRef.current?.style.removeProperty("height");
        stageRef.current?.style.removeProperty("top");
        trackRef.current?.style.removeProperty("transform");
        sectionRef.current?.style.removeProperty("scroll-margin-top");
      }
      if (mode !== "rail" && viewportRef.current) viewportRef.current.scrollLeft = 0;
      if (mode === "list") {
        s.geometry = null;
        s.shift = 0;
      }
    }
    if (!enhanced) return;
    if (!refreshScroll()) return;
    restoreAnchor();
    flushScroll();
  }, [mode, enhanced, horizontalAllowed, desktop]);

  function toggleList() {
    const s = live.current;
    const toggle = toggleRef.current;
    if (toggle) {
      s.anchor = {
        element: toggle,
        top: toggle.getBoundingClientRect().top,
        shift: s.shift,
        focusIndex: -1,
      };
    }
    const list = mode !== "list";
    storeChoice(list);
    setManualList(list);
  }

  function go(direction: 1 | -1) {
    const s = live.current;
    const g = s.geometry;
    if (!g) return;
    const target =
      direction > 0
        ? g.dests.find((dest) => dest > s.shift + 1)
        : [...g.dests].reverse().find((dest) => dest < s.shift - 1);
    if (target === undefined) return;
    if (s.mode === "sticky") window.scrollTo({ top: g.S + target, behavior: "smooth" });
    else viewportRef.current?.scrollTo({ left: target, behavior: "smooth" });
  }

  // No sticky, focar um link de painel fora da tela leva a página até ele na hora,
  // sem animação e sem mover o foco.
  function revealFocused(event: FocusEvent<HTMLUListElement>) {
    const s = live.current;
    const g = s.geometry;
    if (s.mode !== "sticky" || !g) return;
    const i = panelIndexOf(event.target);
    if (i < 0) return;
    viewportRef.current!.scrollLeft = 0;
    const start = g.lefts[i] - s.shift;
    if (start >= -1 && start + g.widths[i] <= g.V + 1) return;
    window.scrollTo({ top: g.S + g.dests[i], behavior: "instant" });
    flushScroll();
  }

  const horizontal = enhanced && mode !== "list";
  const showToggle = enhanced && !reducedMotion && total > 1;

  return (
    <section
      ref={sectionRef}
      id="projetos"
      aria-labelledby="projetos-titulo"
      data-mode={mode}
      className="projects py-16"
    >
      <div ref={runwayRef} className="projects-runway">
        <div ref={stageRef} className="projects-stage">
          <div className="mx-auto mb-6 flex max-w-content flex-wrap items-end justify-between gap-x-6 gap-y-3 px-6">
            <div>
              <span className="text-sm font-medium uppercase tracking-widest text-accent">
                Projetos selecionados
              </span>
              <h2
                id="projetos-titulo"
                className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl"
              >
                Projetos em destaque
              </h2>
            </div>
            {showToggle ? (
              <button
                ref={toggleRef}
                type="button"
                onClick={toggleList}
                className="projects-toggle focus-ring min-h-11 rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-accent/60"
              >
                {mode === "list" ? "Ver na horizontal" : "Ver todos em lista"}
              </button>
            ) : null}
          </div>

          <div
            ref={viewportRef}
            className="projects-viewport"
            role={mode === "rail" ? "region" : undefined}
            aria-label={mode === "rail" ? "Projetos em destaque, rolagem horizontal" : undefined}
            tabIndex={mode === "rail" ? 0 : undefined}
          >
            <ul ref={trackRef} id="projetos-trilho" className="projects-track" onFocus={revealFocused}>
              {projects.map((project, i) => (
                <li key={project.id} data-panel-index={i}>
                  <ProjectPanel
                    project={project}
                    headingId={`projeto-${project.id}`}
                    loading={preload ? "eager" : "lazy"}
                  />
                </li>
              ))}
            </ul>
          </div>

          {horizontal ? (
            <div className="projects-nav mx-auto mt-5 flex max-w-content flex-wrap items-center gap-x-6 gap-y-3 px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => !position.atStart && go(-1)}
                  aria-disabled={position.atStart}
                  aria-controls="projetos-trilho"
                  aria-label="Projeto anterior"
                  className="projects-nav__button focus-ring"
                >
                  <span aria-hidden="true">←</span>
                </button>
                <p className="min-w-[4.5rem] text-center text-sm tabular-nums text-foreground">
                  <span aria-hidden="true">
                    {pad(position.index + 1)} / {pad(total)}
                  </span>
                  <span className="sr-only">
                    Projeto {position.index + 1} de {total}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => !position.atEnd && go(1)}
                  aria-disabled={position.atEnd}
                  aria-controls="projetos-trilho"
                  aria-label="Próximo projeto"
                  className="projects-nav__button focus-ring"
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              <p className="text-sm text-muted">
                {mode === "sticky" ? "Role para explorar os projetos" : "Deslize ou use as setas"}
              </p>
              {nextSectionId ? (
                <a
                  href={`#${nextSectionId}`}
                  className="focus-ring ml-auto rounded text-sm font-medium text-accent-text underline decoration-accent-text/40 underline-offset-4 hover:decoration-accent-text"
                >
                  Continuar para a próxima seção <span aria-hidden="true">↓</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
