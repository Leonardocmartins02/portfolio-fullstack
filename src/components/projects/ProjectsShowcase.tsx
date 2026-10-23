"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import { ProjectPanel, type ProjectPanelData } from "@/components/projects/ProjectPanel";
import {
  flushScroll,
  getHeaderOffset,
  registerScrollController,
  useReducedMotion,
} from "@/lib/scroll-orchestrator";

// Assinatura da página (taste-skill, "pinned story"): o título "Projetos" fica
// preso no topo enquanto cada projeto, um painel de tela cheia, sobe por cima do
// anterior. Sem JS ou com movimento reduzido, os painéis só seguem um abaixo do outro.

// Pilha de cartas: quanto o painel coberto recua (5%) enquanto o seguinte sobe.
const DEPTH_SCALE = 0.05;

export function ProjectsShowcase({ projects }: { projects: ProjectPanelData[] }) {
  const total = projects.length;
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const naturalTops = useRef<number[]>([]);
  const [preload, setPreload] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list || reducedMotion) return;
    const slots = Array.from(list.children) as HTMLElement[];
    // Texto de cada painel (filhos da linha do nome e da coluna de texto): sai
    // quando o painel seguinte começa a cobri-lo, para nada ficar escrito por baixo.
    const copy = slots.map((slot) =>
      Array.from(slot.querySelectorAll<HTMLElement>(".project__row > *, .project__text > *")),
    );
    const heading = section.querySelector<HTMLElement>(".projects__heading")!;
    const videos = slots.map((slot) => slot.querySelector("video"));
    let fade = slots.map(() => 0);
    let depth = slots.map(() => 0);
    let release = 0;
    let current = 0;
    // Painel com a seção à vista (-1 fora dela) e o último cujo vídeo recebeu play.
    let active = -1;
    let playing = -1;
    let sectionTop = 0;
    let preloaded = false;

    const unregister = registerScrollController({
      element: section,
      measure(frame) {
        // O título só fica preso quando todos os painéis cabem na tela: num
        // painel mais alto, ele passaria por cima do texto. O teste usa sempre a
        // altura com a faixa do título, para não alternar entre os dois estados.
        // Altura do conteúdo (sem o mínimo de uma tela), como ficaria com a faixa.
        const pinned = "pinned" in section.dataset;
        const band = (section.querySelector("h2")?.offsetHeight ?? 0) + 4;
        const fits = slots.every((slot, i) => {
          const article = slot.firstElementChild as HTMLElement;
          const bottom = Math.max(
            ...Array.from(article.children).map((child) => child.getBoundingClientRect().bottom),
          );
          // O painel que recua está em escala: mede a altura como se estivesse inteiro.
          const content =
            (bottom - article.getBoundingClientRect().top) / (1 - DEPTH_SCALE * depth[i]) +
            parseFloat(getComputedStyle(article).paddingBottom);
          return content + (pinned ? 0 : band) <= frame.smallViewportHeight + 1;
        });
        if (fits) section.dataset.pinned = "";
        else delete section.dataset.pinned;
        // Mede as posições naturais depois de aplicar o layout definitivo.
        const listTop = list.getBoundingClientRect().top + frame.scrollY;
        const heights = slots.map((slot) => slot.offsetHeight);
        sectionTop = section.getBoundingClientRect().top + frame.scrollY;
        let offset = 0;
        naturalTops.current = heights.map((height) => {
          const top = listTop + offset;
          offset += height;
          return top;
        });
        // Painel mais alto que a tela só para quando a base dele chega embaixo,
        // depois de lido por inteiro.
        slots.forEach((slot, i) => {
          slot.style.setProperty("--stick", `${Math.min(0, frame.smallViewportHeight - heights[i])}px`);
        });
      },
      read(frame) {
        // Painel da vez: o último cuja borda de cima já passou da metade da tela.
        let index = 0;
        slots.forEach((slot, i) => {
          if (slot.getBoundingClientRect().top <= frame.viewportHeight * 0.5) index = i;
        });
        current = index;
        const listRect = list.getBoundingClientRect();
        active = listRect.top < frame.viewportHeight && listRect.bottom > frame.headerOffset ? index : -1;
        // Quando o último painel começa a sair, o título preso sai junto com ele
        // (sem isso ficaria por cima do texto até o fim da seção).
        release = Math.min(0, listRect.bottom - frame.viewportHeight);
        // Quanto o painel seguinte já subiu sobre a tela (0 a 1). O texto some no
        // primeiro terço, antes que a folha nova chegue até ele; o painel recua e
        // escurece ao longo de toda a subida.
        depth = slots.map((_, i) => {
          const next = slots[i + 1];
          if (!next) return 0;
          const covered = (frame.viewportHeight - next.getBoundingClientRect().top) / frame.viewportHeight;
          return Math.min(1, Math.max(0, covered));
        });
        fade = depth.map((covered) => Math.min(1, covered / 0.35));
      },
      write(frame) {
        heading.dataset.tone = slots[current]?.dataset.chapter ?? "dark";
        const count = countRef.current;
        const text = `${current + 1} de ${total}`;
        if (count && count.textContent !== text) count.textContent = text;
        const lift = release < 0 ? `translate3d(0, ${release.toFixed(1)}px, 0)` : "";
        if (heading.style.transform !== lift) heading.style.transform = lift;
        copy.forEach((items, i) => {
          const k = fade[i];
          const opacity = k > 0 ? (1 - k).toFixed(3) : "";
          const transform = k > 0 ? `translate3d(0, ${(-24 * k).toFixed(1)}px, 0)` : "";
          for (const item of items) {
            if (item.style.opacity !== opacity) item.style.opacity = opacity;
            if (item.style.transform !== transform) item.style.transform = transform;
          }
        });
        slots.forEach((slot, i) => {
          const k = depth[i];
          const scale = k > 0 ? `scale(${(1 - DEPTH_SCALE * k).toFixed(4)})` : "";
          const shade = k > 0 ? k.toFixed(3) : "";
          if (slot.style.transform !== scale) slot.style.transform = scale;
          if (slot.style.getPropertyValue("--depth") !== shade) {
            if (shade) slot.style.setProperty("--depth", shade);
            else slot.style.removeProperty("--depth");
          }
        });
        // Só o vídeo do painel da vez toca. O play acontece na troca de painel,
        // então uma pausa feita pelo visitante vale até ele sair do painel.
        if (active !== playing) {
          if (playing !== -1) videos[playing]?.pause();
          videos[active]?.play().catch(() => {});
          playing = active;
        }
        if (!preloaded && sectionTop - frame.scrollY < frame.viewportHeight * 2) {
          preloaded = true;
          setPreload(true);
        }
      },
    });

    return () => {
      unregister();
      delete section.dataset.pinned;
      heading.style.removeProperty("transform");
      delete heading.dataset.tone;
      for (const slot of slots) {
        slot.style.removeProperty("--stick");
        slot.style.removeProperty("--depth");
        slot.style.removeProperty("transform");
      }
      for (const video of videos) video?.pause();
      for (const item of copy.flat()) {
        item.style.removeProperty("opacity");
        item.style.removeProperty("transform");
      }
    };
  }, [reducedMotion, total]);

  // Ao focar um link pelo teclado, alinha o painel à posição natural para manter
  // o texto inteiro visível, sem mover o foco.
  function revealFocused(event: FocusEvent<HTMLOListElement>) {
    if (reducedMotion) return;
    const target = event.target as HTMLElement;
    // Clique e toque também focam o link, mas no meio do gesto: rolar aqui tira
    // o link de baixo do ponteiro e o clique cai no texto do painel.
    if (!target.matches(":focus-visible")) return;
    const slot = target.closest<HTMLElement>("[data-panel-index]");
    if (!slot) return;
    const i = Number(slot.dataset.panelIndex);
    // O navegador pode iniciar a rolagem de foco antes deste evento. Alinha
    // sempre à posição natural e cancela essa animação antes de revelar o texto.
    const top = naturalTops.current[i];
    if (top === undefined) return;
    window.scrollTo({ top: top - getHeaderOffset(), behavior: "instant" });
    flushScroll();
  }

  return (
    <section
      ref={sectionRef}
      id="projetos"
      aria-labelledby="projetos-titulo"
      className="projects chapter chapter-dark"
      data-chapter="dark"
    >
      <div className="projects__heading">
        <div className="projects__heading-inner">
          <h2 id="projetos-titulo" className="t-title" data-reveal>
            Projetos
          </h2>
          <span ref={countRef} className="projects__count t-lead tabular-nums" aria-hidden="true">
            1 de {total}
          </span>
        </div>
      </div>

      <ol ref={listRef} className="projects__list" onFocus={revealFocused}>
        {projects.map((project, i) => (
          <ProjectPanel
            key={project.id}
            project={project}
            index={i}
            total={total}
            tone={i % 2 === 0 ? "dark" : "raised"}
            loading={preload || i === 0 ? "eager" : "lazy"}
          />
        ))}
      </ol>
    </section>
  );
}
