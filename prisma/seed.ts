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
          title: "Sistema de Agendamento de Salas",
          category: "Full Stack",
          description:
            "Aplicacao web full-stack para gerenciamento e reserva de salas universitarias: cadastro, autenticacao e reserva com validacoes, backend em Python (Flask) e banco de dados relacional (SQLite) para controle de disponibilidade e horarios.",
          imageUrl: "",
          link: "https://github.com/Leonardocmartins02/Projeto-Agendamento-de-Salas",
          order: 1,
        },
        {
          title: "SimpleStock — Controle de Estoque",
          category: "Web",
          description:
            "Sistema de gerenciamento de inventario, com registro de movimentacoes e historico de produtos. Desenvolvimento priorizando responsividade, conversao de imagens para WebP, praticas modernas de acessibilidade (ARIA labels) e otimizacao de performance.",
          imageUrl: "",
          link: "https://github.com/Leonardocmartins02/Sistema-Estoque",
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
