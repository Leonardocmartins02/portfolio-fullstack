import { prisma } from "@/lib/prisma";
import type { Project } from "@prisma/client";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Timeline } from "@/components/Timeline";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

// Server Component: busca os projetos direto no banco a cada carregamento.
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
      <main id="main">
        <Hero />
        <Stats />
        <About />
        <Skills />
        <Projects projects={projects} />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
