import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leonardo Martins — Portfólio",
    short_name: "Leonardo Martins",
    description:
      "Portfólio de Leonardo Martins, desenvolvedor full stack — projetos, trajetória e contato.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0C14",
    theme_color: "#0B0C14",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
