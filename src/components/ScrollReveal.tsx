"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function ScrollReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // Comeca sem nenhuma classe (conteudo visivel por padrao), assim uma pagina
  // sem JS ou antes da hidratacao nunca mostra a secao escondida.
  const [state, setState] = useState<"idle" | "hidden" | "visible">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight;
    if (alreadyInView) return;

    setState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={state === "hidden" ? "reveal" : state === "visible" ? "reveal is-visible" : ""}
    >
      {children}
    </div>
  );
}
