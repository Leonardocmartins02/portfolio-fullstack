import type { ReactNode } from "react";

// Cards do hero: pedaços reais do dashboard do SimpleStock, com os números e o
// visual do protótipo (docs/features/refatoracao-visual/prototype). Repetem o que
// a tela mostra, então ficam fora da árvore de acessibilidade.
// data-depth é a distância até a tampa no eixo Z (px), só para o parallax do
// useHeroScene (o que está mais perto anda mais). Os cards ficam fora do 3D,
// com o texto nítido; frente e fundo vêm da ordem de pintura (BackCards antes do
// notebook).

// Ícones do protótipo (Lucide, ISC).
const icons = {
  dash: (
    <>
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </>
  ),
  alert: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  swap: (
    <>
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </>
  ),
  "trend-up": (
    <>
      <path d="M22 7 13.5 15.5 8.5 10.5 2 17" />
      <path d="M16 7h6v6" />
    </>
  ),
  in: (
    <>
      <path d="M17 7 7 17" />
      <path d="M17 17H7V7" />
    </>
  ),
  out: (
    <>
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </>
  ),
};

function Icon({ name }: { name: keyof typeof icons }) {
  return <svg className="stock-card__icon" viewBox="0 0 24 24">{icons[name]}</svg>;
}

function Card({ id, depth, dark, children }: { id: string; depth: number; dark?: boolean; children: ReactNode }) {
  return (
    <div
      className="stock-card"
      data-card={id}
      data-depth={depth}
      data-dark={dark ? "" : undefined}
      aria-hidden="true"
    >
      <div className="stock-card__body">{children}</div>
    </div>
  );
}

/** O card que fica atrás da tampa (vem antes do notebook na ordem de pintura). */
export function BackCards() {
  return (
    <Card id="units" depth={-70}>
      <div className="stock-card__top">
        <span className="stock-card__label">Unidades em estoque</span>
        <span className="stock-card__chip" data-tone="accent"><Icon name="dash" /></span>
      </div>
      <p className="stock-card__value">610<small>un.</small></p>
      <div className="stock-card__foot">
        <span className="stock-card__pill"><Icon name="trend-up" />+112</span>
        em 30 dias
      </div>
    </Card>
  );
}

/** Os cards à frente do notebook, do mais distante para o mais próximo. */
export function FrontCards() {
  return (
    <>
      <Card id="restock" depth={60} dark>
        <div className="stock-card__top">
          <span className="stock-card__label">Precisam de reposição</span>
          <span className="stock-card__chip" data-tone="warn"><Icon name="alert" /></span>
        </div>
        <p className="stock-card__value">30<small>produtos</small></p>
        <div className="stock-card__foot stock-card__foot--split">
          <span><span className="stock-card__dot" data-tone="out" />15 sem estoque</span>
          <span><span className="stock-card__dot" data-tone="attn" />15 estoque baixo</span>
        </div>
      </Card>
      <Card id="moves" depth={100}>
        <div className="stock-card__top">
          <span className="stock-card__label">Movimentações hoje</span>
          <span className="stock-card__chip"><Icon name="swap" /></span>
        </div>
        <p className="stock-card__value">20</p>
        <div className="stock-card__foot stock-card__foot--split">
          <span className="stock-card__move" data-tone="in"><span><Icon name="in" /></span>4 entradas · +42</span>
          <span className="stock-card__move" data-tone="out"><span><Icon name="out" /></span>14 saídas · −49</span>
        </div>
      </Card>
      <Card id="activity" depth={140}>
        <div className="stock-card__row">
          <span className="stock-card__move" data-tone="in"><span><Icon name="in" /></span></span>
          <span className="stock-card__event">
            <span className="stock-card__event-title">Entrada · Cola Branca 90g</span>
            <span className="stock-card__event-meta">há 24 min · compras@simplestock.local</span>
          </span>
          <span className="stock-card__delta">+9 un.</span>
        </div>
      </Card>
    </>
  );
}
