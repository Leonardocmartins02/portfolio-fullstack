// Teste isolado da integracao de e-mail, fora do Next.
// Uso: node scripts/test-email.mjs
//
// Le o .env na raiz do projeto, dispara um e-mail pela API do Resend e imprime
// a resposta crua (status HTTP + corpo). Serve para separar "o Next nao esta
// enviando" de "o Resend aceitou mas o Outlook nao entregou".
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const env = {};
  let raw = "";
  try {
    raw = readFileSync(resolve(root, ".env"), "utf8");
  } catch {
    console.error("Nao encontrei o arquivo .env na raiz do projeto.");
    process.exit(1);
  }
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const apiKey = env.RESEND_API_KEY;
const from = env.EMAIL_FROM || "Portfolio <onboarding@resend.dev>";
const to = env.EMAIL_TO;

if (!apiKey || !to) {
  console.error("RESEND_API_KEY ou EMAIL_TO ausentes no .env.");
  process.exit(1);
}

console.log(`Chave:  ${apiKey.slice(0, 8)}... (${apiKey.length} caracteres)`);
console.log(`De:     ${from}`);
console.log(`Para:   ${to}`);
console.log("Enviando...\n");

const response = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from,
    to: [to],
    subject: "Teste direto da API do Resend",
    text: "Se este e-mail chegou, a integracao esta funcionando ponta a ponta.",
    html: "<p>Se este e-mail chegou, a integracao esta funcionando ponta a ponta.</p>",
  }),
});

const body = await response.text();
console.log(`HTTP ${response.status} ${response.statusText}`);
console.log(body);

if (response.ok) {
  console.log(
    "\nO Resend ACEITOU o e-mail. Copie o \"id\" acima e procure por ele em"
  );
  console.log("https://resend.com/emails para ver o status real da entrega");
  console.log("(delivered / bounced / complained).");
} else {
  console.log("\nO Resend RECUSOU o envio. O motivo esta no corpo acima.");
}
