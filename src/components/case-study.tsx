import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MediaFrame } from "@/components/media-frame";

// Peças das páginas de projeto (/projetos/*). Cada bloco entra em sequência
// (.rise-in com --i); as capturas mostram o Skeleton até carregar.

const order = (i: number) => ({ "--i": i }) as CSSProperties;

export type Screen = { src: string; alt: string; caption: string };

/** Barra do topo: volta aos projetos e leva ao contato, na mesma grade da home. */
export function CaseStudyBar() {
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="page flex h-16 items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="-ml-3 px-3 text-sm font-medium">
          <Link href="/#projetos">
            <ArrowLeft
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-hover/button:-translate-x-0.5"
            />
            Voltar aos projetos
          </Link>
        </Button>
        <span className="hidden text-[15px] font-semibold tracking-tight sm:block" translate="no">
          {profile.name}
        </span>
        <Button asChild size="sm">
          <Link href="/#contato">
            Fale comigo
            <ArrowRight
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-hover/button:translate-x-0.5"
            />
          </Link>
        </Button>
      </div>
    </header>
  );
}

export function CaseStudyIntro({
  tags,
  title,
  children,
  links,
}: {
  tags: string[];
  title: string;
  children: ReactNode;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="pt-10 sm:pt-16">
      <ul className="rise-in flex flex-wrap gap-2" style={order(0)}>
        {tags.map((tag, i) => (
          <li key={tag}>
            <Badge variant={i === 0 ? "soft" : "secondary"}>{tag}</Badge>
          </li>
        ))}
      </ul>
      <h1
        className="rise-in mt-5 max-w-[22ch] text-[clamp(32px,4.4vw,56px)] font-medium leading-[1.12] tracking-[-0.02em]"
        style={order(1)}
      >
        {title}
      </h1>
      <p
        className="rise-in t-lead mt-6 max-w-[62ch] text-muted-foreground"
        style={order(2)}
      >
        {children}
      </p>
      <div className="rise-in mt-8 flex flex-wrap gap-3" style={order(3)}>
        {links.map((link, i) => (
          <Button key={link.href} asChild variant={i === 0 ? "default" : "outline"}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
              <ArrowUpRight
                aria-hidden="true"
                className="transition-transform duration-200 ease-out group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
              />
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}

/** Título de bloco, com a mesma escala em todas as páginas. */
export function CaseStudyHeading({
  children,
  index = 0,
  id,
}: {
  children: ReactNode;
  index?: number;
  id?: string;
}) {
  return (
    <h2
      id={id}
      className="rise-in text-[clamp(24px,2.6vw,36px)] font-medium leading-tight tracking-[-0.015em]"
      style={order(index)}
    >
      {children}
    </h2>
  );
}

export function CaseStudyVideo({
  src,
  poster,
  label,
  note,
  steps,
}: {
  src: string;
  poster: string;
  label: string;
  note: string;
  steps: string[];
}) {
  return (
    <section aria-labelledby="demonstracao" className="mt-16 sm:mt-20">
      <CaseStudyHeading id="demonstracao" index={4}>
        Demonstração do fluxo
      </CaseStudyHeading>
      <Card className="rise-in mt-6 overflow-hidden rounded-xl" style={order(5)}>
        <MediaFrame poster={poster} className="aspect-[4/3]">
          <video
            controls
            preload="metadata"
            poster={poster}
            className="block size-full object-contain"
            aria-label={label}
          >
            <source src={src} type="video/webm" />
            Seu navegador não reproduz este vídeo. <a href={src}>Baixar demonstração</a>.
          </video>
        </MediaFrame>
      </Card>
      <p className="t-small mt-3 text-muted-foreground">{note}</p>
      <ol className="mt-8 grid gap-3 md:grid-cols-2">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-4 rounded-lg border border-border bg-card p-4 sm:p-5">
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[13px] font-semibold tabular-nums text-primary"
            >
              {i + 1}
            </span>
            <span className="t-small pt-0.5 text-foreground/90">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CaseStudyNotes({ notes }: { notes: { title: string; body: string }[] }) {
  return (
    <div className="mt-16 grid gap-4 sm:mt-20 md:grid-cols-2">
      {notes.map((note) => (
        <Card key={note.title} className="card-hover p-6 sm:p-8">
          <h2 className="text-[22px] font-medium leading-snug">{note.title}</h2>
          <p className="t-body mt-3 leading-relaxed text-muted-foreground">{note.body}</p>
        </Card>
      ))}
    </div>
  );
}

export function ScreenGallery({
  title,
  desktop,
  mobile,
}: {
  title: string;
  desktop: Screen[];
  mobile: Screen[];
}) {
  return (
    <section className="mt-16 sm:mt-20">
      <h2 className="text-[clamp(24px,2.6vw,36px)] font-medium leading-tight tracking-[-0.015em]">
        {title}
      </h2>
      <div className="mt-6 grid gap-x-6 gap-y-8 md:grid-cols-2">
        {desktop.map((screen) => (
          <figure key={screen.src}>
            <MediaFrame className="aspect-[16/10] overflow-hidden rounded-lg border border-border">
              <Image
                src={screen.src}
                alt={screen.alt}
                width={1440}
                height={900}
                sizes="(min-width: 1344px) 628px, (min-width: 768px) 50vw, 100vw"
                className="size-full object-cover object-top"
              />
            </MediaFrame>
            <figcaption className="t-small mt-3 text-muted-foreground">{screen.caption}</figcaption>
          </figure>
        ))}
      </div>
      <Separator className="my-10" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {mobile.map((screen) => (
          <figure key={screen.src}>
            <MediaFrame className="aspect-[390/844] overflow-hidden rounded-xl border border-border">
              <Image
                src={screen.src}
                alt={screen.alt}
                width={390}
                height={844}
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                className="size-full object-cover object-top"
              />
            </MediaFrame>
            <figcaption className="t-small mt-3 text-muted-foreground">{screen.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/** Moldura das páginas de projeto: barra do topo e conteúdo na grade da home. */
export function CaseStudyPage({ children }: { children: ReactNode }) {
  return (
    <>
      <CaseStudyBar />
      <main id="main" className="page pb-[var(--section-gap)]">
        {children}
      </main>
    </>
  );
}
