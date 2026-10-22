import Image from "next/image";
import Link from "next/link";

export type ProjectAction = {
  label: "Ver demonstração" | "Ver código";
  href: string;
  external: boolean;
};

export type ProjectPanelData = {
  id: string;
  /** Nome curto usado nos nomes acessíveis das ações ("Ver código: SimpleStock"). */
  name: string;
  title: string;
  category: string;
  badge?: string;
  description: string;
  highlight?: { label: string; text: string };
  techs?: string[];
  /** alt vazio quando a imagem só repete o texto do painel. */
  image: { src: string; alt: string } | null;
  actions: ProjectAction[];
  featured?: boolean;
};

const actionClass =
  "focus-ring inline-flex items-center gap-1 rounded text-sm font-medium text-accent-text underline decoration-accent-text/40 underline-offset-4 transition-colors hover:decoration-accent-text";

export function ProjectPanel({
  project,
  headingId,
  loading,
}: {
  project: ProjectPanelData;
  headingId: string;
  loading: "lazy" | "eager";
}) {
  return (
    <article
      aria-labelledby={headingId}
      className={`project-panel ${project.featured ? "border-accent/40" : "border-border"}`}
    >
      <div className="project-panel__layout">
        <div className="project-panel__media">
          <div className="project-panel__frame">
            {project.image ? (
              <Image
                src={project.image.src}
                alt={project.image.alt}
                fill
                loading={loading}
                sizes="(min-width: 64rem) 600px, 92vw"
                className="object-contain"
              />
            ) : (
              <span className="text-xs text-muted">Sem imagem</span>
            )}
          </div>
        </div>

        <div className="project-panel__body">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-xs font-medium uppercase tracking-wide text-accent-text">
              {project.category}
            </span>
            {project.badge ? (
              <span className="rounded-full border border-accent/50 px-2.5 py-0.5 text-xs font-medium text-foreground">
                {project.badge}
              </span>
            ) : null}
          </p>
          <h3
            id={headingId}
            className="mt-3 text-xl font-semibold leading-snug text-foreground md:text-2xl"
          >
            {project.title}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-muted">{project.description}</p>
          {project.highlight ? (
            <p className="mt-3 text-base leading-relaxed text-muted">
              <span className="font-medium text-foreground">{project.highlight.label}:</span>{" "}
              {project.highlight.text}
            </p>
          ) : null}
          {project.techs?.length ? (
            <ul aria-label="Tecnologias" className="mt-4 flex flex-wrap gap-2">
              {project.techs.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground/85"
                >
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3 pt-6">
            {project.actions.map((action) =>
              action.external ? (
                <a
                  key={action.href}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={actionClass}
                >
                  {action.label}
                  <span className="sr-only">: {project.name}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <Link key={action.href} href={action.href} className={actionClass}>
                  {action.label}
                  <span className="sr-only">: {project.name}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
