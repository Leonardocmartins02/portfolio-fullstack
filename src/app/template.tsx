// Abertura e troca de página: o template remonta a cada navegação entre rotas
// (o layout não), então a animação de entrada roda na primeira carga e em toda
// troca de página. Só opacidade (.page-enter em globals.css): nada se desloca
// enquanto o scroll-orchestrator mede a home. Âncoras (#projetos) não remontam.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
