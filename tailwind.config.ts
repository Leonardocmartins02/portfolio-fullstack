import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

// Cor a partir de canais RGB definidos em globals.css (por capítulo), para as
// classes aceitarem opacidade (bg-card/60) e trocarem de tom com o capítulo.
const channel = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  // hover: só onde existe hover de verdade (mouse); no toque o estado ficava preso.
  future: { hoverOnlyWhenSupported: true },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Tokens do shadcn/ui com os valores do DESIGN.md da MongoDB.
      colors: {
        background: channel("background"),
        foreground: channel("foreground"),
        card: { DEFAULT: channel("card"), foreground: channel("card-foreground") },
        popover: { DEFAULT: channel("popover"), foreground: channel("popover-foreground") },
        primary: { DEFAULT: channel("primary"), foreground: channel("primary-foreground") },
        secondary: { DEFAULT: channel("secondary"), foreground: channel("secondary-foreground") },
        muted: { DEFAULT: channel("muted"), foreground: channel("muted-foreground") },
        accent: { DEFAULT: channel("accent"), foreground: channel("accent-foreground") },
        destructive: {
          DEFAULT: channel("destructive"),
          foreground: channel("destructive-foreground"),
        },
        border: channel("border"),
        input: channel("input"),
        ring: channel("ring"),
        // Paleta fixa da marca, para usos fora dos capítulos (ex.: selos).
        brand: {
          green: "#00ed64",
          "green-dark": "#00684a",
          "green-soft": "#c3f0d2",
          teal: "#003d4f",
          "teal-deep": "#001e2b",
        },
      },
      // Raios do DESIGN.md: xs 4, sm 6, md 8 (campos), lg 12 (cards), xl 16, 2xl 24.
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "var(--radius)",
        xl: "16px",
        "2xl": "24px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      maxWidth: {
        content: "80rem",
      },
      boxShadow: {
        hover: "var(--shadow-hover)",
        overlay: "var(--shadow-overlay)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
