// GET: lista todos os projetos (usado na home publica e no painel admin).
// POST: cria um novo projeto (somente admin autenticado).
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// So aceita http/https - bloqueia esquemas perigosos como javascript:, data:, ftp:.
const httpUrl = z
  .string()
  .url()
  .refine((value) => /^https?:\/\//i.test(value), "URL deve comecar com http:// ou https://");

const projectSchema = z.object({
  title: z.string().min(2).max(160),
  category: z.string().min(2).max(60),
  description: z.string().min(10).max(2000),
  imageUrl: httpUrl.optional().or(z.literal("")),
  link: httpUrl.optional().or(z.literal("")),
  order: z.number().int().optional(),
});

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const project = await prisma.project.create({ data: parsed.data });
  return NextResponse.json(project, { status: 201 });
}
