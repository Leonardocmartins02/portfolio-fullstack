import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SimpleStock — demonstração | Leonardo Martins",
  description: "Demonstração do sistema de estoque: cadastro, entrada, saída e histórico de movimentações com React, Express e PostgreSQL.",
};

export default function SimpleStockPage() {
  return (
    <main id="main" className="mx-auto max-w-content px-6 py-12">
      <Link href="/#projetos" className="focus-ring rounded text-sm text-accent hover:underline">← Voltar aos projetos</Link>
      <p className="mt-10 text-sm uppercase tracking-widest text-accent">Projeto principal · Full Stack</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">SimpleStock — controle de estoque</h1>
      <p className="mt-5 max-w-3xl leading-relaxed text-muted">
        Uma aplicação para cadastrar produtos, acompanhar saldos e registrar movimentações.
        Esta demonstração usa dados fictícios em uma instalação local com API e PostgreSQL reais.
      </p>
      <div className="mt-6 flex flex-wrap gap-5 text-sm font-medium text-accent">
        <a className="focus-ring rounded hover:underline" href="https://github.com/Leonardocmartins02/Sistema-Estoque-main" target="_blank" rel="noopener noreferrer">Ver código ↗</a>
        <a className="focus-ring rounded hover:underline" href="https://github.com/Leonardocmartins02/Sistema-Estoque-main#executar-localmente" target="_blank" rel="noopener noreferrer">Executar localmente ↗</a>
      </div>
      <h2 className="mb-4 mt-10 text-2xl font-semibold">Demonstração do fluxo</h2>
      <video controls preload="metadata" poster="/projects/simplestock-dashboard.png" className="w-full rounded-2xl border border-border" aria-label="Demonstração visual do cadastro, entrada, saída e histórico no SimpleStock">
        <source src="/projects/simplestock-demo.webm" type="video/webm" />
        Seu navegador não reproduz este vídeo. <a href="/projects/simplestock-demo.webm">Baixar demonstração</a>.
      </video>
      <p className="mt-3 text-sm text-muted">Vídeo sem áudio. O roteiro textual abaixo descreve o fluxo apresentado.</p>
      <ol className="mt-5 list-decimal space-y-2 pl-6 leading-relaxed text-muted">
        <li>Abrir o painel para consultar produtos, saldos e alertas de estoque.</li>
        <li>Cadastrar um produto com 10 unidades e estoque mínimo de 5.</li>
        <li>Registrar uma entrada de 5 unidades: saldo de 10 para 15.</li>
        <li>Registrar uma saída de 3 unidades: saldo de 15 para 12. Consultar os três registros no histórico.</li>
      </ol>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <section><h2 className="text-xl font-semibold">Decisões técnicas</h2><p className="mt-3 leading-relaxed text-muted">React e React Query na interface; Express e Zod na API; Prisma e PostgreSQL na persistência. O saldo é derivado das movimentações. Transações com bloqueio de linha mantêm a validação e a gravação juntas, inclusive quando duas saídas chegam ao mesmo tempo.</p></section>
        <section><h2 className="text-xl font-semibold">Qualidade e limites</h2><p className="mt-3 leading-relaxed text-muted">Testes de integração usam PostgreSQL real e os testes de interface verificam comportamento. O CI executa lint, tipos, testes e build. Esta apresentação é uma gravação; não disponibiliza um ambiente compartilhado para alterar dados.</p></section>
      </div>
      <h2 className="mb-4 mt-12 text-2xl font-semibold">Telas da aplicação</h2>
      <Image src="/projects/simplestock-dashboard.png" alt="Painel de estoque com produtos e seus saldos" width={1440} height={1080} className="h-auto w-full rounded-2xl border border-border" />
    </main>
  );
}
