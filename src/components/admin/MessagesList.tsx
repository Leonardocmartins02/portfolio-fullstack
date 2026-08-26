import type { ContactMessage } from "@prisma/client";

export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) {
    return <p className="text-sm text-muted">Nenhuma mensagem recebida ainda.</p>;
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-muted">
            <span>
              {message.name} · {message.email}
            </span>
            <span>{new Date(message.createdAt).toLocaleString("pt-BR")}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">{message.message}</p>
        </div>
      ))}
    </div>
  );
}
