"use client";

import { useState, type FormEvent } from "react";
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

  return (
    <section id="contato" className="mx-auto max-w-content px-6 py-16">
      <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-accent">
        Contato
      </h2>

      <div className="grid gap-10 sm:grid-cols-2">
        <div className="space-y-2 text-sm text-muted">
          <p>Prefere falar diretamente? Use um dos canais abaixo:</p>
          <p>
            <a href={`mailto:${profile.email}`} className="text-accent hover:underline">
              {profile.email}
            </a>
          </p>
          <p>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded text-accent hover:underline"
            >
              LinkedIn
            </a>
          </p>
          <p>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded text-accent hover:underline"
            >
              GitHub
            </a>
          </p>
          <p>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded text-accent hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          aria-busy={status === "loading"}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="mb-1 block text-xs text-muted">
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
              className="focus-ring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent"
            />
            {fieldErrors.name && (
              <p id="name-error" role="alert" className="mt-1 text-xs text-red-400">
                {fieldErrors.name.join(" ")}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-xs text-muted">
              Email <span aria-hidden="true">*</span>
              <span className="sr-only"> (obrigatório)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className="focus-ring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent"
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert" className="mt-1 text-xs text-red-400">
                {fieldErrors.email.join(" ")}
              </p>
            )}
          </div>
          <div>
            <div className="mb-1 flex items-baseline justify-between">
              <label htmlFor="message" className="block text-xs text-muted">
                Mensagem <span aria-hidden="true">*</span>
                <span className="sr-only"> (obrigatório)</span>
              </label>
              <span className="text-xs text-muted">
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
              className="focus-ring w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-accent"
            />
            {fieldErrors.message && (
              <p id="message-error" role="alert" className="mt-1 text-xs text-red-400">
                {fieldErrors.message.join(" ")}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "loading" && (
              <span
                aria-hidden="true"
                className="h-3 w-3 animate-spin rounded-full border-2 border-background/30 border-t-background"
              />
            )}
            {status === "loading" ? "Enviando..." : "Enviar mensagem"}
          </button>

          <div role="status" aria-live="polite">
            {status === "success" && (
              <p className="text-sm text-accent">Mensagem enviada com sucesso!</p>
            )}
            {status === "partial" && (
              <p className="text-sm text-amber-400">
                Recebi sua mensagem e ela já está registrada, mas a notificação
                por e-mail falhou. Se for urgente, fale comigo por um dos canais
                de contato desta seção.
              </p>
            )}
          </div>
          <div role="alert" aria-live="assertive">
            {status === "error" && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
