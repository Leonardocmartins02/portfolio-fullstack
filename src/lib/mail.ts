// Envio de e-mail de notificacao quando alguem preenche o formulario de contato.
//
// Usa a API HTTP do Resend (https://resend.com) em vez de SMTP: a Microsoft
// desativou permanentemente a autenticacao basica (usuario + senha / senha de
// aplicativo) no SMTP de contas pessoais Outlook.com/Hotmail, entao o envio via
// smtp-mail.outlook.com falha sempre com "535 5.7.139 Authentication
// unsuccessful, basic authentication is disabled".
//
// A API do Resend e' apenas um POST JSON, entao nao precisamos de nenhuma
// dependencia nova: o fetch nativo do Node 18+ / Next 14 basta.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type ContactNotificationInput = {
  name: string;
  email: string;
  message: string;
};

export type MailResult = { sent: boolean };

/** Escapa caracteres especiais para interpolar texto do usuario no corpo HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Remove quebras de linha para nao sujar o assunto do e-mail. */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function sendContactNotification(
  data: ContactNotificationInput
): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  // Sem dominio proprio verificado, o Resend so permite enviar a partir de
  // onboarding@resend.dev — e apenas para o e-mail dono da conta.
  const from = process.env.EMAIL_FROM || "Portfolio <onboarding@resend.dev>";
  const to = process.env.EMAIL_TO;

  if (!apiKey || !to) {
    console.warn(
      "[mail] RESEND_API_KEY ou EMAIL_TO ausentes no .env — notificacao nao enviada (a mensagem foi salva no banco normalmente)."
    );
    return { sent: false };
  }

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, "<br />");

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Novo contato pelo portfolio: ${singleLine(data.name)}`,
        text: `Nome: ${data.name}\nEmail: ${data.email}\n\nMensagem:\n${data.message}`,
        html:
          `<p><strong>Nome:</strong> ${safeName}</p>` +
          `<p><strong>Email:</strong> ${safeEmail}</p>` +
          `<p><strong>Mensagem:</strong></p>` +
          `<p>${safeMessage}</p>`,
      }),
      // 5s: a rota faz "await" deste envio, e funcoes serverless (Vercel Hobby)
      // sao encerradas em ~10s — um timeout maior seria morto pela plataforma
      // antes do nosso catch, devolvendo erro de rede ao visitante.
      signal: AbortSignal.timeout(5_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        `[mail] Resend respondeu ${response.status}: ${detail.slice(0, 500)}`
      );
      return { sent: false };
    }

    console.log("[mail] Notificacao de contato enviada com sucesso.");
    return { sent: true };
  } catch (error) {
    // O envio falho nao pode quebrar o formulario: a mensagem ja foi salva no
    // banco e continua visivel em /admin/dashboard.
    console.error("[mail] Falha ao enviar notificacao de contato:", error);
    return { sent: false };
  }
}
