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
  title: "chadbb — organizador de chá de bebê | Leonardo Martins",
  description: "Organizador de chá de bebê em produção: convites por link no WhatsApp, confirmação de presença e reserva de fraldas e mimos pelo celular, sem conta, com React, Supabase e Cloudflare Pages.",
};

const site = "https://chadbb.online/";

const desktopScreens: Screen[] = [
  { src: "/projects/chadbb-inicio.png", alt: "Página inicial do chadbb com a proposta “Mais carinho. Menos complicação.” e o resumo para quem recebe o convite", caption: "Página inicial" },
  { src: "/projects/chadbb-painel.png", alt: "Painel do evento com pessoas confirmadas e convites respondidos por resposta", caption: "Painel do evento" },
  { src: "/projects/chadbb-convidados.png", alt: "Convites por pessoa ou família com a resposta de cada um e ações de editar, reemitir link, revogar e excluir", caption: "Convidados" },
  { src: "/projects/chadbb-fraldas-mimos.png", alt: "Fraldas por tamanho com pacotes reservados e disponíveis, e mimos escolhidos", caption: "Fraldas por tamanho e mimos" },
  { src: "/projects/chadbb-escolhas.png", alt: "Escolhas dos convidados separadas em fraldas e mimos, com “Vai levar” e “Compra informada”", caption: "Escolhas dos convidados" },
  { src: "/projects/chadbb-presentes.png", alt: "Lista de presentes do organizador com os pacotes pedidos por tamanho e os mimos da lista", caption: "Lista de presentes" },
];

const mobileScreens: Screen[] = [
  { src: "/projects/chadbb-celular-convite.png", alt: "Convite no celular com nome da família, data, local e o botão “Responder ao convite”", caption: "Celular — convite" },
  { src: "/projects/chadbb-celular-presenca.png", alt: "Confirmação de presença para duas pessoas, com o prazo vindo do servidor e o aviso de resposta salva", caption: "Celular — presença" },
  { src: "/projects/chadbb-celular-presente.png", alt: "Três pacotes de fralda tamanho M reservados, com opções de trocar tamanho, informar compra e cancelar", caption: "Celular — fralda reservada" },
];

const steps = [
  "Abrir a página inicial e as três etapas: preparar o encontro, convidar e acompanhar os presentes.",
  "Entrar em “Seus eventos” e abrir o chá publicado.",
  "Ler o painel: pessoas confirmadas, convites respondidos por resposta e lembretes de quem marcou “Talvez”.",
  "Percorrer os convites, um por pessoa ou família, com a resposta de cada um e as ações de reemitir ou revogar o link.",
  "Conferir as fraldas por tamanho, os mimos e as escolhas dos convidados, com “Vai levar” e “Compra informada”.",
  "Abrir a lista de presentes, com os pacotes pedidos por tamanho e os mimos da lista.",
  "No celular, como convidado: abrir o convite, confirmar presença para duas pessoas, reservar três pacotes de fralda M, informar a compra e escolher um mimo.",
];

const notes = [
  {
    title: "Decisões técnicas",
    body: "React 19 com Vite, TypeScript, Tailwind CSS e TanStack Query no front; Supabase (Postgres, Auth, Storage e Edge Functions) no back, com o site no Cloudflare Pages. O organizador entra com um código enviado por e-mail; o convidado não tem conta: o link do convite traz um token que uma Edge Function troca por uma sessão. As tabelas têm RLS restrita e toda escrita passa por funções no banco, com o saldo de cada presente calculado num lugar só e uma versão em cada registro para recusar escrita sobre dado antigo. Prazos de confirmação e o travamento no início do evento vêm do servidor; o front não recalcula.",
  },
  {
    title: "Qualidade e limites",
    body: "678 testes E2E com Playwright, no desktop e no celular, contra um backend simulado, com auditoria de acessibilidade pelo axe; testes do banco com pgTAP (permissões, versão e retenção), testes de integração da API no Supabase local e um ensaio de carga com 50 convidados. Os dados pessoais dos convidados são apagados 30 dias depois do fim do evento. Por enquanto, só famílias convidadas podem criar um evento; o cadastro aberto vem depois.",
  },
];

export default function ChadbbPage() {
  return (
    <CaseStudyPage>
      <CaseStudyIntro
        tags={["Full stack", "Em produção"]}
        title="chadbb — organizador de chá de bebê"
        links={[
          { label: "Ver site", href: site },
        ]}
      >
        Quem organiza monta o evento e manda um link para cada pessoa ou família pelo WhatsApp;
        o convidado abre o convite no celular, confirma presença e escolhe fraldas por tamanho ou
        mimos, sem criar conta. A escolha reserva o presente na hora para todos, então ninguém
        repete. Está em produção, e o primeiro uso real é um chá com cerca de 50 convidados.
      </CaseStudyIntro>
      <CaseStudyVideo
        src="/projects/chadbb-demo.webm"
        poster="/projects/chadbb-poster.png"
        label="Demonstração do chadbb: painel do organizador com presença, convidados, fraldas e mimos, lista de presentes e, no celular, a confirmação de presença e a reserva de presentes pelo convidado"
        note="Vídeo sem áudio, gravado com dados fictícios e o mesmo backend simulado dos testes, para não expor os convidados do evento real. O roteiro textual abaixo descreve o fluxo apresentado."
        steps={steps}
      />
      <CaseStudyNotes notes={notes} />
      <ScreenGallery title="Telas do sistema" desktop={desktopScreens} mobile={mobileScreens} />
    </CaseStudyPage>
  );
}
