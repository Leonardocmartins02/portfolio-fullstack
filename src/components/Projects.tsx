import type { Project } from "@prisma/client";
import { ProjectsShowcase } from "@/components/projects/ProjectsShowcase";
import type { ProjectPanelData } from "@/components/projects/ProjectPanel";

const stockRepository = "https://github.com/Leonardocmartins02/Sistema-Estoque-main";
const perolRepository = "https://github.com/Leonardocmartins02/pixel-perfect-replica";
const chadbbSite = "https://chadbb.online";

const normalize = (link: string | null) => link?.replace(/\.git$|\/$/g, "");

// Projetos com apresentação própria no código: aparecem mesmo se o banco falhar.
const featured: ProjectPanelData[] = [
  {
    id: "simplestock",
    name: "SimpleStock",
    title: "SimpleStock — sistema de estoque",
    category: "Full stack",
    fact: "Projeto principal",
    // Interface, API e persistência em detalhe ficam na página do projeto.
    description:
      "Controle de produtos, entradas, saídas e ajustes de inventário, com histórico das movimentações.",
    highlight: {
      label: "Destaque técnico",
      text: "transações e bloqueio de linha no PostgreSQL para validar movimentações e evitar saídas concorrentes sobre o mesmo saldo.",
    },
    techs: ["React", "Express", "TypeScript", "Prisma", "PostgreSQL", "Vitest"],
    image: null,
    video: {
      src: "/projects/simplestock-v2-demo.webm",
      poster: "/projects/simplestock-v2-poster.png",
      width: 1440,
      height: 1080,
      label: "Demonstração do SimpleStock: dashboard, produtos e registro de uma movimentação de estoque",
    },
    actions: [
      { label: "Ver demonstração", href: "/projetos/simplestock", external: false },
      { label: "Ver código", href: stockRepository, external: true },
    ],
  },
  {
    id: "perol",
    name: "Perol",
    title: "Perol: landing page de produtos de limpeza",
    category: "Landing page, front-end",
    fact: "Demonstração em vídeo",
    description:
      "Página de venda do F5 Flotador e do Lavix para campanhas de anúncio: troca de produto, galeria por volume, kits com preço por litro e guia por ambiente. Fiz o código; as artes são de um parceiro.",
    techs: ["React", "TanStack Start", "Tailwind CSS"],
    image: null,
    video: {
      src: "/projects/perol-demo.webm",
      poster: "/projects/perol-poster.png",
      width: 1440,
      height: 1080,
      label: "Demonstração da landing page Perol: galeria e kits, dúvidas, guia por ambiente, troca para o Lavix e versão para celular",
    },
    actions: [
      { label: "Ver demonstração", href: "/projetos/perol", external: false },
      { label: "Ver código", href: perolRepository, external: true },
    ],
  },
  {
    id: "chadbb",
    name: "chadbb",
    title: "chadbb: organizador de chá de bebê",
    category: "Full stack",
    fact: "Em produção",
    description:
      "Convites por link no WhatsApp, confirmação de presença e reserva de fraldas e mimos pelo celular, sem conta. Em uso para um chá real, com cerca de 50 convidados.",
    highlight: {
      label: "Destaque técnico",
      text: "RLS restrita e escrita só por funções no Postgres, com saldo dos presentes numa fonte única e versão em cada registro; 678 testes E2E e auditoria de acessibilidade com axe.",
    },
    techs: ["React", "TypeScript", "Supabase", "PostgreSQL", "Cloudflare Pages", "Playwright"],
    image: null,
    video: {
      src: "/projects/chadbb-demo.webm",
      poster: "/projects/chadbb-poster.png",
      width: 1440,
      height: 1080,
      label: "Demonstração do chadbb: painel do organizador com presença, convidados e presentes e, no celular, a confirmação e a reserva de presentes pelo convidado",
    },
    actions: [
      { label: "Ver demonstração", href: "/projetos/chadbb", external: false },
      { label: "Ver site", href: `${chadbbSite}/`, external: true },
    ],
  },
];

// Os demais projetos vêm do painel administrativo, com o texto como foi cadastrado.
function fromDatabase(project: Project): ProjectPanelData {
  const isRepository = project.link?.startsWith("https://github.com/") ?? false;
  return {
    // Fato da linha do painel: o que o link de fato é, salvo nota editorial.
    fact: project.link ? (isRepository ? "Código aberto" : "Site no ar") : undefined,
    id: project.id,
    name: project.title,
    title: project.title,
    category: project.category,
    description: project.description,
    // O título já está no painel; a captura não acrescenta texto a ele.
    image: project.imageUrl ? { src: project.imageUrl, alt: "" } : null,
    actions: project.link
      ? [
          {
            label: isRepository ? "Ver código" : "Ver demonstração",
            href: project.link,
            external: true,
          },
        ]
      : [],
  };
}

export function Projects({ projects }: { projects: Project[] }) {
  // Projetos com apresentação própria no código não se repetem na lista que vem do banco.
  const otherProjects = projects.filter((project) => {
    const link = normalize(project.link);
    return link !== stockRepository && link !== perolRepository && link !== chadbbSite;
  });

  return <ProjectsShowcase projects={[...featured, ...otherProjects.map(fromDatabase)]} />;
}
