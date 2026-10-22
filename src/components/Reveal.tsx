"use client";

import { useEffect } from "react";

// Entradas de seção: cada [data-reveal] sobe e aparece uma vez, quando entra na
// tela, em ordem de leitura (atraso por --i no CSS). O que já está à vista na
// instalação fica como está, sem piscar; sem JS nada chega a ser escondido.
export function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const height = window.innerHeight;
    for (const item of items) {
      const rect = item.getBoundingClientRect();
      if (rect.top < height && rect.bottom > 0) item.dataset.in = "";
    }
    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = "";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    for (const item of items) if (!("in" in item.dataset)) observer.observe(item);

    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);

  return null;
}
