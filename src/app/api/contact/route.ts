// API do formulario de contato publico.
// Valida os dados com zod e salva a mensagem no banco.
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/mail";

const contactSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(120),
  email: z.string().email("Email invalido"),
  message: z.string().min(10, "Mensagem muito curta").max(4000),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados invalidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const message = await prisma.contactMessage.create({
    data: parsed.data,
  });

  // O e-mail e' "melhor esforco": se falhar, a mensagem ja esta salva no banco
  // e continua visivel em /admin/dashboard. Ainda assim devolvemos o resultado
  // ao cliente, para nao exibir um sucesso falso ao visitante.
  const mail = await sendContactNotification(parsed.data);

  return NextResponse.json(
    { id: message.id, emailSent: mail.sent },
    { status: 201 }
  );
}
