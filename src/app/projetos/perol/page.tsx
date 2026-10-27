import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Perol — landing page do F5 Flotador e Lavix | Leonardo Martins",
  description: "Landing page de dois produtos de limpeza profissional: troca de produto, galeria por volume, kits com preço por litro, guia por ambiente e versão para celular, com React, TanStack Start e Tailwind CSS.",
};

const repository = "https://github.com/Leonardocmartins02/pixel-perfect-replica";

const desktopScreens = [
  { src: "/projects/perol-compra.png", alt: "Topo da página do F5 Flotador com galeria, selos, seletor de volume e kits", caption: "Compra" },
  { src: "/projects/perol-duvidas.png", alt: "Seção de dúvidas com foto de cena ao lado da resposta para “Será que limpa de verdade?”", caption: "Dúvidas antes de comprar" },
  { src: "/projects/perol-kits.png", alt: "Três kits com preço, desconto calculado e preço por litro", caption: "Kits" },
  { src: "/projects/perol-guia-ambiente.png", alt: "Guia rápido de recepções e halls com dose, passos e kit indicado", caption: "Guia por ambiente" },
  { src: "/projects/perol-antes-depois.png", alt: "Comparadores de antes e depois em inox, azulejo e estofado", caption: "Antes e depois (comparação ilustrativa)" },
  { src: "/projects/perol-lavix.png", alt: "A mesma página com o Lavix selecionado e a cor de destaque roxa", caption: "Lavix" },
];

const mobileScreens = [
  { src: "/projects/perol-celular-topo.png", alt: "Topo no celular com galeria e barra fixa de compra", caption: "Celular — topo" },
  { src: "/projects/perol-celular-kit.png", alt: "Seletor de volume, kits e botão de compra no celular", caption: "Celular — kits" },
  { src: "/projects/perol-celular-duvidas.png", alt: "Primeira dúvida no celular, com foto e resposta", caption: "Celular — dúvidas" },
];

export default function PerolPage() {
  return (
    <main id="main" className="mx-auto max-w-content px-6 py-12">
      <Link href="/#projetos" className="focus-ring rounded text-sm text-accent hover:underline">← Voltar aos projetos</Link>
      <p className="mt-10 text-sm uppercase tracking-widest text-accent">Landing page · Front-end</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Perol — landing page do F5 Flotador e Lavix</h1>
      <p className="mt-5 max-w-3xl leading-relaxed text-muted">
        Página de venda de dois produtos da linha profissional Perol, feita para receber o
        tráfego dos anúncios. Uma página só troca entre o F5 Flotador e o Lavix, com galeria por
        volume, kits com preço por litro, respostas às dúvidas de compra, guia de uso por
        ambiente e ficha técnica. Fiz tudo: o código e as artes. O marketing e os
        anúncios ficam com um parceiro.
      </p>
      <div className="mt-6 flex flex-wrap gap-5 text-sm font-medium text-accent">
        <a className="focus-ring rounded hover:underline" href={repository} target="_blank" rel="noopener noreferrer">Ver código ↗</a>
        <a className="focus-ring rounded hover:underline" href={`${repository}#executar`} target="_blank" rel="noopener noreferrer">Executar localmente ↗</a>
      </div>
      <h2 className="mb-4 mt-10 text-2xl font-semibold">Demonstração do fluxo</h2>
      <video controls preload="metadata" poster="/projects/perol-poster.png" className="w-full rounded-2xl border border-border" aria-label="Demonstração da landing page Perol: galeria e kits, dúvidas, garantia, guia por ambiente, antes e depois, ficha técnica, troca para o Lavix e versão para celular">
        <source src="/projects/perol-demo.webm" type="video/webm" />
        Seu navegador não reproduz este vídeo. <a href="/projects/perol-demo.webm">Baixar demonstração</a>.
      </video>
      <p className="mt-3 text-sm text-muted">Vídeo sem áudio. O roteiro textual abaixo descreve o fluxo apresentado.</p>
      <ol className="mt-5 list-decimal space-y-2 pl-6 leading-relaxed text-muted">
        <li>Abrir o topo do F5 Flotador: trocar a foto da galeria e passar de 1 L para 5 L, com fotos, kits e preço mudando juntos.</li>
        <li>Rolar pelas dúvidas de compra: a foto ao lado acompanha cada resposta.</li>
        <li>Comparar os kits pelo preço por litro e abrir o popup de garantia, com prazos, frete e pagamento.</li>
        <li>Abrir o guia rápido de um ambiente, com dose, passos e kit indicado; “Escolher este kit” volta para a compra com o kit já selecionado.</li>
        <li>Arrastar o comparador de antes e depois e passar pelos três passos de “Como funciona”.</li>
        <li>Abrir o detalhe de uma diluição na ficha técnica e uma pergunta do FAQ.</li>
        <li>Trocar para o Lavix no cabeçalho: conteúdo, fotos e cor de destaque mudam na mesma página.</li>
        <li>No celular: escolher volume e kit, com a barra fixa de compra acompanhando a rolagem.</li>
      </ol>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <section><h2 className="text-xl font-semibold">Decisões técnicas</h2><p className="mt-3 leading-relaxed text-muted">React 19 com TanStack Start, TypeScript e Tailwind CSS v4; os controles usam shadcn/ui (Radix). Produtos, kits, preços, prazos e FAQ ficam num módulo tipado, separado da apresentação. O preço é guardado em centavos e o preço por litro e o desconto são calculados a partir dele; dado que falta aparece como “Pendente”, nunca com valor inventado. A troca de produto muda o conteúdo e a cor de destaque pelos tokens do tema, sem recarregar a página.</p></section>
        <section><h2 className="text-xl font-semibold">Qualidade e limites</h2><p className="mt-3 leading-relaxed text-muted">75 testes com Vitest e Testing Library cobrem a oferta, a galeria, os carrosséis e a acessibilidade dos controles. A página não tem rolagem horizontal em 320, 375, 768 e 1440 px, mantém o foco visível e respeita a preferência por menos movimento. A compra só é liberada por uma regra única que exige o link de checkout aprovado; até lá, o botão avisa que ela está indisponível. As avaliações de clientes ficaram fora desta apresentação para não reproduzir nome e foto deles.</p></section>
      </div>
      <h2 className="mb-4 mt-12 text-2xl font-semibold">Telas da página</h2>
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
