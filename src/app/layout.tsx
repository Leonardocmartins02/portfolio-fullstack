import type { Metadata, Viewport } from "next";
import { DM_Sans, Source_Code_Pro } from "next/font/google";
import "./globals.css";

// O DESIGN.md da MongoDB usa a Euclid Circular A (comercial, sem licença web
// livre). A DM Sans é a geométrica gratuita mais próxima: mesmo desenho
// circular, pesos 400/500/600 e itálico de verdade. Fonte variável (eixo opsz):
// um arquivo só para todos os pesos.
const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// O itálico aparece só no título de Skills: arquivo próprio, sem preload.
const sansItalic = DM_Sans({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-sans-italic",
  display: "swap",
  preload: false,
});

// Source Code Pro (code-md do DESIGN.md): só o endereço das janelas de projeto.
const mono = Source_Code_Pro({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const title = "Leonardo Martins — Portfólio";
const description =
  "Portfólio de Leonardo Martins, desenvolvedor full stack — projetos, trajetória e contato.";

// Teal profundo da MongoDB: barra do navegador e controles nativos no mesmo tom.
export const viewport: Viewport = {
  themeColor: "#001e2b",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: o script abaixo acrescenta a classe "js" antes da hidratação.
    <html lang="pt-BR" className={`dark ${sans.variable} ${sansItalic.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca a página como "com JS" antes da primeira pintura: o hero já nasce na
            composição da janela, sem trocar de layout quando o React hidrata. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
