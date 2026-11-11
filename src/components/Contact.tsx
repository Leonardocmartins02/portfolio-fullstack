"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Info, Loader2, Send } from "lucide-react";
import { profile } from "@/lib/data";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

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

  // Capítulo verde de fechamento (cta-banner do DESIGN.md): o convite e o
  // formulário em cima, o e-mail como tipografia grande embaixo, os canais nos cantos.
  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      data-chapter="green"
      className="chapter chapter-green"
    >
      <div className="frame grid-12 gap-y-12 py-[var(--section-gap)] lg:gap-y-16">
        <div className="col-span-12 lg:col-span-5">
          <h2 id="contato-titulo" data-reveal className="t-title">
            Vamos conversar
          </h2>
          <p
            data-reveal
            style={{ "--i": 1 } as CSSProperties}
            className="t-lead mt-5 max-w-[26ch] text-muted-foreground"
          >
            Para uma vaga, um projeto ou uma conversa sobre tecnologia.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          aria-busy={status === "loading"}
          data-reveal
          style={{ "--i": 2 } as CSSProperties}
          className="col-span-12 grid gap-5 lg:col-span-6 lg:col-start-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">
                Nome <span aria-hidden="true">*</span>
                <span className="sr-only"> (obrigatório)</span>
              </Label>
              <Input
                id="name"
                name="name"
                required
                minLength={2}
                autoComplete="name"
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
              {fieldErrors.name && (
                <FieldError id="name-error">{fieldErrors.name.join(" ")}</FieldError>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">
                E-mail <span aria-hidden="true">*</span>
                <span className="sr-only"> (obrigatório)</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                spellCheck={false}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <FieldError id="email-error">{fieldErrors.email.join(" ")}</FieldError>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <Label htmlFor="message">
                Mensagem <span aria-hidden="true">*</span>
                <span className="sr-only"> (obrigatório)</span>
              </Label>
              <span className="text-[13px] tabular-nums text-muted-foreground">
                {messageLength}/{MESSAGE_MAX_LENGTH}
              </span>
            </div>
            <Textarea
              id="message"
              name="message"
              required
              minLength={10}
              maxLength={MESSAGE_MAX_LENGTH}
              rows={5}
              onChange={(event) => setMessageLength(event.target.value.length)}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? "message-error" : undefined}
              className="resize-y"
            />
            {fieldErrors.message && (
              <FieldError id="message-error">{fieldErrors.message.join(" ")}</FieldError>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Button type="submit" size="lg" disabled={status === "loading"} className="w-full sm:w-auto">
              {status === "loading" ? (
                <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
              ) : (
                <Send
                  aria-hidden="true"
                  className="transition-transform duration-200 ease-out group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                />
              )}
              {status === "loading" ? "Enviando…" : "Enviar mensagem"}
            </Button>
          </div>

          <div role="status" aria-live="polite">
            {status === "success" && (
              <Alert variant="success">
                <CheckCircle2 aria-hidden="true" />
                <AlertDescription>Mensagem enviada com sucesso!</AlertDescription>
              </Alert>
            )}
            {status === "partial" && (
              <Alert>
                <Info aria-hidden="true" />
                <AlertDescription>
                  Recebi sua mensagem e ela já está registrada, mas a notificação por e-mail
                  falhou. Se for urgente, fale comigo por um dos canais desta seção.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div role="alert" aria-live="assertive">
            {status === "error" && (
              <Alert variant="destructive">
                <AlertCircle aria-hidden="true" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        </form>

        <div className="col-span-12 space-y-8">
          <a
            href={`mailto:${profile.email}`}
            data-reveal
            className="contact__email link focus-ring rounded-md no-underline"
            translate="no"
          >
            {user}@
            <wbr />
            {domain}
          </a>
          <Separator className="bg-foreground/20" />
          <div className="t-small flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground">{profile.location}, presencial ou remoto</p>
            <ul className="-mx-4 flex flex-wrap gap-1">
              {channels.map((channel) => (
                <li key={channel.label}>
                  <Button asChild variant="ghost" size="sm" className="text-sm font-medium">
                    <a href={channel.href} target="_blank" rel="noopener noreferrer">
                      {channel.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="opacity-70 transition-transform duration-200 ease-out group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                      />
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// Mensagem de erro do campo, ligada a ele por aria-describedby.
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p
      id={id}
      role="alert"
      className="flex items-center gap-1.5 text-[13px] font-medium text-foreground motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1"
    >
      <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}
