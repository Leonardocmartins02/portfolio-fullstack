import { useEffect, type RefObject } from "react";
import { registerScrollController } from "@/lib/scroll-orchestrator";

// Movimento da cena do hero, sempre em transform escrito em cada elemento:
// - rolagem: no trecho em que o hero fica preso, os cards se recolhem para a tela
//   do notebook (os módulos entrando no sistema);
// - ponteiro fino: o notebook inclina até 2°/3° e os cards se deslocam conforme a
//   profundidade (o que está à frente anda com o ponteiro, o de trás ao contrário).
// Com movimento reduzido nada disso roda e a cena fica no estado inicial.

const TILT_X = 2;
const TILT_Y = 3;
// Deslocamento por px de profundidade, por unidade de ponteiro (-1 a 1).
const SHIFT_X = 0.07;
const SHIFT_Y = 0.05;
// Fração do caminho que o ponteiro suavizado anda por quadro.
const EASE = 0.12;

type Vector = { x: number; y: number; active: boolean };

export function useHeroScene(
  sectionRef: RefObject<HTMLElement>,
  sceneRef: RefObject<HTMLElement>,
  laptopRef: RefObject<HTMLElement>,
  { enabled, finePointer }: { enabled: boolean; finePointer: boolean },
) {
  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const laptop = laptopRef.current;
    if (!enabled || !section || !scene || !laptop) return;

    const cards = Array.from(scene.querySelectorAll<HTMLElement>(".stock-card"));
    const depths = cards.map((card) => Number(card.dataset.depth) || 0);
    const toward: Vector[] = cards.map(() => ({ x: 0, y: 0, active: false }));
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let start = 0;
    let span = 1;
    let progress = 0;
    let pointerFrame = 0;

    function paint() {
      laptop!.style.transform = `rotateX(${-pointer.y * TILT_X}deg) rotateY(${pointer.x * TILT_Y}deg)`;
      cards.forEach((card, i) => {
        const vector = toward[i];
        if (!vector.active) return;
        const depth = depths[i];
        const x = vector.x * progress * 0.7 + depth * pointer.x * SHIFT_X;
        const y = vector.y * progress * 0.7 + depth * pointer.y * SHIFT_Y;
        card.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
        card.style.scale = (1 - 0.35 * progress).toFixed(3);
        card.style.opacity = Math.min(1, Math.max(0, 1 - (progress - 0.35) / 0.65)).toFixed(3);
      });
    }

    const unregister = registerScrollController({
      element: section,
      measure(frame) {
        start = section.getBoundingClientRect().top + frame.scrollY;
        const shortScreen = frame.viewportHeight <= 740 && window.innerWidth < 1024;
        span = Math.min(360, frame.viewportHeight * (shortScreen ? 0.25 : 0.4));
        // Caixas de layout (sem transform) relativas ao palco: o alvo é o centro da tela.
        const targetX = laptop.offsetLeft + laptop.offsetWidth / 2;
        const targetY = laptop.offsetTop + laptop.offsetHeight / 2;
        cards.forEach((card, i) => {
          // No celular os cards saem do palco e ficam em fila: não se movem.
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
        progress = -1;
      },
      write(frame) {
        const next = Math.min(1, Math.max(0, (frame.scrollY - start) / span));
        if (next === progress) return;
        progress = next;
        paint();
      },
    });

    function followPointer() {
      pointer.x += (pointer.targetX - pointer.x) * EASE;
      pointer.y += (pointer.targetY - pointer.y) * EASE;
      const settled =
        Math.abs(pointer.targetX - pointer.x) < 0.002 && Math.abs(pointer.targetY - pointer.y) < 0.002;
      if (settled) {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
      }
      paint();
      pointerFrame = settled ? 0 : requestAnimationFrame(followPointer);
    }

    function aim(x: number, y: number) {
      pointer.targetX = x;
      pointer.targetY = y;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(followPointer);
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      aim((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
    };
    const onLeave = () => aim(0, 0);
    if (finePointer) {
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
    }

    return () => {
      unregister();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      laptop.style.removeProperty("transform");
      for (const card of cards) {
        card.style.removeProperty("translate");
        card.style.removeProperty("scale");
        card.style.removeProperty("opacity");
      }
    };
  }, [enabled, finePointer, sectionRef, sceneRef, laptopRef]);
}
