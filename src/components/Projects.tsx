import type { Project } from "@prisma/client";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projetos" className="mx-auto max-w-content px-6 py-16">
      <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-accent">
        Projetos selecionados
      </h2>

      {projects.length === 0 ? (
        <p className="text-sm text-muted">
          Nenhum projeto cadastrado ainda. Faça login no{" "}
          <a href="/admin/login" className="text-accent underline">
            painel admin
          </a>{" "}
          para adicionar o primeiro.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-accent/60"
            >
              {project.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="h-44 w-full object-cover"
                />
              ) : null}
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
                  className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
                >
                  Ver projeto →
                </a>
              ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
