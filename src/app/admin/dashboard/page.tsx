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
    <main className="mx-auto max-w-content px-6 py-12">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Painel administrativo</h1>
          <p className="text-sm text-muted">Logado como {session?.user?.email}</p>
        </div>
        <SignOutButton />
      </div>

      <section className="mb-14">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
          Projetos
        </h2>
        <ProjectManager initialProjects={projects} />
      </section>

      <section>
        <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
          Mensagens recebidas ({messages.length})
        </h2>
        <MessagesList messages={messages} />
      </section>
    </main>
  );
}
