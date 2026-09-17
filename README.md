# Rastreador de Uso de IA no Desenvolvimento

Plataforma web para registrar e acompanhar o uso de ferramentas de inteligência
artificial durante atividades de desenvolvimento de software, permitindo que
desenvolvedores documentem suas sessões de trabalho e que gestores/professores
identifiquem padrões de uso e situações de atenção (ex.: baixa confiança ou
alta dificuldade associadas ao uso frequente de IA).

**Deploy:** ainda não publicado — previsto para deploy no servidor próprio
(Oracle Cloud, via Cloudflare Tunnel) mais adiante no semestre.
**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046) · Laboratório de Engenharia de Software · ADS Fatec Ribeirão Preto

## Stack

- **Frontend:** Next.js 14+ (React + TypeScript)
- **Backend:** Next.js (API Routes) + Prisma ORM
- **Banco de dados:** PostgreSQL (hospedado no Supabase, mesmo projeto usado para Auth)
- **Autenticação:** Supabase Auth
- **Testes:** Vitest (testes unitários das regras de negócio)
- **CI:** GitHub Actions
- **Deploy (planejado):** Docker em servidor próprio (Oracle Cloud), exposto via Cloudflare Tunnel em domínio próprio

## Como rodar localmente

### Pré-requisitos

- Node.js 20+
- Uma conta e um projeto no [Supabase](https://supabase.com) (fornece Auth + Postgres — não precisa instalar Postgres localmente)
- npm 10+

### Passo a passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/TobiasFonsatti/AI-Dev-Tracker.git
   cd AI-Dev-Tracker
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. No painel do seu projeto Supabase, clique em **Connect** (topo da página) → aba **ORMs** → **Prisma**, e copie as strings de conexão. Copie também as chaves em **Settings → API**.
4. Configure as variáveis de ambiente (copie `.env.example` para `.env` e preencha):

   | Variável | Descrição |
   |---|---|
   | `DATABASE_URL` | Conexão pooled (transaction mode, porta 6543) — usada pela aplicação em runtime |
   | `DIRECT_URL` | Conexão direta (session mode, porta 5432) — usada pelo Prisma CLI para migrações/`db push` |
   | `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave publishable/anon do projeto Supabase |
   | `SUPABASE_SERVICE_ROLE_KEY` | Chave secret/service_role do Supabase — nunca expor no client |

5. Crie as tabelas no banco a partir do `prisma/schema.prisma` (schema já modelado a partir do DER — `docs/der.md`):
   ```bash
   npm run db:push
   ```
   `db/schema.sql` continua no repositório como DDL de referência/documentação (o que efetivamente cria as tabelas é o `prisma db push` acima).
6. Suba o projeto em modo desenvolvimento:
   ```bash
   npm run dev
   ```
7. Acesse em `http://localhost:3000`

## Estrutura do repositório

```
/src/app       — rotas e páginas do Next.js (App Router)
/src/app/api   — API Routes (backend)
/prisma        — schema.prisma e migrations
/db            — schema.sql (DDL de referência, gerado a partir do DER)
/docs          — documento de visão, backlog, UML, DER, plano de testes, protótipo
```

## Convenções da equipe

- **Branches:** `feature/nome-curto`, `fix/nome-curto`, a partir de `main`
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`)
- Toda PR exige revisão de pelo menos um integrante antes do merge na `main`
- Merge na `main` obrigatório ao menos uma vez por semana

## Testes

Como rodar: `npm run test` (Vitest)

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
