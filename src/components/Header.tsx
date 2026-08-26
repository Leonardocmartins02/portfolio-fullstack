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
        <nav className="hidden gap-6 text-sm text-muted sm:flex">
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
      </div>
    </header>
  );
}
