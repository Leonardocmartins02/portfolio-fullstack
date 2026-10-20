import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SimpleStock — nova interface | Leonardo Martins",
  description: "Nova interface do sistema de estoque: dashboard, produtos, página do produto, painel de movimentação e histórico, com React, Express e PostgreSQL.",
};

const desktopScreens = [
  { src: "/projects/simplestock-v2-dashboard.png", alt: "Dashboard com indicadores, evolução do estoque em 30 dias, status e produtos para repor", caption: "Dashboard" },
  { src: "/projects/simplestock-v2-produtos.png", alt: "Lista de produtos com abas por situação, saldo e mínimo, status e ação de movimentar", caption: "Produtos" },
  { src: "/projects/simplestock-v2-produto.png", alt: "Página do produto com saldo em relação ao mínimo, gráfico de 30 dias e últimas movimentações", caption: "Página do produto" },
  { src: "/projects/simplestock-v2-nova-movimentacao.png", alt: "Painel de nova movimentação com prévia do saldo e aviso de estoque baixo antes de confirmar", caption: "Nova movimentação" },
  { src: "/projects/simplestock-v2-movimentacoes.png", alt: "Histórico de movimentações em tabela agrupada por dia, com filtros e detalhe da linha", caption: "Movimentações" },
];

const mobileScreens = [
  { src: "/projects/simplestock-v2-celular-dashboard.png", alt: "Dashboard no celular", caption: "Celular — dashboard" },
  { src: "/projects/simplestock-v2-celular-produtos.png", alt: "Lista de produtos em cartões no celular", caption: "Celular — produtos" },
];

export default function SimpleStockPage() {
  return (
    <main id="main" className="mx-auto max-w-content px-6 py-12">
      <Link href="/#projetos" className="focus-ring rounded text-sm text-accent hover:underline">← Voltar aos projetos</Link>
      <p className="mt-10 text-sm uppercase tracking-widest text-accent">Projeto principal · Full Stack</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">SimpleStock — controle de estoque</h1>
      <p className="mt-5 max-w-3xl leading-relaxed text-muted">
        Uma aplicação para cadastrar produtos, acompanhar saldos e registrar movimentações.
        O vídeo e as telas mostram a nova interface — navegação lateral, dashboard, página por
        produto e histórico de auditoria — no protótipo navegável, com dados fictícios; a
        migração da aplicação para ela está em andamento no repositório.
      </p>
      <div className="mt-6 flex flex-wrap gap-5 text-sm font-medium text-accent">
        <a className="focus-ring rounded hover:underline" href="https://github.com/Leonardocmartins02/Sistema-Estoque-main" target="_blank" rel="noopener noreferrer">Ver código ↗</a>
        <a className="focus-ring rounded hover:underline" href="https://github.com/Leonardocmartins02/Sistema-Estoque-main#executar-localmente" target="_blank" rel="noopener noreferrer">Executar localmente ↗</a>
      </div>
      <h2 className="mb-4 mt-10 text-2xl font-semibold">Demonstração do fluxo</h2>
      <video controls preload="metadata" poster="/projects/simplestock-v2-poster.png" className="w-full rounded-2xl border border-border" aria-label="Demonstração da nova interface do SimpleStock: dashboard, reposição, produtos, saída com aviso de estoque baixo e histórico">
        <source src="/projects/simplestock-v2-demo.webm" type="video/webm" />
        Seu navegador não reproduz este vídeo. <a href="/projects/simplestock-v2-demo.webm">Baixar demonstração</a>.
      </video>
      <p className="mt-3 text-sm text-muted">Vídeo sem áudio. O roteiro textual abaixo descreve o fluxo apresentado.</p>
      <ol className="mt-5 list-decimal space-y-2 pl-6 leading-relaxed text-muted">
        <li>Abrir o dashboard: indicadores do estoque, evolução das unidades em 30 dias e produtos para repor.</li>
        <li>Repor um produto sem estoque: o painel já abre em entrada, com 25 unidades e a prévia do saldo de 0 para 25.</li>
        <li>Navegar pelos produtos por situação e buscar pelo nome.</li>
        <li>Abrir a página do produto e registrar uma saída de 5 unidades, com o aviso de que ele ficará abaixo do mínimo antes de confirmar.</li>
        <li>Consultar o histórico: filtrado pelo produto, depois completo, com o detalhe da linha, a ordem por data e a aba de saídas.</li>
      </ol>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <section><h2 className="text-xl font-semibold">Decisões técnicas</h2><p className="mt-3 leading-relaxed text-muted">React e React Query na interface; Express e Zod na API; Prisma e PostgreSQL na persistência. O saldo é derivado das movimentações. Transações com bloqueio de linha mantêm a validação e a gravação juntas, inclusive quando duas saídas chegam ao mesmo tempo.</p></section>
        <section><h2 className="text-xl font-semibold">Qualidade e limites</h2><p className="mt-3 leading-relaxed text-muted">Testes de integração usam PostgreSQL real e os testes de interface verificam comportamento. O CI executa lint, tipos, testes e build. A nova interface segue WCAG 2.2 AA como critério de aceite. Esta apresentação é uma gravação; não disponibiliza um ambiente compartilhado para alterar dados.</p></section>
      </div>
      <h2 className="mb-4 mt-12 text-2xl font-semibold">Telas da nova interface</h2>
      <div className="grid gap-8 md:grid-cols-2">
        {desktopScreens.map((screen) => (
          <figure key={screen.src}>
            <Image src={screen.src} alt={screen.alt} width={1440} height={900} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full rounded-2xl border border-border" />
            <figcaption className="mt-2 text-sm text-muted">{screen.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-8">
        {mobileScreens.map((screen) => (
          <figure key={screen.src} className="w-full max-w-[260px]">
            <Image src={screen.src} alt={screen.alt} width={390} height={844} className="h-auto w-full rounded-2xl border border-border" />
            <figcaption className="mt-2 text-sm text-muted">{screen.caption}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
