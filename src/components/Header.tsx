"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { profile } from "@/lib/data";
import { registerScrollController } from "@/lib/scroll-orchestrator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#projetos", label: "Projetos" },
  { href: "#trajetoria", label: "Trajetória" },
  { href: "#skills", label: "Skills" },
  { href: "#contato", label: "Contato" },
];

// Linha de leitura que decide a página atual no menu (a mesma da Trajetória).
const READING_LINE = 0.45;

// A seção de destino recebe o foco (sem rolar de novo), para o leitor de tela
// e o teclado continuarem dali.
function goToSection(hash: string) {
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  history.pushState(null, "", hash);
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  // Link escolhido no menu: a rolagem espera o Sheet fechar e soltar a trava
  // de rolagem da página, senão a âncora não anda.
  const pendingHash = useRef<string | null>(null);

  // A barra toma o campo do capítulo que passa embaixo dela (fundo, elevado ou azul),
  // marca no menu a página que está sendo lida e só mostra o nome depois que o
  // nome grande do início sai de baixo dela.
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const navLinks = Array.from(header.querySelectorAll<HTMLAnchorElement>("[data-page-link]"));
    let tone = "dark";
    let current: string | null = null;
    let brand = true;

    const unregister = registerScrollController({
      element: header,
      measure() {},
      read(frame) {
        const chapters = document.querySelectorAll<HTMLElement>("[data-chapter]");
        const below = frame.headerOffset + 1;
        // O último na ordem do documento é o que está pintado por cima (painéis
        // que sobem, a seção que cobre o hero).
        chapters.forEach((chapter) => {
          const rect = chapter.getBoundingClientRect();
          if (rect.top <= below && rect.bottom > below) tone = chapter.dataset.chapter ?? tone;
        });
        const line = frame.headerOffset + READING_LINE * (frame.viewportHeight - frame.headerOffset);
        current = null;
        for (const link of links) {
          const section = document.getElementById(link.href.slice(1));
          const rect = section?.getBoundingClientRect();
          if (rect && rect.top <= line && rect.bottom > line) current = link.href.slice(1);
        }
        const headline = document.querySelector(".hero__headline");
        brand = !headline || headline.getBoundingClientRect().bottom <= frame.headerOffset;
      },
      write() {
        // Atributo (e não classe): o React controla o className do <header>.
        if (header.dataset.tone !== tone) header.dataset.tone = tone;
        if (brand !== ("brand" in header.dataset)) {
          if (brand) header.dataset.brand = "";
          else delete header.dataset.brand;
        }
        for (const link of navLinks) {
          if (link.dataset.pageLink === current) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        }
      },
    });
    return () => {
      unregister();
      for (const link of navLinks) link.removeAttribute("aria-current");
      delete header.dataset.brand;
    };
  }, []);

  const desktopLinks = links.slice(0, -1);
  const contact = links[links.length - 1];

  return (
    <header ref={headerRef} className="site-header sticky top-0 z-40">
      <div data-header-bar className="frame flex h-16 items-center justify-between gap-4">
        <Link
          href="#inicio"
          className="site-header__brand focus-ring -mx-2 flex items-center rounded-md px-2 py-1.5"
        >
          <span className="text-[15px] font-semibold tracking-tight" translate="no">
            {profile.name}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
            {desktopLinks.map((link) => (
              <Button
                key={link.href}
                asChild
                variant="ghost"
                size="sm"
                className="nav-link px-3 text-sm font-medium text-muted-foreground hover:bg-accent/70 hover:text-foreground"
              >
                <a href={link.href} data-page-link={link.href.slice(1)}>
                  {link.label}
                </a>
              </Button>
            ))}
          </nav>

          {/* A pílula verde de ação da barra (o "Try Free" do DESIGN.md). */}
          <Button asChild size="sm" className="ml-1 hidden min-[360px]:inline-flex">
            <a href={contact.href} data-page-link={contact.href.slice(1)}>
              Fale comigo
              <ArrowRight
                aria-hidden="true"
                className="transition-transform duration-200 ease-out group-hover/button:translate-x-0.5"
              />
            </a>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu">
                <Menu className="!size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              closeLabel="Fechar menu"
              className="px-[var(--margin)] pb-8 pt-3"
              onCloseAutoFocus={(event) => {
                const hash = pendingHash.current;
                if (!hash) return;
                event.preventDefault();
                pendingHash.current = null;
                requestAnimationFrame(() => goToSection(hash));
              }}
            >
              <SheetHeader className="flex h-11 justify-center pr-14">
                <SheetTitle translate="no">{profile.name}</SheetTitle>
                <SheetDescription className="sr-only">Seções da página</SheetDescription>
              </SheetHeader>
              <nav aria-label="Navegação principal (mobile)" className="mt-4 flex flex-col">
                {links.map((link, i) => (
                  <a
                    key={link.href}
                    href={link.href}
                    data-page-link={link.href.slice(1)}
                    onClick={(event) => {
                      event.preventDefault();
                      pendingHash.current = link.href;
                      setIsOpen(false);
                    }}
                    style={{ animationDelay: `${80 + i * 40}ms` }}
                    className={cn(
                      "focus-ring flex min-h-14 items-center justify-between rounded-md border-b border-border text-xl font-medium text-muted-foreground transition-colors hover:text-foreground",
                      "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-right-4 motion-safe:fill-mode-both motion-safe:duration-500",
                    )}
                  >
                    {link.label}
                    <ArrowRight aria-hidden="true" className="size-5 opacity-60" />
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
