"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";

// Notebook em WebGL para o hero no celular (skills threejs-react-three-fiber,
// threejs-performance e webgl-3d-object): geometria de verdade, alumínio PBR
// com reflexo de um estúdio montado na hora (sem baixar HDR), luz principal,
// preenchimento e recorte verde da marca. A tela é o dashboard do SimpleStock
// como um display que emite luz (sem tone mapping).
//
// Movimento, só em transform: a tampa abre na dobradiça e a tela acende; depois
// o notebook flutua e balança devagar. O dedo arrastado de lado gira o
// notebook, que volta com inércia (dragRef vem do MobileLaptop).

// Medidas em unidades de cena (1 ≈ 10 cm de um notebook de 14").
const BASE = { w: 3.2, h: 0.11, d: 2.2 };
const LID = { w: 3.2, h: 2.08, t: 0.065 };
const SCREEN_W = 2.94;
const SCREEN_H = SCREEN_W / 1.6; // o print é 16:10

const LID_CLOSED = Math.PI / 2 - 0.035; // apoiada no teclado
const LID_OPEN = -0.3; // ~17° além da vertical

// Textura da tela pelo otimizador do Next: WebP de 1200px em vez do PNG de 2880.
const SCREEN_SRC = `/_next/image?url=${encodeURIComponent("/projects/simplestock-v2-dashboard.png")}&w=1200&q=80`;

const ALUMINUM = { color: "#9aa3ae", metalness: 0.82, roughness: 0.3 } as const;

export type DragState = { target: number; current: number; active: boolean };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
// Passa um pouco do ponto e assenta, como uma dobradiça com mola.
const easeOutBack = (x: number) => {
  const s = 1.15;
  const t = x - 1;
  return 1 + (s + 1) * t * t * t + s * t * t;
};

function Keyboard() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const cols = 14;
  const rows = 5;
  const pitch = 0.19;
  const size = 0.158;
  // Quatro fileiras cheias e a de baixo com a barra de espaço (6 teclas de largura).
  const keys = useMemo(() => {
    const list: { x: number; z: number; w: number }[] = [];
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols; c++) list.push({ x: (c - (cols - 1) / 2) * pitch, z: (r - (rows - 1) / 2) * pitch, w: 1 });
    }
    const z = ((rows - 1) / 2) * pitch;
    for (let c = 0; c < cols; c++) {
      if (c >= 4 && c < 10) continue;
      list.push({ x: (c - (cols - 1) / 2) * pitch, z, w: 1 });
    }
    list.push({ x: (6.5 - (cols - 1) / 2) * pitch, z, w: (6 * pitch - (pitch - size)) / size });
    return list;
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const placement = new THREE.Object3D();
    keys.forEach((key, i) => {
      placement.position.set(key.x, 0, key.z);
      placement.scale.set(key.w, 1, 1);
      placement.updateMatrix();
      mesh.setMatrixAt(i, placement.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [keys]);

  // Uma chamada de desenho para todas as teclas (InstancedMesh).
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, keys.length]} position={[0, BASE.h + 0.006, -0.36]}>
      <boxGeometry args={[size, 0.014, size]} />
      <meshStandardMaterial color="#1c2026" roughness={0.55} metalness={0.2} />
    </instancedMesh>
  );
}

