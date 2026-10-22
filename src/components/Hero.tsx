"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";
import { registerScrollController, useReducedMotion } from "@/lib/scroll-orchestrator";

// A demonstração mantém a proporção original: toda a interface fica visível.
export function Hero() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [opened, setOpened] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [choice, setChoice] = useState<"play" | "pause" | null>(null);
  const [playing, setPlaying] = useState(false);
  const screenReady = reducedMotion || opened || manualOpen;
  const shouldPlay = screenReady && (choice === "play" || (choice === null && !reducedMotion));

  useEffect(() => {
    const section = sectionRef.current;
    const laptop = laptopRef.current;
    if (!section || !laptop || reducedMotion) return;
    let start = 0;
    let span = 1;
    let wasOpen = false;
    let lastProgress = -1;
    const unregister = registerScrollController({
      element: section,
      measure(frame) {
        start = section.getBoundingClientRect().top + frame.scrollY;
        const shortScreen = frame.viewportHeight <= 740 && window.innerWidth < 1024;
        span = Math.min(360, frame.viewportHeight * (shortScreen ? 0.25 : 0.4));
      },
      write(frame) {
        const p = manualOpen ? 1 : Math.min(1, Math.max(0, (frame.scrollY - start) / span));
        if (p === lastProgress) return;
        lastProgress = p;
        laptop.style.setProperty("--lid-angle", `${88 - 88 * p}deg`);
        laptop.style.setProperty("--cover-opacity", `${1 - Math.min(1, p * 3)}`);
        laptop.style.setProperty("--screen-opacity", `${Math.min(1, Math.max(0, (p - 0.25) / 0.5))}`);
        const ready = p >= 0.9;
        if (ready !== wasOpen) { wasOpen = ready; setOpened(ready); }
      },
    });
    return () => {
      unregister();
      laptop.style.removeProperty("--lid-angle");
      laptop.style.removeProperty("--screen-opacity");
      laptop.style.removeProperty("--cover-opacity");
    };
  }, [manualOpen, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!shouldPlay) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => setPlaying(false));
      else video.pause();
    }, { threshold: 0.15 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldPlay]);

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
          <div ref={laptopRef} className="laptop" data-manual={manualOpen ? "" : undefined}>
            <div className="laptop__lid">
              <span className="laptop__mark" aria-hidden="true">LM</span>
          <div className="hero__picture">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              controls
              onFocus={() => setManualOpen(true)}
              preload="metadata"
              width={1440}
              height={1080}
              poster="/projects/simplestock-v2-poster.png"
              aria-label="Demonstração do SimpleStock: dashboard, produtos e registro de uma movimentação de estoque"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src="/projects/simplestock-v2-demo.webm" type="video/webm" />
            </video>
          </div>
            </div>
            <div className="laptop__base" aria-hidden="true" />
          </div>
          <figcaption className="hero__caption">
            <p className="t-small">{screenReady ? "SimpleStock em uso — do dashboard à movimentação de estoque." : "Role para abrir o notebook e explorar o SimpleStock."}</p>
            <div className="hero__controls">
            {!reducedMotion && !manualOpen && (
              <button type="button" onClick={() => setManualOpen(true)} className="button focus-ring">
                Abrir notebook
              </button>
            )}
            <button type="button" onClick={() => {
                setManualOpen(true);
                setChoice(playing ? "pause" : "play");
                if (playing) videoRef.current?.pause();
                else videoRef.current?.play().catch(() => setPlaying(false));
              }} className="hero__pause button button--quiet focus-ring">
              {playing ? "Pausar vídeo" : "Reproduzir vídeo"}
            </button>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
