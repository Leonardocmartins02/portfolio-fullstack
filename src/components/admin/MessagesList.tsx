import type { ContactMessage } from "@prisma/client";
import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) {
    return (
      <Card className="flex items-center gap-3 border-dashed bg-transparent p-6 text-sm text-muted-foreground">
        <Mail aria-hidden="true" className="size-4" />
        Nenhuma mensagem recebida ainda.
      </Card>
    );
  }

  return (
    <ul className="grid gap-3">
      {messages.map((message) => (
        <li key={message.id}>
          <Card className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">{message.name}</span> ·{" "}
                <a href={`mailto:${message.email}`} className="link focus-ring rounded-sm">
                  {message.email}
                </a>
              </span>
              <time dateTime={new Date(message.createdAt).toISOString()} className="tabular-nums">
                {new Date(message.createdAt).toLocaleString("pt-BR")}
              </time>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {message.message}
            </p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
