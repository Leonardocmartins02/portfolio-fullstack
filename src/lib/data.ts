// Conteudo estatico da pagina publica (facil de editar sem mexer no banco).
// Os projetos, por outro lado, vem do banco de dados (editaveis pelo painel admin).

export const profile = {
  name: "Leonardo Martins",
  role: "Desenvolvedor Full Stack",
  location: "Ribeirão Preto, SP",
  tagline: "Unindo experiência sólida em infraestrutura com desenvolvimento full stack.",
  bio: "Profissional de TI com sólida experiência em suporte técnico, infraestrutura e atendimento ao usuário (N1/N2), aliada a uma forte base em desenvolvimento de software. Transito entre a resolução ágil de incidentes — redes, hardware e sistemas operacionais — e a construção de ferramentas e aplicações que otimizam processos internos, unindo visão operacional e desenvolvimento full-stack. Tecnólogo em Análise e Desenvolvimento de Sistemas pela UNIP.",
  email: "leonardocmartins02@hotmail.com",
  linkedin: "https://www.linkedin.com/in/leonardo-martins-167a46227/",
  github: "https://github.com/Leonardocmartins02",
  whatsapp: "https://wa.me/5516997058705",
};

export const stats = [
  { value: "2+", label: "Anos de experiência" },
  { value: "150+", label: "Atendimentos via GLPI, AnyDesk e TeamViewer" },
  { value: "Full Stack", label: "Foco principal" },
  { value: "UNIP", label: "Tecnólogo em ADS · Concluído" },
  { value: "Ribeirão Preto", label: "SP · Presencial ou remoto" },
];

export const skills = [
  {
    group: "Front-end",
    items: ["React", "TypeScript", "TanStack Query", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS", "Design Responsivo", "Acessibilidade (WCAG)"],
  },
  {
    group: "Back-end",
    items: ["Python (Flask)", "Node.js", "Supabase (Auth, Storage, Edge Functions)", "PostgreSQL (RLS, funções transacionais)", "SQL (SQLite/SQLAlchemy)", "Controle de concorrência", "LGPD", "Git/GitHub"],
  },
  {
    group: "Qualidade & Deploy",
    items: ["Playwright (E2E)", "Vitest", "axe (auditoria de acessibilidade)", "GitHub Actions (CI)", "Cloudflare Pages"],
  },
  {
    group: "Infraestrutura & Suporte",
    items: ["Linux (Ubuntu)", "Windows", "Redes (LAN/Wi-Fi)", "Active Directory", "Diagnóstico e Manutenção de Impressoras", "Figma"],
  },
];

// Experiencias profissionais, da mais recente para a mais antiga. Datas no
// formato AAAA-MM; `end: null` marca o emprego atual.
export const experiences = [
  {
    id: "elo-infraestrutura",
    start: "2026-09",
    end: null,
    role: "Analista de Suporte de TI",
    company: "Elo Infraestrutura",
    description:
      "Suporte técnico N1/N2, gestão de infraestrutura de redes, administração de acessos e rotinas de backup, controle de ativos e documentação técnica.",
  },
  {
    id: "mactron",
    start: "2025-07",
    end: "2025-09",
    role: "Técnico de Impressoras",
    company: "Mactron",
    description:
      "Diagnóstico e resolução de falhas de hardware/software, integração de equipamentos à rede corporativa e manutenções preventivas.",
  },
  {
    id: "tabeliao-ribeirao-preto",
    start: "2024-05",
    end: "2025-06",
    role: "Assistente de T.I.",
    company: "2º Tabelião de Notas de Ribeirão Preto",
    description:
      "Suporte aos sistemas do cartório, emissão/validação de certificados digitais e otimização de rotinas administrativas.",
  },
];

// Formacao fica fora da linha do tempo profissional (periodo nao informado).
export const education = {
  course: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
  institution: "Universidade Paulista (UNIP) — Ribeirão Preto, SP",
  status: "Concluído",
};
