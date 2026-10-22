import { prisma } from "@/lib/prisma";
import type { Project } from "@prisma/client";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Timeline } from "@/components/Timeline";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

// Revalida a pagina a cada 60s: sem isso o Next gera a home so no deploy e
// projetos cadastrados no painel nao aparecem ate o proximo redeploy.
export const revalidate = 60;

// Server Component: busca os projetos direto no banco.
// Se o banco falhar, degrada para lista vazia em vez de derrubar a home inteira.
export default async function Home() {
  let projects: Project[] = [];
  try {
    projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Falha ao buscar projetos:", error);
  }

  return (
    <>
      <Header />
      {/* Cada seção é um capítulo com o próprio campo de cor (claro ou escuro),
          com corte seco entre eles; o hero segura a imagem enquanto o Sobre sobe
          por cima, e os projetos sobem um sobre o outro. */}
      <main id="main">
        <Hero />
        <About />
        <Projects projects={projects} />
        <Timeline />
        <Contact />
      </main>
      <Footer />
      <Reveal />
    </>
  );
}
