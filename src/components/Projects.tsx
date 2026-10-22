import type { Project } from "@prisma/client";
import { ProjectsShowcase } from "@/components/projects/ProjectsShowcase";
import type { ProjectPanelData } from "@/components/projects/ProjectPanel";

const stockRepository = "https://github.com/Leonardocmartins02/Sistema-Estoque-main";
const perolRepository = "https://github.com/Leonardocmartins02/pixel-perfect-replica";
const roomsRepository = "https://github.com/Leonardocmartins02/Projeto-Agendamento-de-Salas";

// Notas editoriais para projetos que vêm do banco, pelo link do repositório.
const notes: Record<string, Pick<ProjectPanelData, "fact" | "highlight">> = {
  [roomsRepository]: {
    fact: "Primeiro projeto",
    highlight: {
      label: "Ponto de partida",
      text: "meu primeiro projeto, mais simples que os outros; fica aqui para mostrar a evolução até os mais recentes.",
    },
  },
};

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
    image: {
      src: "/projects/simplestock-v2-dashboard.png",
      alt: "SimpleStock: dashboard da nova interface com indicadores, evolução do estoque e produtos para repor",
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
    image: {
      src: "/projects/perol-capa.png",
      alt: "Landing page Perol no navegador, com galeria e kits do F5 Flotador, e no celular, com o Lavix",
    },
    actions: [
      { label: "Ver demonstração", href: "/projetos/perol", external: false },
      { label: "Ver código", href: perolRepository, external: true },
    ],
  },
];

// Os demais projetos vêm do painel administrativo, com o texto como foi cadastrado.
function fromDatabase(project: Project): ProjectPanelData {
  const isRepository = project.link?.startsWith("https://github.com/") ?? false;
  return {
    // Fato da linha do painel: o que o link de fato é, salvo nota editorial.
    fact: project.link ? (isRepository ? "Código aberto" : "Site no ar") : undefined,
    ...notes[normalize(project.link) ?? ""],
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
    return link !== stockRepository && link !== perolRepository;
  });

  // O Agendamento, primeiro projeto e o mais simples, fecha a lista: a ordem
  // termina mostrando de onde a evolução partiu.
  const ordered = [...otherProjects].sort(
    (a, b) =>
      Number(normalize(a.link) === roomsRepository) - Number(normalize(b.link) === roomsRepository),
  );

  return <ProjectsShowcase projects={[...featured, ...ordered.map(fromDatabase)]} />;
}
