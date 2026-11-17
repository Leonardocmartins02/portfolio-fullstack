import type { Metadata } from "next";
import {
  AdVideoGallery,
  CaseStudyIntro,
  CaseStudyNotes,
  CaseStudyPage,
  CaseStudyVideo,
  ScreenGallery,
  type AdVideo,
  type Screen,
} from "@/components/case-study";

export const metadata: Metadata = {
  title: "Perol — landing page do F5 Flotador e Lavix | Leonardo Martins",
  description: "Landing page de dois produtos de limpeza profissional: troca de produto, galeria por volume, kits com preço por litro, guia por ambiente e versão para celular, com React, TanStack Start e Tailwind CSS, mais cinco anúncios em vídeo para a Black Friday.",
};

const repository = "https://github.com/Leonardocmartins02/pixel-perfect-replica";

const desktopScreens: Screen[] = [
  { src: "/projects/perol-compra.png", alt: "Topo da página do F5 Flotador com galeria, selos, seletor de volume e kits", caption: "Compra" },
  { src: "/projects/perol-duvidas.png", alt: "Seção de dúvidas com foto de cena ao lado da resposta para “Será que limpa de verdade?”", caption: "Dúvidas antes de comprar" },
  { src: "/projects/perol-kits.png", alt: "Três kits com preço, desconto calculado e preço por litro", caption: "Kits" },
  { src: "/projects/perol-guia-ambiente.png", alt: "Guia rápido de recepções e halls com dose, passos e kit indicado", caption: "Guia por ambiente" },
  { src: "/projects/perol-antes-depois.png", alt: "Comparadores de antes e depois em inox, azulejo e estofado", caption: "Antes e depois (comparação ilustrativa)" },
  { src: "/projects/perol-lavix.png", alt: "A mesma página com o Lavix selecionado e a cor de destaque roxa", caption: "Lavix" },
];

const mobileScreens: Screen[] = [
  { src: "/projects/perol-celular-topo.png", alt: "Topo no celular com galeria e barra fixa de compra", caption: "Celular — topo" },
  { src: "/projects/perol-celular-kit.png", alt: "Seletor de volume, kits e botão de compra no celular", caption: "Celular — kits" },
  { src: "/projects/perol-celular-duvidas.png", alt: "Primeira dúvida no celular, com foto e resposta", caption: "Celular — dúvidas" },
];

const steps = [
  "Abrir o topo do F5 Flotador: trocar a foto da galeria e passar de 1 L para 5 L, com fotos, kits e preço mudando juntos.",
  "Rolar pelas dúvidas de compra: a foto ao lado acompanha cada resposta.",
  "Comparar os kits pelo preço por litro e abrir o popup de garantia, com prazos, frete e pagamento.",
  "Abrir o guia rápido de um ambiente, com dose, passos e kit indicado; “Escolher este kit” volta para a compra com o kit já selecionado.",
  "Arrastar o comparador de antes e depois e passar pelos três passos de “Como funciona”.",
  "Abrir o detalhe de uma diluição na ficha técnica e uma pergunta do FAQ.",
  "Trocar para o Lavix no cabeçalho: conteúdo, fotos e cor de destaque mudam na mesma página.",
  "No celular: escolher volume e kit, com a barra fixa de compra acompanhando a rolagem.",
];