// Sombra de contato falsa: um gradiente radial num plano, sem shadow map.
function FloorShadow() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,0.75)");
    gradient.addColorStop(0.55, "rgba(0,0,0,0.3)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0.1]}>
      <planeGeometry args={[4.6, 3.3]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Laptop({
  dragRef,
  still,
  onReady,
}: {
  dragRef: MutableRefObject<DragState>;
  still: boolean;
  onReady: () => void;
}) {
  const root = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const screenMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const screen = useTexture(SCREEN_SRC);
  const { gl, scene, camera, invalidate } = useThree();
  // Relógio próprio da entrada: só anda depois que os shaders compilaram e o
  // canvas apareceu, e com passo máximo de 1/30 s. Um quadro travado (compilar
  // shader no celular) pausa a abertura em vez de pular para o fim.
  const compiled = useRef(false);
  const frames = useRef(0);
  const elapsed = useRef(0);

  useLayoutEffect(() => {
    screen.colorSpace = THREE.SRGBColorSpace;
    screen.anisotropy = Math.min(4, gl.capabilities.getMaxAnisotropy());
    screen.needsUpdate = true;
  }, [screen, gl]);

  // Compila os programas antes da primeira imagem (skill threejs-performance:
  // "Shader Compile Stalls"), para a abertura não engasgar.
  useEffect(() => {
    let cancelled = false;
    gl.compileAsync(scene, camera)
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        compiled.current = true;
        invalidate(); // com frameloop "demand" (movimento reduzido), pede o 1º quadro
      });
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, invalidate]);

  useFrame((state, delta) => {
    const group = root.current;
    const lid = hinge.current;
    const material = screenMaterial.current;
    if (!group || !lid || !material) return;
    const now = state.clock.elapsedTime;
    if (!compiled.current) return; // tampa fechada e tela apagada, como no JSX
    frames.current += 1;
    // Dois quadros desenhados: o canvas pode aparecer (fade no CSS).
    if (frames.current === 2) onReady();
    else if (frames.current < 2) state.invalidate();
    if (frames.current > 2) elapsed.current += Math.min(delta, 1 / 30);
    const t = still ? 10 : elapsed.current;

    // Entrada: sobe e cresce (0–0,9s), a tampa abre (0,4–1,9s), a tela acende (1,25–1,85s).
    const rise = easeOutCubic(clamp01(t / 0.9));
    const open = easeOutBack(clamp01((t - 0.4) / 1.5));
    const glow = easeOutCubic(clamp01((t - 1.25) / 0.6));
    lid.rotation.x = THREE.MathUtils.lerp(LID_CLOSED, LID_OPEN, open);
    material.color.setScalar(glow);

    // Inércia do arrasto: segue o dedo e volta ao centro quando ele sai.
    const drag = dragRef.current;
    if (!drag.active) drag.target = 0;
    drag.current = THREE.MathUtils.damp(drag.current, drag.target, drag.active ? 14 : 4, delta);

    const idle = still ? 0 : Math.sin(now * 0.45) * 0.14;
    const float = still ? 0 : Math.sin(now * 0.9) * 0.045;
    group.rotation.y = -0.28 + idle + drag.current;
    group.rotation.x = -0.04 + (drag.target - drag.current) * 0.08;
    group.position.y = -0.35 * (1 - rise) + float;
    group.scale.setScalar(0.9 + 0.1 * rise);
  });

  return (
    <group ref={root}>
      {/* Base */}
      <RoundedBox args={[BASE.w, BASE.h, BASE.d]} radius={0.05} smoothness={4} position={[0, BASE.h / 2, 0]}>
        <meshStandardMaterial {...ALUMINUM} envMapIntensity={1.1} />
      </RoundedBox>
      <Keyboard />
      {/* Trackpad: o mesmo alumínio, mais liso */}
      <RoundedBox args={[1.15, 0.006, 0.72]} radius={0.003} smoothness={2} position={[0, BASE.h + 0.002, 0.62]}>
        <meshStandardMaterial color="#8d96a2" metalness={0.8} roughness={0.18} />
      </RoundedBox>

      {/* Tampa: gira na dobradiça, na borda de trás da base */}
      <group ref={hinge} position={[0, BASE.h, -BASE.d / 2 + 0.03]} rotation-x={LID_CLOSED}>
        <RoundedBox args={[LID.w, LID.h, LID.t]} radius={0.05} smoothness={4} position={[0, LID.h / 2, -LID.t / 2]}>
          <meshStandardMaterial {...ALUMINUM} envMapIntensity={1.1} />
        </RoundedBox>
        {/* Moldura de vidro preto */}
        <mesh position={[0, LID.h / 2, 0.001]}>
          <planeGeometry args={[LID.w - 0.06, LID.h - 0.06]} />
          <meshStandardMaterial color="#07090c" metalness={0} roughness={0.12} envMapIntensity={0.6} />
        </mesh>
        {/* Tela: emite a própria luz, sem tone mapping, para o dashboard sair fiel */}
        <mesh position={[0, LID.h / 2 + 0.04, 0.002]}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          <meshBasicMaterial ref={screenMaterial} map={screen} color="black" toneMapped={false} />
        </mesh>
        {/* Câmera */}
        <mesh position={[0, LID.h - 0.05, 0.003]}>
          <circleGeometry args={[0.012, 16]} />
          <meshBasicMaterial color="#1d232b" />
        </mesh>
      </group>
    </group>
  );
}

export default function LaptopScene({
  dragRef,
  still,
  frameloop,
  onReady,
}: {
  dragRef: MutableRefObject<DragState>;
  /** Movimento reduzido: notebook aberto e parado (o arrasto continua). */
  still: boolean;
  /** "never" fora da tela; "demand" parado (movimento reduzido sem toque). */
  frameloop: "always" | "demand" | "never";
  onReady: () => void;
}) {
  return (
    <Canvas
      // Resolução limitada: no celular, 3× de densidade custaria 9× os pixels.
      dpr={[1, 1.75]}
      frameloop={frameloop}
      camera={{ position: [0, 2.0, 5.5], fov: 28, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ camera }) => camera.lookAt(0, 0.72, 0)}
      aria-hidden="true"
    >
      <ambientLight intensity={0.35} />
      {/* Principal: alta, na frente e à direita */}
      <directionalLight position={[3, 5, 4]} intensity={2.1} />
      {/* Preenchimento frio, baixo, do lado do texto */}
      <directionalLight position={[-4, 1.5, 3]} intensity={0.45} color="#c8e6ff" />
      {/* Recorte verde MongoDB por trás: desenha as bordas no fundo teal */}
      <directionalLight position={[-3, 2.5, -4]} intensity={1.2} color="#00ed64" />

      <Suspense fallback={null}>
        {/* Estúdio para os reflexos do alumínio, assado uma vez */}
        <Environment resolution={64} frames={1}>
          <Lightformer form="rect" intensity={2.2} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={1.1} position={[5, 1.5, 1]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
          <Lightformer form="rect" intensity={0.7} color="#00ed64" position={[-5, 1, -2]} rotation-y={Math.PI / 2} scale={[3, 1.2, 1]} />
        </Environment>
        <Laptop dragRef={dragRef} still={still} onReady={onReady} />
        <FloorShadow />
      </Suspense>
    </Canvas>
  );
}
