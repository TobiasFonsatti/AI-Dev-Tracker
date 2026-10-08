# AI-Dev-Tracker — Rastreador de Uso de IA no Desenvolvimento

Plataforma web para registrar e acompanhar o uso de ferramentas de inteligência
artificial durante atividades de desenvolvimento de software, permitindo que
desenvolvedores documentem suas sessões de trabalho e que gestores/professores
identifiquem padrões de uso e situações de atenção (ex.: baixa confiança ou
alta dificuldade associadas ao uso frequente de IA).

## Integrantes

| Nome | RA | Papel |
|---|---|---|
| Artur Feiteiro Ruiz | 2840482421032 | Desenvolvedor |
| Tobias Gomide Fonsatti | 2840482421046 | Desenvolvedor |

**Trilha:** A1 · Laboratório de Engenharia de Software · ADS Fatec Ribeirão Preto, 2026

## Status do Deploy

| Ambiente | Status |
|---|---|
| **Local (desenvolvimento)** | ✅ Funcional — `npm run dev` na porta 3000 |
| **Produção** | 🔜 Previsto para deploy em servidor próprio (Oracle Cloud, via Cloudflare Tunnel) mais adiante no semestre |

> Atualmente, a aplicação roda apenas em ambiente local. As instruções para
> reproduzir o ambiente estão detalhadas na seção **Como rodar localmente**.

## Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.3.5 | Framework full-stack (React + API Routes) |
| [React](https://react.dev/) | 19.2.8 | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org/) | ^5 | Tipagem estática |
| [Prisma ORM](https://www.prisma.io/) | 7.10.0 | ORM + migrações de banco de dados |
| [PostgreSQL](https://www.postgresql.org/) | — | Banco de dados relacional (hospedado no Supabase) |
| [Supabase Auth](https://supabase.com/auth) | @supabase/ssr 0.12.7 | Autenticação de usuários |
| [Tailwind CSS](https://tailwindcss.com/) | ^4 | Estilização |
| [Vitest](https://vitest.dev/) | ^5.0.1 | Testes unitários |
| [ESLint](https://eslint.org/) | ^9 | Linting |
| [Node.js](https://nodejs.org/) | 24+ (recomendado) | Runtime JavaScript |
| npm | 11+ | Gerenciador de pacotes |

## Como rodar localmente

### Pré-requisitos

- **Node.js** 20 ou superior (recomendado: 24+) — [download](https://nodejs.org/)
- **npm** 10 ou superior (vem incluso com o Node.js)
- Uma conta e um projeto no [Supabase](https://supabase.com) (fornece Auth + PostgreSQL — **não** precisa instalar Postgres localmente)
- **Git** — [download](https://git-scm.com/)

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/TobiasFonsatti/AI-Dev-Tracker.git
   cd AI-Dev-Tracker
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```
   > O script `postinstall` executa `prisma generate` automaticamente.

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   Abra o ficheiro `.env` e preencha cada variável com os valores do seu projeto Supabase (veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente) abaixo).

4. **Crie as tabelas no banco de dados:**
   ```bash
   npm run db:push
   ```
   Este comando executa `prisma db push` e cria as tabelas definidas em `prisma/schema.prisma`.

   > `db/schema.sql` permanece no repositório como DDL de referência/documentação.

5. **(Opcional) Popule o banco com dados iniciais:**
   ```bash
   npm run db:seed
   ```

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

7. **Acesse a aplicação:**
   Abra o navegador em [http://localhost:3000](http://localhost:3000)

### Scripts disponíveis

| Script | Comando | Descrição |
|---|---|---|
| `dev` | `npm run dev` | Inicia o servidor Next.js em modo de desenvolvimento |
| `build` | `npm run build` | Gera o build de produção |
| `start` | `npm run start` | Inicia o servidor de produção |
| `lint` | `npm run lint` | Executa o ESLint |
| `test` | `npm run test` | Executa os testes com Vitest |
| `db:push` | `npm run db:push` | Sincroniza o schema Prisma com o banco |
| `db:seed` | `npm run db:seed` | Popula o banco com dados iniciais |

## Variáveis de Ambiente

Copie o ficheiro [`.env.example`](.env.example) para `.env` e preencha os valores.

| Variável | Onde encontrar | Descrição |
|---|---|---|
| `DATABASE_URL` | Supabase → **Connect** → ORMs → Prisma | Conexão pooled (transaction mode, porta 6543) — usada pela aplicação em runtime |
| `DIRECT_URL` | Supabase → **Connect** → ORMs → Prisma | Conexão direta (session mode, porta 5432) — usada pelo Prisma CLI para migrações/`db push` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → **Settings** → API | URL pública do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → **Settings** → API | Chave publishable/anon (pode ser exposta no client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → **Settings** → API | Chave secret/service_role — **nunca expor no client** |

> ⚠️ Nunca faça commit do ficheiro `.env` real. Ele já está listado no `.gitignore`.

## Estrutura do repositório

```
AI-Dev-Tracker/
├── src/
│   ├── app/            ← Rotas e páginas do Next.js (App Router)
│   │   ├── api/        ← API Routes (backend)
│   │   └── (auth)/     ← Rotas de autenticação (login, cadastro)
│   └── generated/
│       └── prisma/     ← Client Prisma gerado (não editar manualmente)
├── prisma/
│   ├── schema.prisma   ← Schema do banco de dados
│   └── seed.ts         ← Script de seed
├── db/
│   └── schema.sql      ← DDL de referência (gerado a partir do DER)
├── docs/               ← Documentação do projeto
│   ├── backlog.md
│   ├── declaracao-de-escopo.md
│   ├── der.md
│   ├── documento-de-visao.md
│   ├── plano-de-testes.md
│   ├── prototipo.md
│   ├── termo-de-aceite-projeto.md
│   ├── uml.md
│   └── sprints/        ← Retrospectivas de sprint
├── .env.example        ← Template de variáveis de ambiente
├── package.json
└── README.md           ← Este ficheiro
```

## Convenções da equipe

- **Branches:** `feature/nome-curto`, `fix/nome-curto`, a partir de `main`
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`)
- Toda PR exige revisão de pelo menos um integrante antes do merge na `main`
- Merge na `main` obrigatório ao menos uma vez por semana

## Testes

```bash
npm run test
```

Executa os testes unitários com [Vitest](https://vitest.dev/).

Ver estratégia completa em [`docs/plano-de-testes.md`](docs/plano-de-testes.md).

## Documentação do projeto

| Entrega | Documento |
|---|---|
| E1 | [`docs/documento-de-visao.md`](docs/documento-de-visao.md), [`docs/declaracao-de-escopo.md`](docs/declaracao-de-escopo.md) |
| E2 | [`docs/backlog.md`](docs/backlog.md), [`docs/termo-de-aceite-projeto.md`](docs/termo-de-aceite-projeto.md) |
| E3 | [`docs/uml.md`](docs/uml.md), [`docs/der.md`](docs/der.md), [`db/schema.sql`](db/schema.sql) |
| E4 | Este README, [`docs/plano-de-testes.md`](docs/plano-de-testes.md), [`docs/prototipo.md`](docs/prototipo.md) |

## Licença / Uso acadêmico

Projeto desenvolvido para a disciplina de Laboratório de Engenharia de Software — ADS,
Fatec Ribeirão Preto, 2026. Trilha A1, adaptado do TCC *"O Impacto do 'Vibe Coding' na
Experiência do Desenvolvedor: Um Estudo sobre Produtividade e Criatividade Assistida por IA"*.
