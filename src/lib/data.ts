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
    items: ["React", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS", "Design Responsivo"],
  },
  {
    group: "Back-end",
    items: ["Python (Flask)", "Node.js", "SQL (SQLite/SQLAlchemy)", "Git/GitHub"],
  },
  {
    group: "Infraestrutura & Suporte",
    items: ["Linux (Ubuntu)", "Windows", "Redes (LAN/Wi-Fi)", "Active Directory", "Diagnóstico e Manutenção de Impressoras", "Figma"],
  },
];

export const timeline = [
  {
    year: "set/2026 – Atual",
    title: "Analista de Suporte de TI — Elo Infraestrutura",
    description:
      "Suporte técnico N1/N2, gestão de infraestrutura de redes, administração de acessos e rotinas de backup, controle de ativos e documentação técnica.",
  },
  {
    year: "jul/2025 – set/2025",
    title: "Técnico de Impressoras — Mactron",
    description:
      "Diagnóstico e resolução de falhas de hardware/software, integração de equipamentos à rede corporativa e manutenções preventivas.",
  },
  {
    year: "mai/2024 – jun/2025",
    title: "Assistente de T.I. — 2º Tabelião de Notas de Ribeirão Preto",
    description:
      "Suporte aos sistemas do cartório, emissão/validação de certificados digitais e otimização de rotinas administrativas.",
  },
  {
    year: "Formação",
    title: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
    description: "Universidade Paulista (UNIP) — Ribeirão Preto, SP. Concluído.",
  },
];
