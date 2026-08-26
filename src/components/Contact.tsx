"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/lib/data";

// "partial" = mensagem salva no banco, mas a notificacao por e-mail falhou.
type Status = "idle" | "loading" | "success" | "partial" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

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
        throw new Error(errorBody?.error ?? "Não foi possível enviar a mensagem.");
      }

      const payload = (await response.json().catch(() => ({}))) as {
        emailSent?: boolean;
      };

      // Falha para o lado honesto: so anuncia sucesso pleno se a API confirmar
      // que o e-mail saiu.
      setStatus(payload.emailSent === true ? "success" : "partial");
      form.reset();
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
              className="text-accent hover:underline"
            >
              LinkedIn
            </a>
          </p>
          <p>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              GitHub
            </a>
          </p>
          <p>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              WhatsApp
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-xs text-muted">
              Nome
            </label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-xs text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1 block text-xs text-muted">
              Mensagem
            </label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              rows={4}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
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
