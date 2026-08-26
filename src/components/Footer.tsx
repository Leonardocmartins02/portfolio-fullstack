import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. Desenhado e codificado à mão.
        </p>
        <p>
          <a href="/admin/login" className="hover:text-foreground">
            Área administrativa
          </a>
        </p>
      </div>
    </footer>
  );
}
