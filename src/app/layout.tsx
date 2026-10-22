import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// IBM Plex Sans: desenho de engenharia, I maiúsculo com serifas ("TI" não vira
// "Tl") e itálico de verdade. Só os pesos que o site usa (400, 500 e 600).
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// O itálico aparece só no título de Skills: arquivo próprio, sem preload.
const plexItalic = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-sans-italic",
  display: "swap",
  preload: false,
});

const siteUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
const title = "Leonardo Martins — Portfólio";
const description =
  "Portfólio de Leonardo Martins, desenvolvedor full stack — projetos, trajetória e contato.";

// Fundo dos capítulos escuros: barra do navegador e controles nativos no mesmo tom.
export const viewport: Viewport = {
  themeColor: "#06090f",
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
    <html lang="pt-BR" className={`dark ${plex.variable} ${plexItalic.variable}`} suppressHydrationWarning>
      <head>
        {/* Marca a página como "com JS" antes da primeira pintura: o hero já nasce na
            composição da janela, sem trocar de layout quando o React hidrata. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
        >
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
