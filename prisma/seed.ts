// Popula o banco com dados iniciais: um usuario admin e projetos de exemplo.
// Rode com: npm run db:seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "mudeesta123";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
    },
  });

  console.log(`Admin pronto -> login: ${adminEmail} / senha: ${adminPassword}`);

  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "Portfólio full stack",
          category: "Full Stack",
          description:
            "Este portfolio: Next.js 14, TypeScript, Tailwind, Prisma e NextAuth, com painel administrativo proprio e formulario de contato integrado.",
          imageUrl: "",
          link: "https://github.com/Leonardocmartins02/portfolio-fullstack",
          order: 0,
        },
        {
          title: "Sistema de estoque",
          category: "Full Stack",
          description:
            "Monorepo para gestao de estoque com backend, frontend e pacotes compartilhados em TypeScript, usando Prisma no acesso a dados.",
          imageUrl: "",
          link: "https://github.com/Leonardocmartins02/Sistema-Estoque-main",
          order: 1,
        },
        {
          title: "Agendamento de salas",
          category: "Backend",
          description:
            "Aplicacao web para gerenciar reservas de salas em uma universidade, com backend em Flask e SQLAlchemy e frontend em HTML, CSS e JavaScript.",
          imageUrl: "",
          link: "https://github.com/Leonardocmartins02/Projeto-Agendamento-de-Salas",
          order: 2,
        },
      ],
    });
    console.log("Projetos de exemplo criados.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
