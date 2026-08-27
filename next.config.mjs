/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hosts confiaveis para imagens externas de projetos (adicione conforme
    // necessario). Imagens locais em /public nao precisam estar aqui.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
