import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0C14",
        surface: "#14151F",
        border: "#26283A",
        foreground: "#F4F3F8",
        muted: "#9A98A8",
        // DEFAULT para formas (eixo, marcadores, contornos); text para texto roxo,
        // com contraste maior sobre o fundo escuro.
        accent: { DEFAULT: "#7C6CF6", text: "#B7A7FF" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
