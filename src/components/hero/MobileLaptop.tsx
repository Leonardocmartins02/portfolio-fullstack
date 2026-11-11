"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery, useReducedMotion } from "@/lib/scroll-orchestrator";
import type { DragState } from "@/components/hero/LaptopScene";

// O three.js (~200 kB) só é baixado quando este componente decide montar a
// cena: celular (abaixo de 640px) com WebGL. No desktop e no tablet nada muda
// e nada novo é baixado.
const LaptopScene = dynamic(() => import("@/components/hero/LaptopScene"), { ssr: false });

const MOBILE = "(max-width: 639px)";
// Quanto o notebook gira por pixel arrastado, e o limite (rad).
const DRAG_SPEED = 0.008;
const DRAG_LIMIT = 1.1;

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Estado na própria cena (.hero__scene[data-webgl]), lido pelo CSS:
// sem atributo (carregando) e "ready" escondem o notebook CSS no celular;
// "off" (sem WebGL, ou erro) devolve o notebook CSS.
export function MobileLaptop() {
  const mobile = useMediaQuery(MOBILE);
  const still = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({ target: 0, current: 0, active: false });
  const pointer = useRef<{ id: number; x: number } | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(true);
  // Movimento reduzido: só renderiza enquanto o dedo arrasta e a volta assenta.
  const [interacting, setInteracting] = useState(false);
  const settleTimer = useRef<number>(0);

  const setSceneState = useCallback((state: "ready" | "off" | null) => {
    const scene = wrapRef.current?.parentElement;
    if (!scene) return;
    if (state) scene.dataset.webgl = state;
    else delete scene.dataset.webgl;
  }, []);

  useEffect(() => {
    if (!mobile) return;
    const ok = hasWebGL();
    setSupported(ok);
    if (!ok) setSceneState("off");
  }, [mobile, setSceneState]);

  // Fora da tela, o laço de render para.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !mobile) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "120px 0px",
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [mobile]);

  useEffect(() => () => setSceneState(null), [setSceneState]);

  const onReady = useCallback(() => setSceneState("ready"), [setSceneState]);

  // Arrasto de lado gira o notebook; o vertical continua rolando a página
  // (touch-action: pan-y no CSS, e o navegador cancela o ponteiro ao rolar).
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    pointer.current = { id: event.pointerId, x: event.clientX };
    dragRef.current.active = true;
    window.clearTimeout(settleTimer.current);
    setInteracting(true);
  }
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = pointer.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    dragRef.current.target = Math.max(-DRAG_LIMIT, Math.min(DRAG_LIMIT, dx * DRAG_SPEED));
  }
  function release(event: PointerEvent<HTMLDivElement>) {
    if (pointer.current?.id !== event.pointerId) return;
    pointer.current = null;
    dragRef.current.active = false;
    settleTimer.current = window.setTimeout(() => setInteracting(false), 1500);
  }

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  if (!mobile || supported === false) return null;

  return (
    <div
      ref={wrapRef}
      className="hero__webgl"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      {supported ? (
        <LaptopScene
          dragRef={dragRef}
          still={still}
          frameloop={!visible ? "never" : still && !interacting ? "demand" : "always"}
          onReady={onReady}
        />
      ) : null}
    </div>
  );
}
