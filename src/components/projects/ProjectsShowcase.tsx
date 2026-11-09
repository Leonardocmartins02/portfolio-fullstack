"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type FocusEvent } from "react";
import { ProjectPanel, type ProjectPanelData } from "@/components/projects/ProjectPanel";
import {
  flushScroll,
  getHeaderOffset,
  registerScrollController,
  useMediaQuery,
  useReducedMotion,
} from "@/lib/scroll-orchestrator";

// Desktop (1024px ou mais), assinatura da página (taste-skill, "pinned story"): o
// título "Projetos" fica preso no topo enquanto cada projeto, um painel de tela
// cheia, sobe por cima do anterior. Sem JS ou com movimento reduzido, os painéis
// só seguem um abaixo do outro.
//
// Celular e tablet: um carrossel de cards com scroll-snap horizontal, todo no CSS.
// Aqui só se atualiza o contador e o vídeo do card da vez. A pilha não serve
// nessa largura: painéis da altura da tela subindo um sobre o outro nunca
// enquadram direito no celular.
//
// Antes de cada painel há um marco de altura zero (li.projects__mark) na posição
// natural da borda de cima dele. O marco não é sticky, então é uma régua estável
// da subida do painel (0 quando o marco está na base da tela, 1 quando chega ao
// topo), que faz o painel anterior recuar, escurecer e apagar o texto. Onde o
// navegador tem animações por rolagem (animation-timeline), o recuo roda no CSS,
// no compositor, colado à rolagem. Nos outros, este laço escreve os mesmos
// valores a cada quadro.

// Pilha de cartas: quanto o painel coberto recua (5%) enquanto o seguinte sobe.
const DEPTH_SCALE = 0.05;
// O texto do painel coberto some no primeiro trecho da subida do seguinte.
const COPY_FADE_END = 0.35;

const markName = (i: number) => `--projeto-marco-${i}`;
// Mesmo corte do CSS (carrossel abaixo de 1024px).
const CAROUSEL_QUERY = "(max-width: 1023px)";

