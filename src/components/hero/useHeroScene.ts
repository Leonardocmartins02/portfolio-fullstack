import { useEffect, type MutableRefObject, type RefObject } from "react";
import { registerScrollController } from "@/lib/scroll-orchestrator";
import type { HeroMotion } from "@/components/hero/LaptopScene";

// Coreografia do hero: o notebook em WebGL e os cards do dashboard numa linha
// do tempo só (conceitos da skill gsap-scrolltrigger: seção presa, uma timeline
// com fases e scrub com atraso, feitos aqui no orquestrador de rolagem).
//
// - Entrada (tempo, uma vez): a tampa abre, a tela acende e os cards saem da
//   tela, um de cada vez, para os seus lugares (o relógio vem da cena WebGL em
//   motionRef.entry, então nada sai antes de o notebook estar lá).
// - Parado: cada card flutua devagar, fora de fase, e anda com o ponteiro
//   conforme a profundidade (o que está à frente anda mais).
// - Rolagem (scrub): os cards voltam para dentro da tela, a tela apaga e a
//   tampa fecha (a cena lê motionRef.progress). Rolando de volta, tudo inverte.
//
// Sem WebGL (data-webgl="off"), os cards chegam pela animação CSS e a rolagem
// só os recolhe para o notebook CSS, como antes. Com movimento reduzido nada
// disso roda e a cena fica no estado inicial. No celular os cards saem do
// palco e ficam em fila: não se movem.

const TILT_X = 2;
const TILT_Y = 3;
// Deslocamento por px de profundidade, por unidade de ponteiro (-1 a 1).
const SHIFT_X = 0.07;
const SHIFT_Y = 0.05;
// Fração do caminho que o ponteiro suavizado anda por quadro.
const EASE = 0.12;
// Scrub: o progresso alcança a rolagem com ~0,4 s de atraso.
const SCRUB = 9;

// Entrada dos cards, em segundos do relógio da cena (a tela acende em 1,25–1,85).
const CARD_START = 1.45;
const CARD_STAGGER = 0.09;
const CARD_DURATION = 0.8;
// Sem sinal da cena em 6 s (three.js não carregou), os cards aparecem assim mesmo.
const ENTRY_TIMEOUT = 6000;

// Rolagem: cada card entra na tela numa janela própria, em cascata, até 55%.
const IN_STAGGER = 0.07;
const IN_DURATION = 0.34;
// Flutuação: amplitude (px) e velocidade (rad/s), a mesma do notebook.
const FLOAT_Y = 5;
const FLOAT_SPEED = 0.9;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
// Saída forte para o que entra (skill animate: nunca ease-in na entrada).
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
// Ida e volta na tela, ligada à rolagem.
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

type Vector = { x: number; y: number; active: boolean };

