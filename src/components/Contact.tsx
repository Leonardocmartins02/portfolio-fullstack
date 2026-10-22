"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { profile } from "@/lib/data";

// "partial" = mensagem salva no banco, mas a notificacao por e-mail falhou.
type Status = "idle" | "loading" | "success" | "partial" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string[]>>;

const MESSAGE_MAX_LENGTH = 4000;

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [messageLength, setMessageLength] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setFieldErrors({});

    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        if (errorBody?.details) {
          setFieldErrors(errorBody.details as FieldErrors);
          const firstInvalid = (["name", "email", "message"] as const).find(
            (field) => errorBody.details[field]?.length,
          );
          if (firstInvalid) {
            (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
          }
        }
        throw new Error(errorBody?.error ?? "Não foi possível enviar a mensagem.");
      }

      const payload = (await response.json().catch(() => ({}))) as {
        emailSent?: boolean;
      };

      // Falha para o lado honesto: so anuncia sucesso pleno se a API confirmar
      // que o e-mail saiu.
      setStatus(payload.emailSent === true ? "success" : "partial");
      form.reset();
      setMessageLength(0);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Erro inesperado.");
    }
  }

  const [user, domain] = profile.email.split("@");
  const channels = [
    { label: "LinkedIn", href: profile.linkedin },
    { label: "GitHub", href: profile.github },
    { label: "WhatsApp", href: profile.whatsapp },
  ];

  // Capítulo claro de fechamento: o convite e o formulário em cima, o e-mail como
  // tipografia grande embaixo, os canais nos cantos.
  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      data-chapter="blue"
      className="chapter chapter-blue"
    >
      <div className="frame grid-12 gap-y-16 py-[var(--section-gap)]">
        <div className="col-span-12 lg:col-span-5">
          <h2 id="contato-titulo" data-reveal className="t-title">
            Vamos conversar
          </h2>
          <p data-reveal style={{ "--i": 1 } as CSSProperties} className="t-lead mt-6 max-w-[24ch]">
            Para uma vaga, um projeto ou uma conversa sobre tecnologia.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          aria-busy={status === "loading"}
          data-reveal
          style={{ "--i": 2 } as CSSProperties}
          className="col-span-12 space-y-6 lg:col-span-6 lg:col-start-7"
        >
          <div>
            <label htmlFor="name" className="t-small block text-muted">
              Nome <span aria-hidden="true">*</span>
              <span className="sr-only"> (obrigatório)</span>
            </label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              autoComplete="name"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              className="field"
            />
            {fieldErrors.name && (
              <p id="name-error" role="alert" className="t-small mt-1 text-foreground">
                {fieldErrors.name.join(" ")}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="t-small block text-muted">
              E-mail <span aria-hidden="true">*</span>
              <span className="sr-only"> (obrigatório)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className="field"
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert" className="t-small mt-1 text-foreground">
                {fieldErrors.email.join(" ")}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="message" className="t-small block text-muted">
                Mensagem <span aria-hidden="true">*</span>
                <span className="sr-only"> (obrigatório)</span>
              </label>
              <span className="t-small tabular-nums text-muted">
                {messageLength}/{MESSAGE_MAX_LENGTH}
              </span>
            </div>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={MESSAGE_MAX_LENGTH}
              rows={4}
              onChange={(event) => setMessageLength(event.target.value.length)}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? "message-error" : undefined}
              className="field resize-y"
            />
            {fieldErrors.message && (
              <p id="message-error" role="alert" className="t-small mt-1 text-foreground">
                {fieldErrors.message.join(" ")}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="button focus-ring disabled:opacity-60"
          >
            {status === "loading" && (
              <span
                aria-hidden="true"
                className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
            )}
            {status === "loading" ? "Enviando…" : "Enviar mensagem"}
          </button>

          <div role="status" aria-live="polite">
            {status === "success" && <p className="t-body">Mensagem enviada com sucesso!</p>}
            {status === "partial" && (
              <p className="t-body">
                Recebi sua mensagem e ela já está registrada, mas a notificação por e-mail
                falhou. Se for urgente, fale comigo por um dos canais desta seção.
              </p>
            )}
          </div>
          <div role="alert" aria-live="assertive">
            {status === "error" && <p className="t-body text-foreground">{errorMessage}</p>}
          </div>
        </form>

        <div className="col-span-12 space-y-10">
          <a
            href={`mailto:${profile.email}`}
            data-reveal
            className="contact__email link focus-ring rounded no-underline"
            translate="no"
          >
            {user}@
            <wbr />
            {domain}
          </a>
          <div className="t-small flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-muted">{profile.location}, presencial ou remoto</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link focus-ring rounded"
                  >
                    {channel.label}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