export function ProjectsShowcase({ projects }: { projects: ProjectPanelData[] }) {
  const total = projects.length;
  const reducedMotion = useReducedMotion();
  const carousel = useMediaQuery(CAROUSEL_QUERY);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const naturalTops = useRef<number[]>([]);
  const [preload, setPreload] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list || reducedMotion || carousel) return;
    // Com animation-timeline o CSS cuida do recuo; o laço só mede e troca estados.
    const cssDriven = CSS.supports("animation-timeline: view()");
    const slots = Array.from(list.querySelectorAll<HTMLElement>(":scope > .project-slot"));
    const marks = Array.from(list.querySelectorAll<HTMLElement>(":scope > .projects__mark"));
    const shades = slots.map((slot) => slot.querySelector<HTMLElement>(".project-slot__shade"));
    // Texto de cada painel (filhos da linha do nome e da coluna de texto): sai
    // quando o painel seguinte começa a cobri-lo, para nada ficar escrito por baixo.
    const copy = slots.map((slot) =>
      Array.from(slot.querySelectorAll<HTMLElement>(".project__row > *, .project__text > *")),
    );
    const heading = section.querySelector<HTMLElement>(".projects__heading")!;
    const videos = slots.map((slot) => slot.querySelector("video"));
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
        // Mede pelos offsets, que ignoram transform: o painel coberto pode estar
        // em escala e o texto, deslocado pela entrada da seção.
        const pinned = "pinned" in section.dataset;
        const band = (section.querySelector("h2")?.offsetHeight ?? 0) + 4;
        const fits = slots.every((slot) => {
          const article = slot.firstElementChild as HTMLElement;
          const bottom = Math.max(
            ...Array.from(article.children, (child) => {
              const el = child as HTMLElement;
              return el.offsetTop + el.offsetHeight;
            }),
          );
          const content = bottom - article.offsetTop + parseFloat(getComputedStyle(article).paddingBottom);
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
        slots.forEach((slot, i) => {
          // Painel mais alto que a tela só para quando a base dele chega embaixo,
          // depois de lido por inteiro.
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
        if (cssDriven) return;
        // Quanto o painel seguinte já subiu sobre a tela (0 a 1), pela régua do
        // marco: a mesma conta que o CSS faz com animation-range: cover.
        depth = slots.map((_, i) => {
          const next = marks[i + 1];
          if (!next) return 0;
          const covered = (frame.viewportHeight - next.getBoundingClientRect().top) / frame.viewportHeight;
          return Math.min(1, Math.max(0, covered));
        });
      },
      write(frame) {
        heading.dataset.tone = slots[current]?.dataset.chapter ?? "dark";
        const count = countRef.current;
        const text = `${current + 1} de ${total}`;
        if (count && count.textContent !== text) count.textContent = text;
        const lift = release < 0 ? `translate3d(0, ${release.toFixed(1)}px, 0)` : "";
        if (heading.style.transform !== lift) heading.style.transform = lift;
        if (!cssDriven) {
          // Só transform e opacity, escritos direto em cada elemento.
          slots.forEach((slot, i) => {
            const k = depth[i];
            const fade = Math.min(1, k / COPY_FADE_END);
            const opacity = fade > 0 ? (1 - fade).toFixed(3) : "";
            const shift = fade > 0 ? `translate3d(0, ${(-24 * fade).toFixed(1)}px, 0)` : "";
            for (const item of copy[i]) {
              if (item.style.opacity !== opacity) item.style.opacity = opacity;
              if (item.style.transform !== shift) item.style.transform = shift;
            }
            const scale = k > 0 ? `scale(${(1 - DEPTH_SCALE * k).toFixed(4)})` : "";
            if (slot.style.transform !== scale) slot.style.transform = scale;
            const shade = shades[i];
            const shadeOpacity = k > 0 ? k.toFixed(3) : "";
            if (shade && shade.style.opacity !== shadeOpacity) shade.style.opacity = shadeOpacity;
          });
        }
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
        slot.style.removeProperty("transform");
      }
      for (const shade of shades) shade?.style.removeProperty("opacity");
      for (const video of videos) video?.pause();
      for (const item of copy.flat()) {
        item.style.removeProperty("opacity");
        item.style.removeProperty("transform");
      }
    };
  }, [reducedMotion, carousel, total]);

  // Carrossel: o card da vez sai da posição da trilha (scrollLeft / passo entre
  // cards). O laço de rolagem já escuta a rolagem horizontal (fase de captura).
  useEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list || !carousel) return;
    const slots = Array.from(list.querySelectorAll<HTMLElement>(":scope > .project-slot"));
    const videos = slots.map((slot) => slot.querySelector("video"));
    let step = 1;
    let current = 0;
    let active = -1;
    let playing = -1;
    let sectionTop = 0;
    let preloaded = false;

    const unregister = registerScrollController({
      element: section,
      measure(frame) {
        step = slots.length > 1 ? slots[1].offsetLeft - slots[0].offsetLeft : 1;
        sectionTop = section.getBoundingClientRect().top + frame.scrollY;
      },
      read(frame) {
        current = Math.min(slots.length - 1, Math.max(0, Math.round(list.scrollLeft / step)));
        const rect = list.getBoundingClientRect();
        active = rect.top < frame.viewportHeight && rect.bottom > frame.headerOffset ? current : -1;
      },
      write(frame) {
        const count = countRef.current;
        const text = `${current + 1} de ${total}`;
        if (count && count.textContent !== text) count.textContent = text;
        // Com movimento reduzido nada toca sozinho; o vídeo tem controles.
        const next = reducedMotion ? -1 : active;
        if (next !== playing) {
          if (playing !== -1) videos[playing]?.pause();
          if (next !== -1) videos[next]?.play().catch(() => {});
          playing = next;
        }
        if (!preloaded && sectionTop - frame.scrollY < frame.viewportHeight * 2) {
          preloaded = true;
          setPreload(true);
        }
      },
    });

    return () => {
      unregister();
      for (const video of videos) video?.pause();
    };
  }, [carousel, reducedMotion, total]);

  // Ao focar um link pelo teclado, alinha o painel à posição natural para manter
  // o texto inteiro visível, sem mover o foco.
  function revealFocused(event: FocusEvent<HTMLOListElement>) {
    if (reducedMotion || carousel) return;
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

  // Os marcos vivem em irmãos dos painéis: o escopo da timeline sobe até a lista.
  const listStyle = {
    "--marks": projects.map((_, i) => markName(i)).join(", "),
  } as CSSProperties;

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

      <ol ref={listRef} className="projects__list" style={listStyle} onFocus={revealFocused}>
        {projects.map((project, i) => (
          <Fragment key={project.id}>
            {/* Fora da árvore de acessibilidade: não conta como item da lista. */}
            <li
              className="projects__mark"
              aria-hidden="true"
              style={{ "--mark": markName(i) } as CSSProperties}
            />
            <ProjectPanel
              project={project}
              index={i}
              total={total}
              tone={i % 2 === 0 ? "dark" : "raised"}
              loading={preload || i === 0 ? "eager" : "lazy"}
              cover={i < total - 1 ? markName(i + 1) : undefined}
            />
          </Fragment>
        ))}
      </ol>
    </section>
  );
}
