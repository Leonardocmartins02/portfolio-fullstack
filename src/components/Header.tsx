"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { profile } from "@/lib/data";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#skills", label: "Skills" },
  { href: "#projetos", label: "Projetos" },
  { href: "#trajetoria", label: "Trajetória" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function close() {
    setIsOpen(false);
    toggleRef.current?.focus();
  }

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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link
          href="#"
          className="focus-ring flex items-center gap-2 rounded-full border border-border bg-surface/80 py-1 pl-1 pr-3"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/avatar.jpg"
            alt={profile.name}
            className="h-7 w-7 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-foreground">{profile.name}</span>
          <span className="h-2 w-2 rounded-full bg-accent" />
        </Link>

        <nav aria-label="Navegação principal" className="hidden gap-6 text-sm text-muted sm:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="focus-ring rounded transition-colors hover:text-foreground"
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
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          className="focus-ring flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-border sm:hidden"
        >
          <span
            className={`h-0.5 w-4 bg-foreground transition-transform ${
              isOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-4 bg-foreground transition-opacity ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`h-0.5 w-4 bg-foreground transition-transform ${
              isOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      <nav
        id="mobile-menu"
        ref={panelRef}
        aria-label="Navegação principal (mobile)"
        aria-hidden={!isOpen}
        className={`flex origin-top flex-col gap-1 overflow-hidden border-t border-border/60 bg-background px-6 transition-[max-height,opacity] motion-safe:duration-200 sm:hidden ${
          isOpen ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0"
        }`}
      >
        {links.map((link, index) => (
          <a
            key={link.href}
            ref={index === 0 ? firstLinkRef : undefined}
            href={link.href}
            onClick={close}
            tabIndex={isOpen ? 0 : -1}
            className="focus-ring rounded-lg px-2 py-3 text-base text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
