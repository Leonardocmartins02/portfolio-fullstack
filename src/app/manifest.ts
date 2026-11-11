import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leonardo Martins — Portfólio",
    short_name: "Leonardo Martins",
    description:
      "Portfólio de Leonardo Martins, desenvolvedor full stack — projetos, trajetória e contato.",
    start_url: "/",
    display: "standalone",
    background_color: "#001E2B",
    theme_color: "#001E2B",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
