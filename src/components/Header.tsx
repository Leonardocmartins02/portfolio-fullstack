"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { profile } from "@/lib/data";
import { registerScrollController } from "@/lib/scroll-orchestrator";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#projetos", label: "Projetos" },
  { href: "#trajetoria", label: "Trajetória" },
  { href: "#skills", label: "Skills" },
  { href: "#contato", label: "Contato" },
];

// Linha de leitura que decide a página atual no menu (a mesma da Trajetória).
const READING_LINE = 0.45;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function close() {
    setIsOpen(false);
    toggleRef.current?.focus();
  }

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

  useEffect(() => {
    if (!isOpen) return;

    firstLinkRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !toggleRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header ref={headerRef} className="site-header sticky top-0 z-40">
      <div data-header-bar className="frame flex items-center justify-between py-3.5">
        <Link href="#inicio" className="site-header__brand focus-ring flex items-center gap-2.5 rounded-full">
          <span className="t-small font-semibold tracking-tight" translate="no">
            {profile.name}
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="t-small hidden gap-7 text-muted sm:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-page-link={link.href.slice(1)}
              className="nav-link focus-ring rounded transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="focus-ring t-small min-h-11 rounded-full px-3 font-semibold sm:hidden"
        >
          {isOpen ? "Fechar" : "Menu"}
        </button>
      </div>

      <nav
        id="mobile-menu"
        ref={panelRef}
        aria-label="Navegação principal (mobile)"
        aria-hidden={!isOpen}
        className={`frame flex origin-top flex-col gap-1 overflow-hidden transition-[max-height,opacity] motion-safe:duration-200 sm:hidden ${
          isOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        {links.map((link, index) => (
          <a
            key={link.href}
            ref={index === 0 ? firstLinkRef : undefined}
            href={link.href}
            data-page-link={link.href.slice(1)}
            onClick={close}
            tabIndex={isOpen ? 0 : -1}
            className="nav-link focus-ring t-lead rounded py-2 text-muted transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
