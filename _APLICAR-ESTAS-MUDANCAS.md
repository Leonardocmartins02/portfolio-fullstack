# Como aplicar

Extraia este zip **por cima** da pasta `portfolio-fullstack`, substituindo os
arquivos existentes. A estrutura de pastas já está correta.

Arquivos incluídos:

| Arquivo | O que mudou |
|---|---|
| `.env` | Bloco de e-mail trocado: `RESEND_API_KEY` / `EMAIL_FROM` / `EMAIL_TO` no lugar de `EMAIL_SERVER_*`. **A chave do Resend ja esta preenchida.** |
| `.env.example` | Mesmas variáveis, documentadas. |
| `package.json` | Removidos `nodemailer` e `@types/nodemailer` (não são mais usados). |
| `README.md` | Seção de configuração de e-mail reescrita para o Resend. |
| `src/lib/mail.ts` | Reescrito: API HTTP do Resend via `fetch`, escape de HTML, timeout de 5s, retorno tipado. |
| `src/app/api/contact/route.ts` | Passa a devolver `emailSent` na resposta. |
| `src/components/Contact.tsx` | Novo estado "partial": avisa quando a mensagem foi salva mas o e-mail falhou. |

Depois de extrair:

1. `npm install` (limpa o nodemailer e atualiza o lock).
2. `npm run dev` e envie uma mensagem pelo formulário de contato.
3. Revogue a senha de aplicativo antiga do Hotmail em
   [account.microsoft.com](https://account.microsoft.com) — ela não serve mais
   para nada e estava em texto plano no `.env` antigo.

Se aparecer o aviso âmbar em vez da confirmação verde, o terminal mostra uma
linha começando com `[mail]` dizendo exatamente o que o Resend respondeu.

Depois de apagar este arquivo, o commit sugerido é:

```
fix(contact): substitui SMTP Outlook pela API do Resend
feat(contact): informa o visitante quando a notificacao por e-mail falha
```
