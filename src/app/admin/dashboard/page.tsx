import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { MessagesList } from "@/components/admin/MessagesList";
import { SignOutButton } from "@/components/admin/SignOutButton";

// Server Component protegido pelo middleware (src/middleware.ts).
// getServerSession aqui garante que so renderizamos dados se houver sessao.
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  const [projects, messages] = await Promise.all([
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <main id="main" className="page py-10 sm:py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rise-in">
        <div>
          <h1 className="text-[28px] font-medium leading-tight tracking-[-0.01em]">
            Painel administrativo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Logado como {session?.user?.email}</p>
        </div>
        <SignOutButton />
      </div>

      <section aria-labelledby="admin-projetos" className="mb-14">
        <h2
          id="admin-projetos"
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary"
        >
          Projetos
        </h2>
        <ProjectManager initialProjects={projects} />
      </section>

      <section aria-labelledby="admin-mensagens">
        <h2
          id="admin-mensagens"
          className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary"
        >
          Mensagens recebidas ({messages.length})
        </h2>
        <MessagesList messages={messages} />
      </section>
    </main>
  );
}