export function useHeroScene(
  sectionRef: RefObject<HTMLElement>,
  sceneRef: RefObject<HTMLElement>,
  laptopRef: RefObject<HTMLElement>,
  motionRef: MutableRefObject<HeroMotion>,
  { enabled, finePointer }: { enabled: boolean; finePointer: boolean },
) {
  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const laptop = laptopRef.current;
    const motion = motionRef.current;
    if (!enabled || !section || !scene || !laptop) return;

    const cards = Array.from(scene.querySelectorAll<HTMLElement>(".stock-card"));
    const depths = cards.map((card) => Number(card.dataset.depth) || 0);
    const toward: Vector[] = cards.map(() => ({ x: 0, y: 0, active: false }));
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const mountedAt = performance.now();
    let start = 0;
    let span = 1;
    let target = 0; // progresso da rolagem (cru)
    let progress = 0; // progresso suavizado (scrub)
    let visible = true;
    let frame = 0;
    let last = 0;

    // Quanto do card está "fora da tela" na entrada (0 dentro, 1 no lugar).
    function entryOut(i: number, now: number) {
      if (scene!.dataset.webgl === "off") return 1;
      let clock = motion.entry;
      if (clock === null) {
        if (now - mountedAt < ENTRY_TIMEOUT) return 0;
        clock = Infinity;
      }
      return easeOutQuart(clamp01((clock - CARD_START - i * CARD_STAGGER) / CARD_DURATION));
    }

    function paint(now: number) {
      motion.x = pointer.x;
      motion.y = pointer.y;
      motion.progress = progress;
      // O notebook CSS só aparece sem WebGL; com a cena, ele nem é pintado.
      if (scene!.dataset.webgl === "off")
        laptop!.style.transform = `rotateX(${-pointer.y * TILT_X}deg) rotateY(${pointer.x * TILT_Y}deg)`;

      const seconds = now / 1000;
      cards.forEach((card, i) => {
        const vector = toward[i];
        if (!vector.active) return;
        const into = easeInOutCubic(clamp01((progress - i * IN_STAGGER) / IN_DURATION));
        const out = entryOut(i, now) * (1 - into);
        const depth = depths[i];
        const float = Math.sin(seconds * FLOAT_SPEED + i * 1.9) * FLOAT_Y;
        // out = 0: no centro da tela, pequeno e transparente; out = 1: no lugar.
        const x = vector.x * (1 - out) + depth * pointer.x * SHIFT_X * out;
        const y = vector.y * (1 - out) + (depth * pointer.y * SHIFT_Y + float) * out;
        card.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
        card.style.scale = (0.3 + 0.7 * out).toFixed(3);
        card.style.opacity = clamp01((out - 0.05) / 0.45).toFixed(3);
      });
    }

    // Um laço só enquanto o hero está na tela: ponteiro, scrub e flutuação.
    function tick(now: number) {
      const delta = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
      last = now;
      pointer.x += (pointer.targetX - pointer.x) * EASE;
      pointer.y += (pointer.targetY - pointer.y) * EASE;
      progress += (target - progress) * (1 - Math.exp(-SCRUB * delta));
      if (Math.abs(target - progress) < 0.0005) progress = target;
      paint(now);
      frame = visible ? requestAnimationFrame(tick) : 0;
    }

    function wake() {
      if (!frame && visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    }

    const unregister = registerScrollController({
      element: section,
      measure(frameInfo) {
        start = section.getBoundingClientRect().top + frameInfo.scrollY;
        const shortScreen = frameInfo.viewportHeight <= 740 && window.innerWidth < 1024;
        const wide = window.innerWidth >= 640;
        // Do tablet para cima a seção fica presa por mais tempo (CSS: .hero::after),
        // para caber a história inteira: cards entrando e tampa fechando.
        const share = shortScreen ? 0.25 : wide ? 0.75 : 0.4;
        span = Math.min(wide ? 760 : 360, frameInfo.viewportHeight * share);
        // Caixas de layout (sem transform) relativas ao palco: o alvo é o centro da tela.
        const targetX = laptop.offsetLeft + laptop.offsetWidth / 2;
        const targetY = laptop.offsetTop + laptop.offsetHeight * 0.42;
        cards.forEach((card, i) => {
          const active = card.offsetParent === scene && getComputedStyle(card).position === "absolute";
          toward[i] = {
            active,
            x: targetX - (card.offsetLeft + card.offsetWidth / 2),
            y: targetY - (card.offsetTop + card.offsetHeight / 2),
          };
          if (!active) {
            card.style.removeProperty("translate");
            card.style.removeProperty("scale");
            card.style.removeProperty("opacity");
          }
        });
        wake();
      },
      write(frameInfo) {
        target = clamp01((frameInfo.scrollY - start) / span);
        wake();
      },
    });

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    observer.observe(section);

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    const onLeave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };
    if (finePointer) {
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
    }

    wake();

    return () => {
      unregister();
      observer.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      laptop.style.removeProperty("transform");
      Object.assign(motion, { x: 0, y: 0, progress: 0 });
      for (const card of cards) {
        card.style.removeProperty("translate");
        card.style.removeProperty("scale");
        card.style.removeProperty("opacity");
      }
    };
  }, [enabled, finePointer, sectionRef, sceneRef, laptopRef, motionRef]);
}
