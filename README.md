# Portfólio Full Stack

Projeto de prática full stack: um site de portfólio pessoal (inspirado em layouts
minimalistas escuros) com um back-end real por trás — banco de dados, formulário
de contato funcional e um painel administrativo com login para gerenciar os
projetos exibidos, sem precisar mexer no código.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** para estilização
- **Prisma** + **SQLite** (dev) como ORM/banco de dados
- **NextAuth (Auth.js v4)** com login por email/senha para a área admin
- **Zod** para validação de dados nas rotas de API

## ⚠️ Aviso importante

Este projeto foi escrito à mão em um ambiente sem acesso à internet (não foi
possível rodar `npm install` nem testar o build). O código segue os padrões
oficiais do Next.js/Prisma/NextAuth, mas **rode os passos abaixo com atenção**
e, se encontrar algum erro ao instalar ou rodar, me mande a mensagem completa
do erro que eu corrijo.

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste se quiser:

```bash
cp .env.example .env
```

Gere um valor aleatório para `NEXTAUTH_SECRET` (necessário para o login funcionar):

```bash
openssl rand -base64 32
```

Cole o resultado no `.env`, no campo `NEXTAUTH_SECRET`.

### 3. Criar o banco de dados

```bash
npm run db:push
```

Isso cria o arquivo `dev.db` (SQLite) com as tabelas definidas em
`prisma/schema.prisma`.

### 4. Popular dados iniciais (usuário admin + projetos de exemplo)

```bash
npm run db:seed
```

Isso cria um usuário administrador com o email/senha definidos em `.env`
(`ADMIN_EMAIL` / `ADMIN_PASSWORD`, padrão: `admin@example.com` / `mudeesta123`)
e três projetos de exemplo.

### 5. Rodar o projeto

```bash
npm run dev
```

Acesse:

- **Site público:** http://localhost:3000
- **Login admin:** http://localhost:3000/admin/login
- **Painel admin:** http://localhost:3000/admin/dashboard (após login)

## Configurar o e-mail de notificação do formulário de contato

Quando alguém preenche o formulário de contato, a mensagem **sempre** é salva no
banco de dados (visível em `/admin/dashboard`). Para também receber um e-mail
avisando, configure o [Resend](https://resend.com) no `.env`.

> **Por que não SMTP do Hotmail/Outlook?** A Microsoft desativou
> permanentemente a autenticação básica (usuário + senha, inclusive senha de
> aplicativo) no SMTP das contas pessoais Outlook.com/Hotmail. Qualquer
> tentativa retorna `535 5.7.139 Authentication unsuccessful, basic
> authentication is disabled`, e isso **não pode ser reativado** por conta.
> Por isso o projeto usa a API HTTP do Resend.

1. Crie uma conta gratuita em [resend.com](https://resend.com) (3.000 e-mails
   por mês no plano free), usando o e-mail que vai **receber** as notificações.
2. Vá em **API Keys → Create API Key** e copie a chave (começa com `re_`).
3. No `.env`, preencha:

   ```env
   RESEND_API_KEY="re_sua_chave_aqui"
   EMAIL_FROM="Portfolio <onboarding@resend.dev>"
   EMAIL_TO="seuemail@hotmail.com"
   ```

4. Reinicie o `npm run dev` e envie uma mensagem pelo formulário.

**Sobre o `EMAIL_FROM`:** sem um domínio próprio verificado, o Resend só
permite enviar a partir de `onboarding@resend.dev` e **somente para o e-mail
dono da conta Resend**. Se um dia você verificar um domínio seu, troque o
`EMAIL_FROM` para um endereço desse domínio e o `EMAIL_TO` fica livre.

**Se não configurar nada disso:** o formulário continua funcionando e salvando
as mensagens no painel admin — apenas não chega e-mail, e o visitante recebe um
aviso claro de que a notificação falhou (nada de sucesso falso).

## Personalizando o conteúdo

- **Seus dados pessoais** (nome, bio, links, skills, trajetória): edite
  `src/lib/data.ts`.
- **Cores/tema:** edite `tailwind.config.ts` (a paleta escura já está
  configurada, inspirada em um layout minimalista com fundo `#07060D`).
- **Projetos:** não edite código — use o painel admin
  (`/admin/dashboard`) para adicionar, editar e remover projetos. Eles ficam
  salvos no banco de dados.

## Estrutura do projeto

```
src/
  app/
    page.tsx              -> página pública (monta todas as seções)
    layout.tsx             -> layout raiz (fonte, tema escuro)
    admin/login/           -> página de login
    admin/dashboard/       -> painel admin (protegido)
    api/contact/           -> API do formulário de contato
    api/projects/          -> API de CRUD de projetos
    api/auth/[...nextauth] -> rota do NextAuth
  components/               -> seções da página pública (Hero, About, etc)
  components/admin/         -> componentes do painel admin
  lib/prisma.ts             -> cliente do Prisma (singleton)
  lib/auth.ts               -> configuração do NextAuth
  lib/data.ts                -> conteúdo estático editável (seu perfil)
  middleware.ts               -> protege as rotas /admin/dashboard
prisma/
  schema.prisma              -> modelos do banco (Project, ContactMessage, Admin)
  seed.ts                     -> script de dados iniciais
```

## Publicando (deploy)

O SQLite não funciona bem em produção na Vercel (sistema de arquivos é
temporário). Para publicar:

1. Crie um banco Postgres gratuito (ex: [Neon](https://neon.tech) ou
   [Supabase](https://supabase.com)).
2. Em `prisma/schema.prisma`, troque `provider = "sqlite"` por
   `provider = "postgresql"`.
3. Configure a variável `DATABASE_URL` na Vercel com a connection string do
   Postgres.
4. Configure também `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (a URL de produção),
   `ADMIN_EMAIL` e `ADMIN_PASSWORD` nas variáveis de ambiente da Vercel.
5. Rode `npx prisma db push` apontando para o banco de produção (ou configure
   isso no passo de build) e depois `npm run db:seed` uma vez para criar o
   admin.
6. Faça o deploy normalmente (conectando o repositório à Vercel).

## Próximos passos sugeridos

- Trocar a imagem estática dos projetos por upload real (ex: usando um
  serviço como Cloudinary ou Vercel Blob).
- Adicionar paginação/categoria de filtro na seção de projetos.
- Adicionar testes automatizados para as rotas de API.
