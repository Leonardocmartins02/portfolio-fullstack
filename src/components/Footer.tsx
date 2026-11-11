import { ArrowUp } from "lucide-react";
import { profile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const pages = [
  { href: "#sobre", label: "Sobre" },
  { href: "#projetos", label: "Projetos" },
  { href: "#trajetoria", label: "Trajetória" },
  { href: "#contato", label: "Contato" },
];

// Assinatura final (footer-region do DESIGN.md, sobre o teal profundo): o nome
// em escala de display, contato e navegação em colunas, links em tinta atenuada.
export function Footer() {
  return (
    <footer data-chapter="dark" className="footer chapter chapter-dark">
      <p aria-hidden="true" className="footer__wordmark frame" data-reveal translate="no">
        {profile.name}
      </p>
      <div className="frame grid-12 gap-y-10 pb-8 pt-10 sm:pt-12">
        <ul className="col-span-12 space-y-2 sm:col-span-6 lg:col-span-6">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="link focus-ring t-body rounded-sm break-words"
              translate="no"
            >
              {profile.email}
            </a>
          </li>
          <li>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="link focus-ring t-body rounded-sm break-words"
            >
              WhatsApp
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </li>
        </ul>
        <nav aria-label="Páginas" className="col-span-12 sm:col-span-6 lg:col-span-5 lg:col-start-8">
          <ul className="t-body grid grid-cols-2 gap-y-2">
            {pages.map((page) => (
              <li key={page.href}>
                <a
                  href={page.href}
                  className="link focus-ring rounded-sm text-muted-foreground no-underline hover:underline"
                >
                  {page.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Separator className="col-span-12" />
        <div className="t-small col-span-12 flex flex-col-reverse gap-4 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}. Desenhado e codificado à mão.
          </p>
          <div className="-mx-4 flex flex-wrap items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="font-medium text-muted-foreground">
              <a href="/admin/login">Área administrativa</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="font-medium text-muted-foreground">
              <a href="#inicio">
                Voltar ao topo
                <ArrowUp
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out group-hover/button:-translate-y-0.5"
                />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
