import Image from "next/image";
import Link from "next/link";
import type { Project } from "@prisma/client";

export function Projects({ projects }: { projects: Project[] }) {
  const stockRepository = "https://github.com/Leonardocmartins02/Sistema-Estoque-main";
  const perolRepository = "https://github.com/Leonardocmartins02/pixel-perfect-replica";
  // Projetos com apresentação própria no código não se repetem na lista que vem do banco.
  const otherProjects = projects.filter((project) => {
    const link = project.link?.replace(/\.git$|\/$/g, "");
    return link !== stockRepository && link !== perolRepository;
  });

  return (
    <section id="projetos" className="mx-auto max-w-content px-6 py-16">
      <span className="text-sm font-medium uppercase tracking-widest text-accent">
        Projetos selecionados
      </span>
      <h2 className="mb-6 mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
        Projetos em destaque
      </h2>

      <article className="mb-8 overflow-hidden rounded-2xl border border-accent/40 bg-surface lg:grid lg:grid-cols-2">
        <Image
          src="/projects/simplestock-v2-dashboard.png"
          alt="SimpleStock: dashboard da nova interface com indicadores, evolução do estoque e produtos para repor"
          width={1440}
          height={900}
          className="h-auto w-full self-center"
        />
        <div className="p-6 sm:p-8">
          <span className="text-xs font-medium uppercase tracking-wide text-accent">Projeto principal · Full Stack</span>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">SimpleStock — sistema de estoque</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Controle de produtos, entradas, saídas e ajustes de inventário, com histórico
            para acompanhar como o saldo mudou. Desenvolvi a interface, a API e a
            persistência em um monorepo TypeScript.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Desafio técnico: impedir saídas simultâneas de consumirem o mesmo saldo.
            A API usa transações e bloqueio de linha no PostgreSQL para validar e
            registrar cada movimentação.
          </p>
          <p className="mt-4 text-xs leading-relaxed text-accent">React · Express · TypeScript · Prisma · PostgreSQL · Vitest</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/projetos/simplestock" className="focus-ring rounded text-sm font-medium text-accent hover:underline">Ver demonstração →</Link>
            <a href={stockRepository} target="_blank" rel="noopener noreferrer" className="focus-ring rounded text-sm font-medium text-accent hover:underline">Ver código ↗</a>
          </div>
        </div>
      </article>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/60">
          <Image
            src="/projects/perol-capa.png"
            alt="Landing page Perol no navegador, com galeria e kits do F5 Flotador, e no celular, com o Lavix"
            width={640}
            height={176}
            className="h-44 w-full object-cover"
          />
          <div className="p-6">
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              Landing page · Front-end
            </span>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              Perol: landing page de produtos de limpeza
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Página de venda do F5 Flotador e do Lavix para campanhas de anúncio: troca de
              produto, galeria por volume, kits com preço por litro e guia por ambiente. Fiz o
              código; as artes são de um parceiro. React, TanStack Start e Tailwind CSS.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link href="/projetos/perol" className="focus-ring rounded text-sm font-medium text-accent hover:underline">
                Ver demonstração →
              </Link>
              <a
                href={perolRepository}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver código: Perol"
                className="focus-ring rounded text-sm font-medium text-accent hover:underline"
              >
                Ver código ↗
              </a>
            </div>
          </div>
        </article>
        {otherProjects.map((project) => (
          <article
            key={project.id}
            className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/60"
          >
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                width={640}
                height={176}
                className="h-44 w-full object-cover"
              />
            ) : (
              <div className="flex h-44 w-full items-center justify-center bg-surface/60 text-xs text-muted">
                Sem imagem
              </div>
            )}
            <div className="p-6">
              <span className="text-xs font-medium uppercase tracking-wide text-accent">
                {project.category}
              </span>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
              {project.link ? (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.link.startsWith("https://github.com/") ? "Ver código" : "Ver demonstração"}: ${project.title}`}
                  className="focus-ring mt-4 inline-block rounded text-sm font-medium text-accent hover:underline"
                >
                  {project.link.startsWith("https://github.com/") ? "Ver código ↗" : "Ver demonstração ↗"}
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