const adVideos: AdVideo[] = [
  {
    src: "/projects/perol-anuncio-casa.mp4",
    poster: "/projects/perol-anuncio-casa.jpg",
    title: "Casa — “Quantos produtos de limpeza tem na sua casa?”",
    label: "Anúncio Perol para casas: sete frascos caem na tela, o F5 Flotador substitui todos, grandes empresas confiam há 30 anos e oferta de Black Friday na caixa fechada",
  },
  {
    src: "/projects/perol-anuncio-diaristas.mp4",
    poster: "/projects/perol-anuncio-diaristas.jpg",
    title: "Diaristas — “Quanto pesa a sua bolsa?”",
    label: "Anúncio Perol para diaristas: a bolsa cai numa balança que marca pesado, troque cinco por um, grandes empresas confiam e oferta de Black Friday na caixa fechada",
  },
  {
    src: "/projects/perol-anuncio-cozinhas.mp4",
    poster: "/projects/perol-anuncio-cozinhas.jpg",
    title: "Cozinhas — “Fim de expediente”",
    label: "Anúncio Perol para cozinhas profissionais: uma passada limpa o piso, gordura, encardido e sujeira todo dia, grandes empresas confiam e oferta de Black Friday na caixa fechada",
  },
  {
    src: "/projects/perol-anuncio-condominios.mp4",
    poster: "/projects/perol-anuncio-condominios.jpg",
    title: "Condomínios — “Quantos produtos sua equipe compra?”",
    label: "Anúncio Perol para síndicos e gestores: a lista de compras é riscada até sobrar um produto, 30 anos atendendo grandes empresas e oferta de Black Friday na caixa fechada",
  },
  {
    src: "/projects/perol-anuncio-institucional.mp4",
    poster: "/projects/perol-anuncio-institucional.jpg",
    title: "Institucional — “Há 30 anos”",
    label: "Anúncio institucional Perol: 30 anos de mercado, ISO 9001, normas Anvisa e presença no Brasil, tudo começou com o Flotador, e oferta de Black Friday na caixa fechada",
  },
];

const notes = [
  {
    title: "Decisões técnicas",
    body: "React 19 com TanStack Start, TypeScript e Tailwind CSS v4; os controles usam shadcn/ui (Radix). Produtos, kits, preços, prazos e FAQ ficam num módulo tipado, separado da apresentação. O preço é guardado em centavos e o preço por litro e o desconto são calculados a partir dele; dado que falta aparece como “Pendente”, nunca com valor inventado. A troca de produto muda o conteúdo e a cor de destaque pelos tokens do tema, sem recarregar a página.",
  },
  {
    title: "Qualidade e limites",
    body: "75 testes com Vitest e Testing Library cobrem a oferta, a galeria, os carrosséis e a acessibilidade dos controles. A página não tem rolagem horizontal em 320, 375, 768 e 1440 px, mantém o foco visível e respeita a preferência por menos movimento. A compra só é liberada por uma regra única que exige o link de checkout aprovado; até lá, o botão avisa que ela está indisponível. As avaliações de clientes ficaram fora desta apresentação para não reproduzir nome e foto deles.",
  },
];

export default function PerolPage() {
  return (
    <CaseStudyPage>
      <CaseStudyIntro
        tags={["Landing page", "Front-end"]}
        title="Perol — landing page do F5 Flotador e Lavix"
        links={[
          { label: "Ver código", href: repository },
          { label: "Executar localmente", href: `${repository}#executar` },
        ]}
      >
        Página de venda de dois produtos da linha profissional Perol, feita para receber o
        tráfego dos anúncios. Uma página só troca entre o F5 Flotador e o Lavix, com galeria por
        volume, kits com preço por litro, respostas às dúvidas de compra, guia de uso por
        ambiente e ficha técnica. Fiz o código, as artes e os vídeos dos anúncios. O
        marketing e a veiculação ficam com um parceiro.
      </CaseStudyIntro>
      <CaseStudyVideo
        src="/projects/perol-demo.webm"
        poster="/projects/perol-poster.png"
        label="Demonstração da landing page Perol: galeria e kits, dúvidas, garantia, guia por ambiente, antes e depois, ficha técnica, troca para o Lavix e versão para celular"
        note="Vídeo sem áudio. O roteiro textual abaixo descreve o fluxo apresentado."
        steps={steps}
      />
      <AdVideoGallery
        title="Anúncios em vídeo"
        intro="Cinco anúncios verticais para a campanha de Black Friday, cada um falando com um público: casa, diaristas, cozinhas profissionais, condomínios e um institucional. Todos abrem com um gancho visual nos primeiros segundos, mostram o produto, trazem a prova de confiança da marca e fecham na oferta da caixa fechada."
        note="Vídeos com som. Animação feita em código (HTML renderizado quadro a quadro com Chromium e ffmpeg), narração gerada no ElevenLabs e efeitos sonoros sintetizados. O piso do anúncio de cozinhas é uma imagem ilustrativa."
        videos={adVideos}
      />
      <CaseStudyNotes notes={notes} />
      <ScreenGallery title="Telas da página" desktop={desktopScreens} mobile={mobileScreens} />
    </CaseStudyPage>
  );
}
