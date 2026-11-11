import type { Metadata } from "next";
import {
  CaseStudyIntro,
  CaseStudyNotes,
  CaseStudyPage,
  CaseStudyVideo,
  ScreenGallery,
  type Screen,
} from "@/components/case-study";

export const metadata: Metadata = {
  title: "SimpleStock — nova interface | Leonardo Martins",
  description: "Nova interface do sistema de estoque: dashboard, produtos, página do produto, painel de movimentação e histórico, com React, Express e PostgreSQL.",
};

const desktopScreens: Screen[] = [
  { src: "/projects/simplestock-v2-dashboard.png", alt: "Dashboard com indicadores, evolução do estoque em 30 dias, status e produtos para repor", caption: "Dashboard" },
  { src: "/projects/simplestock-v2-produtos.png", alt: "Lista de produtos com abas por situação, saldo e mínimo, status e ação de movimentar", caption: "Produtos" },
  { src: "/projects/simplestock-v2-produto.png", alt: "Página do produto com saldo em relação ao mínimo, gráfico de 30 dias e últimas movimentações", caption: "Página do produto" },
  { src: "/projects/simplestock-v2-nova-movimentacao.png", alt: "Painel de nova movimentação com prévia do saldo e aviso de estoque baixo antes de confirmar", caption: "Nova movimentação" },
  { src: "/projects/simplestock-v2-movimentacoes.png", alt: "Histórico de movimentações em tabela agrupada por dia, com filtros e detalhe da linha", caption: "Movimentações" },
];

const mobileScreens: Screen[] = [
  { src: "/projects/simplestock-v2-celular-dashboard.png", alt: "Dashboard no celular", caption: "Celular — dashboard" },
  { src: "/projects/simplestock-v2-celular-produtos.png", alt: "Lista de produtos em cartões no celular", caption: "Celular — produtos" },
];

const steps = [
  "Abrir o dashboard: indicadores do estoque, evolução das unidades em 30 dias e produtos para repor.",
  "Repor um produto sem estoque: o painel já abre em entrada, com 25 unidades e a prévia do saldo de 0 para 25.",
  "Navegar pelos produtos por situação e buscar pelo nome.",
  "Abrir a página do produto e registrar uma saída de 5 unidades, com o aviso de que ele ficará abaixo do mínimo antes de confirmar.",
  "Consultar o histórico: filtrado pelo produto, depois completo, com o detalhe da linha, a ordem por data e a aba de saídas.",
];

const notes = [
  {
    title: "Decisões técnicas",
    body: "React e React Query na interface; Express e Zod na API; Prisma e PostgreSQL na persistência. O saldo é derivado das movimentações. Transações com bloqueio de linha mantêm a validação e a gravação juntas, inclusive quando duas saídas chegam ao mesmo tempo.",
  },
  {
    title: "Qualidade e limites",
    body: "Testes de integração usam PostgreSQL real e os testes de interface verificam comportamento. O CI executa lint, tipos, testes e build. A nova interface segue WCAG 2.2 AA como critério de aceite. Esta apresentação é uma gravação; não disponibiliza um ambiente compartilhado para alterar dados.",
  },
];

export default function SimpleStockPage() {
  return (
    <CaseStudyPage>
      <CaseStudyIntro
        tags={["Projeto principal", "Full stack"]}
        title="SimpleStock — controle de estoque"
        links={[
          { label: "Ver código", href: "https://github.com/Leonardocmartins02/Sistema-Estoque-main" },
          { label: "Executar localmente", href: "https://github.com/Leonardocmartins02/Sistema-Estoque-main#executar-localmente" },
        ]}
      >
        Uma aplicação para cadastrar produtos, acompanhar saldos e registrar movimentações.
        O vídeo e as telas mostram a nova interface — navegação lateral, dashboard, página por
        produto e histórico de auditoria — no protótipo navegável, com dados fictícios; a
        migração da aplicação para ela está em andamento no repositório.
      </CaseStudyIntro>
      <CaseStudyVideo
        src="/projects/simplestock-v2-demo.webm"
        poster="/projects/simplestock-v2-poster.png"
        label="Demonstração da nova interface do SimpleStock: dashboard, reposição, produtos, saída com aviso de estoque baixo e histórico"
        note="Vídeo sem áudio. O roteiro textual abaixo descreve o fluxo apresentado."
        steps={steps}
      />
      <CaseStudyNotes notes={notes} />
      <ScreenGallery title="Telas da nova interface" desktop={desktopScreens} mobile={mobileScreens} />
    </CaseStudyPage>
  );
}
