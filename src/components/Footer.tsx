import { profile } from "@/lib/data";

const pages = [
  { href: "#sobre", label: "Sobre" },
  { href: "#projetos", label: "Projetos" },
  { href: "#trajetoria", label: "Trajetória" },
  { href: "#contato", label: "Contato" },
];

// Assinatura final em escala de leitura, com contato e navegação.
export function Footer() {
  return (
    <footer data-chapter="dark" className="footer chapter chapter-dark">
      <p aria-hidden="true" className="footer__wordmark frame" data-reveal translate="no">
        {profile.name}
      </p>
      <div className="frame grid-12 gap-y-10 pb-10 pt-10">
        <ul className="col-span-12 space-y-2 lg:col-span-6">
          <li>
            <a href={`mailto:${profile.email}`} className="link focus-ring t-body rounded break-words" translate="no">
              {profile.email}
            </a>
          </li>
          <li>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="link focus-ring t-body rounded break-words"
            >
              WhatsApp
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </li>
        </ul>
        <nav aria-label="Páginas" className="col-span-12 lg:col-span-5 lg:col-start-8">
          <ul className="t-body grid grid-cols-2 gap-y-2">
            {pages.map((page) => (
              <li key={page.href}>
                <a href={page.href} className="link focus-ring rounded">
                  {page.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="t-small col-span-12 flex flex-wrap justify-between gap-4 pt-6 text-muted">
          <p>
            © {new Date().getFullYear()} {profile.name}. Desenhado e codificado à mão.
          </p>
          <p className="flex gap-6">
            <a href="/admin/login" className="link focus-ring rounded">
              Área administrativa
            </a>
            <a href="#inicio" className="link focus-ring rounded">
              Voltar ao topo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
