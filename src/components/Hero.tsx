"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/lib/data";
import { useMediaQuery, useReducedMotion } from "@/lib/scroll-orchestrator";
import { Laptop } from "@/components/hero/Laptop";
import { BackCards, FrontCards } from "@/components/hero/StockCards";
import { useHeroScene } from "@/components/hero/useHeroScene";

// O SimpleStock é a prova ao lado do nome: o notebook já abre no dashboard, e os
// cards dele ficam em volta, em profundidade. A demonstração em vídeo fica nos
// Projetos.
export function Hero() {
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);

  useHeroScene(sectionRef, sceneRef, laptopRef, { enabled: !reducedMotion, finePointer });

  return (
    <section ref={sectionRef} id="inicio" data-chapter="dark" className="hero chapter chapter-dark">
      <div className="frame hero__stage">
        <div className="hero__copy">
          <h1 className="hero__headline t-display">Leonardo<br />Martins</h1>
          <div className="hero__aside">
            <p className="t-lead">Desenvolvedor full stack em {profile.location}, vindo do suporte de TI e da infraestrutura.</p>
            <a href="#projetos" className="button focus-ring">Ver projetos</a>
          </div>
        </div>
        <figure className="hero__demo">
          <div ref={sceneRef} className="hero__scene">
            <BackCards />
            <Laptop ref={laptopRef}>
              <div className="hero__picture">
                <Image
                  src="/projects/simplestock-v2-dashboard.png"
                  alt="Dashboard do SimpleStock com indicadores, evolução do estoque em 30 dias, status e produtos para repor"
                  fill
                  priority
                  sizes="(min-width: 1024px) 36vw, (min-width: 640px) 460px, 80vw"
                />
              </div>
            </Laptop>
            <FrontCards />
          </div>
          <figcaption className="hero__caption t-small">
            SimpleStock, sistema de estoque com React, Express e PostgreSQL.{" "}
            <Link href="/projetos/simplestock" className="link focus-ring">Ver o projeto</Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
