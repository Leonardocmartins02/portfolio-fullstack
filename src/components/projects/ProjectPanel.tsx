import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaFrame } from "@/components/media-frame";

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
  /** Endereço mostrado na barra da janela que emoldura a captura ("chadbb.online"). */
  url?: string;
  actions: ProjectAction[];
};

// Um painel de tela cheia: a linha do nome fica no mesmo lugar em todos, então
// a rolagem lê como virar pranchas de um livro. Os campos alternam o fundo e o elevado.
export function ProjectPanel({
  project,
  index,
  total,
  tone,
  loading,
  cover,
}: {
  project: ProjectPanelData;
  index: number;
  total: number;
  tone: "raised" | "dark";
  loading: "lazy" | "eager";
  /** View timeline do marco do painel seguinte, que cobre este (ausente no último). */
  cover?: string;
}) {
  const headingId = `projeto-${project.id}`;
  const second = { "--i": 1 } as CSSProperties;

  return (
    <li
      className={`project-slot chapter chapter-${tone}`}
      data-chapter={tone}
      data-panel-index={index}
      data-cover={cover ? "" : undefined}
      style={cover ? ({ "--cover": cover } as CSSProperties) : undefined}
    >
      <article aria-labelledby={headingId} className="project">
        <div className="project__row" data-reveal>
          <p className="project__kind">
            <Badge variant="soft">{project.category}</Badge>
          </p>
          <h3 id={headingId} className="project__name t-lead font-semibold" translate="no">
            {project.title}
          </h3>
          <p className="project__fact t-small text-muted-foreground">
            <span className="sr-only">
              Projeto {index + 1} de {total}.{" "}
            </span>
            {project.fact}
          </p>
        </div>

        <div className="project__text space-y-4" data-reveal style={second}>
          <p className="t-body text-foreground/90">{project.description}</p>
          {project.highlight ? (
            <p className="t-small border-l-2 border-primary/70 pl-4 text-muted-foreground">
              <span className="font-semibold text-foreground">{project.highlight.label}:</span>{" "}
              {project.highlight.text}
            </p>
          ) : null}
          {project.techs?.length ? (
            <div>
              <p className="sr-only">Feito com:</p>
              <ul className="flex flex-wrap gap-1.5">
                {project.techs.map((tech) => (
                  <li key={tech}>
                    <Badge variant="secondary" className="font-medium">
                      {tech}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.actions.length ? (
            // No celular os dois botões não cabem lado a lado (~270px úteis): ficam
            // empilhados em largura total, com o mesmo alvo de toque de 44px.
            <div className="grid gap-3 pt-2 sm:flex sm:flex-wrap sm:items-center">
              {project.actions.map((action, i) => {
                // A página do projeto (demonstração interna) é a ação principal.
                const primary = i === 0 && !action.external;
                const Icon = action.external ? ArrowUpRight : ArrowRight;
                const label = (
                  <>
                    {action.label}
                    <span className="sr-only">: {project.name}</span>
                    {action.external ? <span className="sr-only"> (abre em nova aba)</span> : null}
                    <Icon
                      aria-hidden="true"
                      className={
                        action.external
                          ? "transition-transform duration-200 ease-out group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                          : "transition-transform duration-200 ease-out group-hover/button:translate-x-0.5"
                      }
                    />
                  </>
                );
                return (
                  <Button key={action.href} asChild variant={primary ? "default" : "outline"}>
                    {action.external ? (
                      <a href={action.href} target="_blank" rel="noopener noreferrer">
                        {label}
                      </a>
                    ) : (
                      <Link href={action.href}>{label}</Link>
                    )}
                  </Button>
                );
              })}
            </div>
          ) : null}
        </div>

        {/* A captura fica numa janela de navegador: barra com o endereço e a
            proporção original do vídeo na área de baixo. */}
        <figure className="project__picture" data-reveal="picture" style={second}>
          <div className="project__window-bar" aria-hidden="true">
            <span className="project__window-dots">
              <span />
              <span />
              <span />
            </span>
            {project.url ? <span className="project__window-url">{project.url}</span> : null}
          </div>
          <MediaFrame
            className="project__window-view"
            poster={project.video?.poster}
            style={
              project.video
                ? { aspectRatio: `${project.video.width} / ${project.video.height}` }
                : undefined
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
          </MediaFrame>
        </figure>
      </article>
      {/* Escurece o painel enquanto o seguinte sobe. Elemento próprio (e não
          ::after com variável) para a opacidade ser só composição, sem
          recalcular o estilo do painel inteiro a cada quadro. */}
      <span className="project-slot__shade" aria-hidden="true" />
    </li>
  );
}
