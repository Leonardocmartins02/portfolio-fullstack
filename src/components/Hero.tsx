"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { profile } from "@/lib/data";
import { useMediaQuery, useReducedMotion } from "@/lib/scroll-orchestrator";
import { Laptop } from "@/components/hero/Laptop";
import { BackCards, FrontCards } from "@/components/hero/StockCards";
import { useHeroScene } from "@/components/hero/useHeroScene";
import { MobileLaptop } from "@/components/hero/MobileLaptop";
import { Button } from "@/components/ui/button";

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
            <p className="t-lead text-muted-foreground">Desenvolvedor full stack em {profile.location}, vindo do suporte de TI e da infraestrutura.</p>
            <Button asChild size="lg">
              <a href="#projetos">
                Ver projetos
                <ArrowDown
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out group-hover/button:translate-y-0.5"
                />
              </a>
            </Button>
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
            {/* Celular: o mesmo notebook em WebGL, com luz e volume de verdade. */}
            <MobileLaptop />
          </div>
          <figcaption className="hero__caption t-small text-muted-foreground">
            SimpleStock, sistema de estoque com React, Express e PostgreSQL.{" "}
            <Link href="/projetos/simplestock" className="link focus-ring rounded-sm text-foreground">Ver o projeto</Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
