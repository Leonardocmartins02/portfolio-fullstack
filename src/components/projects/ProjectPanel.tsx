import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

export type ProjectAction = {
  label: "Ver demonstração" | "Ver código" | "Ver site";
  href: string;
  external: boolean;
};

export type ProjectPanelData = {
  id: string;
  /** Nome curto usado nos nomes acessíveis das ações ("Ver código: SimpleStock"). */
  name: string;
  title: string;
  category: string;
  /** Um fato curto na mesma linha do nome ("Projeto principal", "Primeiro projeto"). */
  fact?: string;
  description: string;
  highlight?: { label: string; text: string };
  techs?: string[];
  /** alt vazio quando a imagem só repete o texto do painel. */
  image: { src: string; alt: string } | null;
  /** Demonstração em vídeo: toma o lugar da imagem e mantém a proporção original. */
  video?: { src: string; poster: string; width: number; height: number; label: string };
  actions: ProjectAction[];
};

// "React, Express e Vitest": lista em frase, sem caixas nem separadores.
function listInWords(items: string[]) {
  return items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

// Um painel de tela cheia: a linha do nome fica no mesmo lugar em todos, então
// a rolagem lê como virar pranchas de um livro. Os campos alternam o fundo e o elevado.
export function ProjectPanel({
  project,
  index,
  total,
  tone,
  loading,
}: {
  project: ProjectPanelData;
  index: number;
  total: number;
  tone: "raised" | "dark";
  loading: "lazy" | "eager";
}) {
  const headingId = `projeto-${project.id}`;
  const second = { "--i": 1 } as CSSProperties;

  return (
    <li
      className={`project-slot chapter chapter-${tone}`}
      data-chapter={tone}
      data-panel-index={index}
    >
      <article aria-labelledby={headingId} className="project">
        <div className="project__row" data-reveal>
          <p className="project__kind t-small text-muted">{project.category}</p>
          <h3 id={headingId} className="project__name t-lead font-semibold" translate="no">
            {project.title}
          </h3>
          <p className="project__fact t-small text-muted">
            <span className="sr-only">
              Projeto {index + 1} de {total}.{" "}
            </span>
            {project.fact}
          </p>
        </div>

        <div className="project__text space-y-4" data-reveal style={second}>
          <p className="t-body">{project.description}</p>
          {project.highlight ? (
            <p className="t-body">
              <span className="font-semibold">{project.highlight.label}:</span>{" "}
              {project.highlight.text}
            </p>
          ) : null}
          {project.techs?.length ? (
            <p className="t-small text-muted">Feito com {listInWords(project.techs)}.</p>
          ) : null}
          {project.actions.length ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              {project.actions.map((action, i) => {
                // A página do projeto (demonstração interna) é a ação principal.
                const primary = i === 0 && !action.external;
                const className = primary ? "button focus-ring" : "link focus-ring rounded t-body";
                const label = (
                  <>
                    {action.label}
                    <span className="sr-only">: {project.name}</span>
                    {action.external ? <span className="sr-only"> (abre em nova aba)</span> : null}
                  </>
                );
                return action.external ? (
                  <a
                    key={action.href}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {label}
                  </a>
                ) : (
                  <Link key={action.href} href={action.href} className={className}>
                    {label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        <figure
          className="project__picture"
          data-reveal="picture"
          style={
            project.video
              ? { ...second, aspectRatio: `${project.video.width} / ${project.video.height}` }
              : second
          }
        >
          {/* Sem som e em loop; o ProjectsShowcase toca só o vídeo do painel da vez. */}
          {project.video ? (
            <video
              muted
              loop
              playsInline
              controls
              preload={loading === "eager" ? "metadata" : "none"}
              width={project.video.width}
              height={project.video.height}
              poster={project.video.poster}
              aria-label={project.video.label}
            >
              <source src={project.video.src} type="video/webm" />
            </video>
          ) : project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={1600}
              height={1000}
              loading={loading}
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          ) : null}
        </figure>
      </article>
    </li>
  );
}
