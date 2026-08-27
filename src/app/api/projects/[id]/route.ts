// PUT: atualiza um projeto existente. DELETE: remove um projeto.
// Ambos exigem sessao de admin.
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

const projectUpdateSchema = z.object({
  title: z.string().min(2).max(160).optional(),
  category: z.string().min(2).max(60).optional(),
  description: z.string().min(10).max(2000).optional(),
  imageUrl: httpUrl.optional().or(z.literal("")),
  link: httpUrl.optional().or(z.literal("")),
  order: z.number().int().optional(),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const project = await prisma.project.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Projeto nao encontrado" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
  }

  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Projeto nao encontrado" }, { status: 404 });
  }
}
