# Portfólio Full Stack

🔗 **Demo ao vivo:** [portfolio-fullstack-delta-seven.vercel.app](https://portfolio-fullstack-delta-seven.vercel.app)

Site de portfólio pessoal com um back-end real por trás: banco de dados, formulário de contato funcional (com notificação por e-mail) e um painel administrativo com login para gerenciar os projetos exibidos — sem precisar mexer em código.

![Home do portfólio](docs/screenshot-hero.png)

## Stack

| Camada | Tecnologias |
|---|---|
| Front-end | Next.js 14 (App Router) · TypeScript · Tailwind CSS |
| Back-end | API Routes do Next.js · Zod (validação) |
| Banco de dados | PostgreSQL (Neon) via Prisma ORM |
| Autenticação | NextAuth (Auth.js v4) — Credentials Provider + bcrypt |
| E-mail | Resend (API HTTP) |
| Deploy | Vercel, com CI/CD automático a cada push no `master` |

## Funcionalidades

- **Site público** com seções de apresentação, skills, trajetória profissional, projetos e contato.
- **Projetos complementares**: cadastrados via banco de dados e gerenciados pelo painel, com apresentações editoriais dedicadas ao SimpleStock, à landing page Perol e ao chadbb.
- **Painel administrativo protegido** (`/admin/dashboard`): CRUD completo de projetos e visualização das mensagens recebidas pelo formulário de contato.
- **Formulário de contato resiliente**: toda mensagem é salva no banco mesmo se o envio de e-mail falhar, e o usuário recebe um status honesto sobre o que realmente aconteceu.
- **Autenticação segura**: sessão JWT, senha com hash bcrypt, rotas de mutação protegidas por `getServerSession`.

## Projeto principal

O SimpleStock tem uma apresentação dedicada em [`/projetos/simplestock`](https://portfolio-fullstack-delta-seven.vercel.app/projetos/simplestock), com vídeo do fluxo real, captura de tela e decisões técnicas. O destaque editorial fica em `src/components/Projects.tsx`; os demais projetos continuam vindo do painel administrativo. O destaque permanece disponível mesmo quando a consulta ao banco falha.

A landing page Perol (F5 Flotador e Lavix) segue o mesmo formato em [`/projetos/perol`](https://portfolio-fullstack-delta-seven.vercel.app/projetos/perol): vídeo do fluxo no desktop e no celular, telas e decisões técnicas. O painel dela vem logo depois do SimpleStock, também em `src/components/Projects.tsx`.

O chadbb, organizador de chá de bebê em produção, tem o mesmo formato em [`/projetos/chadbb`](https://portfolio-fullstack-delta-seven.vercel.app/projetos/chadbb). O vídeo e as telas usam dados fictícios e o backend simulado dos testes do próprio chadbb, para não expor os convidados do evento real.

## Rolagem nas seções Projetos e Trajetória

A home inteira compartilha um laço de rolagem (`src/lib/scroll-orchestrator.ts`): um listener de scroll, um `requestAnimationFrame` por quadro, um `ResizeObserver` e uma consulta de movimento reduzido, sem biblioteca de animação.

- **Capítulos**: campos escuros de profundidades diferentes separam as seções. No hero, um notebook desenhado em CSS 3D já abre no dashboard do SimpleStock, com cards do próprio sistema em volta (`src/components/hero/`). Na rolagem, os cards se recolhem para a tela; com mouse, a cena inclina de leve. Com movimento reduzido, tudo fica parado no estado inicial. O menu acompanha o capítulo atual; os fundos alternam entre o quase preto, o elevado (um tom acima) e o azul profundo do contato.
- **Projetos** (`src/components/projects/`): painéis verticais sobem sobre o anterior no desktop e no celular. O título fica preso quando todos os painéis cabem na tela; painéis maiores permitem ler todo o conteúdo antes de parar. O foco por teclado revela o painel correspondente. Com movimento reduzido, sem JavaScript ou na impressão, a apresentação segue como lista vertical.
- **Trajetória** (`src/components/Timeline.tsx`): título centralizado, sem retrato; a experiência em leitura recebe destaque no período, sem fixar a seção. Os dados ficam em `experiences` e `education`, em `src/lib/data.ts`.

## Projetos em destaque

| Projeto | Descrição |
|---|---|
| [Sistema de estoque](https://github.com/Leonardocmartins02/Sistema-Estoque-main) | Monorepo de gestão de estoque (SimpleStock) — cadastro de produtos, controle de saldo e movimentações. |
| [Perol — landing page](https://github.com/Leonardocmartins02/pixel-perfect-replica) | Página de venda do F5 Flotador e do Lavix — React, TanStack Start e Tailwind CSS; artes de um parceiro. |
| [chadbb](https://chadbb.online/) | Organizador de chá de bebê: convites por link, presença e presentes pelo celular — React, Supabase e Cloudflare Pages. |

## Rodando localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Gere um valor aleatório para `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Banco de dados

```bash
npm run db:push   # cria as tabelas a partir de prisma/schema.prisma
npm run db:seed   # cria o usuario admin e projetos de exemplo
```

> O projeto usa PostgreSQL (recomendado: um banco gratuito no [Neon](https://neon.tech)). Aponte `DATABASE_URL` para ele tanto em desenvolvimento quanto em produção.

### 4. Rodar

```bash
npm run dev
```

- Site público: `http://localhost:3000`
- Login admin: `http://localhost:3000/admin/login`
- Painel admin: `http://localhost:3000/admin/dashboard`

## Notificação por e-mail do formulário de contato

Toda mensagem do formulário de contato é sempre salva no banco (visível em `/admin/dashboard`). Para também receber um e-mail de aviso, configure o [Resend](https://resend.com) no `.env`:

```env
RESEND_API_KEY="re_sua_chave_aqui"
EMAIL_FROM="Portfolio <onboarding@resend.dev>"
EMAIL_TO="seuemail@exemplo.com"
```

> **Por que não SMTP do Outlook/Hotmail?** A Microsoft desativou permanentemente a autenticação básica no SMTP de contas pessoais Outlook.com/Hotmail — qualquer tentativa retorna `535 5.7.139`. Por isso o envio usa a API HTTP do Resend.

## Personalizando o conteúdo

- **Dados pessoais** (nome, bio, links, skills, trajetória): `src/lib/data.ts`.
- **Tema/cores**: `tailwind.config.ts`.
- **Projetos complementares**: use o painel admin (`/admin/dashboard`). O destaque e a demonstração do SimpleStock ficam em `src/components/Projects.tsx` e `src/app/projetos/simplestock/page.tsx`; os da landing page Perol e do chadbb, em `src/components/Projects.tsx` e em `src/app/projetos/perol/page.tsx` e `src/app/projetos/chadbb/page.tsx`.

## Estrutura do projeto

```
src/
  app/
    page.tsx               -> pagina publica (monta todas as secoes)
    admin/login/            -> pagina de login
    admin/dashboard/        -> painel admin (protegido)
    api/contact/            -> API do formulario de contato
    api/projects/            -> API de CRUD de projetos
    api/auth/[...nextauth]  -> rota do NextAuth
  components/                -> secoes da pagina publica (Hero, About, etc)
  components/hero/           -> notebook em CSS 3D e cards do SimpleStock do hero
  components/admin/          -> componentes do painel admin
  lib/prisma.ts               -> cliente do Prisma (singleton)
  lib/auth.ts                 -> configuracao do NextAuth
  lib/data.ts                 -> conteudo estatico editavel (perfil)
  middleware.ts                -> protege as rotas /admin/dashboard
prisma/
  schema.prisma                -> modelos do banco (Project, ContactMessage, Admin)
  seed.ts                       -> script de dados iniciais
```

## Deploy

Já publicado na Vercel com integração contínua ao GitHub — cada push no `master` gera um novo deploy automaticamente. O banco de produção é PostgreSQL (Neon), configurado via `DATABASE_URL` nas variáveis de ambiente da Vercel.
