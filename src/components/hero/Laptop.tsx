import { forwardRef, type ReactNode } from "react";

// Notebook aberto em CSS 3D. A perspectiva fica no .laptop-view, que cobre o
// palco só para o notebook: os cards ficam fora do 3D, onde o texto sai nítido.
// O .laptop recebe a inclinação do ponteiro (useHeroScene); o .laptop__body
// guarda o ângulo de câmera, que muda por largura no CSS. Tampa, base, frente e
// lateral são planos num só contexto preserve-3d, e a "luz" é o tom de cada face.

// Teclado: quatro fileiras de 14 teclas e a fileira de baixo com a barra de espaço.
const KEY_ROWS = 4;
const KEYS_PER_ROW = 14;

export const Laptop = forwardRef<HTMLDivElement, { children: ReactNode }>(function Laptop({ children }, ref) {
  return (
    <div className="laptop-view">
      <div ref={ref} className="laptop">
        <div className="laptop__body">
          <div className="laptop__lid">
            <div className="laptop__bezel">{children}</div>
            <span className="laptop__lid-side" aria-hidden="true" />
          </div>
          <div className="laptop__deck" aria-hidden="true">
            <div className="laptop__keys">
              {Array.from({ length: KEY_ROWS * KEYS_PER_ROW }, (_, i) => <span key={i} />)}
              {Array.from({ length: 4 }, (_, i) => <span key={`l${i}`} />)}
              <span className="laptop__space" />
              {Array.from({ length: 4 }, (_, i) => <span key={`r${i}`} />)}
            </div>
            <span className="laptop__pad" />
          </div>
          <span className="laptop__front" aria-hidden="true" />
          <span className="laptop__side" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
});
