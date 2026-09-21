# Plano de Execução — Sprint 1 (E5)

Documento de trabalho da equipe, não é um dos 4 artefatos oficiais da entrega
(esses são: `sprint-1-relatorio.md`, `sprint-1-retrospectiva.md`,
`sprint-1-contribuicao-<nome>.md`, `sprint-1-evidencias-teste.md` — todos nesta
mesma pasta, ainda não criados). Serve pra não perder o fio da meada entre uma
sessão de trabalho e outra.

**Foco da Sprint 1 (cronograma do Manual):** fundação — modelo de dados
implementado, autenticação, CRUD principal. Histórias-alvo do backlog
(`docs/backlog.md`): **#1 a #6**.

## Status atual

- [x] Projeto Supabase criado (Auth + Postgres)
- [x] Next.js 16 + TypeScript + Tailwind rodando (`npm run build` passa)
- [x] `prisma/schema.prisma` modelado a partir do DER (`docs/der.md`)
- [x] 13 tabelas criadas de verdade no Postgres do Supabase (`npm run db:push`)
- [x] Cliente Prisma (com driver adapter) e helpers do Supabase Auth (client/server/middleware) configurados
- [ ] Tudo o que vem abaixo

## Pendências técnicas, em ordem sugerida

### 0. Ajuste de modelo — usuário vs. Supabase Auth ✅ feito

`usuario.senha_hash` foi substituída por `usuario.auth_user_id` (UUID, único,
referenciando `auth.users` do Supabase). `prisma/schema.prisma`, `db/schema.sql`
e `docs/der.md` atualizados; `npm run db:push` aplicado no banco (tabela
estava vazia, sem risco de perda de dado).

### 1. Autenticação (história #1) ✅ feito e testado

Páginas `/cadastro` e `/login` (Supabase Auth), criação automática da linha em
`usuario` (perfil padrão Desenvolvedor) logo após o `signUp`, middleware
protegendo rotas autenticadas/redirecionando quem já está logado pra fora de
`/login`, `/cadastro`, e logout. Testado ponta a ponta no navegador: cadastro
→ confirmação de e-mail (ver nota abaixo) → login → sessão refletida na navbar.

> **Nota:** o Supabase exige confirmação de e-mail antes do primeiro login por
> padrão. Pra desenvolvimento, considerem desativar isso em
> **Authentication → Sign In / Providers → Email → "Confirm email"** no painel
> do Supabase — assim ninguém trava testando o cadastro. Criei também
> `scripts/confirmar-usuario-teste.mjs` (usa a Admin API do Supabase) pra
> confirmar um e-mail manualmente sem mexer na config, se preferirem manter a
> confirmação ligada.

### 2. CRUD de Projetos (história #2) ✅ feito e testado

Rota `/projetos` lista os projetos do usuário logado (via `usuario_projeto`) e
tem formulário de criação. Testado: criar projeto funciona, aparece na lista.

### 3. CRUD de Tarefas (história #3) ✅ feito e testado

Rota `/projetos/[id]` lista tarefas do projeto com troca de status inline, e
formulário de criação. Testado: criar tarefa e mudar status refletem no banco.

### 4. Administração (histórias #4, #5, #6) ✅ feito e testado

- `/admin/usuarios` — lista usuários, ativa/desativa conta
- `/admin/permissoes` — matriz perfil × permissão, clique pra conceder/revogar
- `/admin/ferramentas-ia` — lista, cadastra, ativa/desativa ferramentas

Acesso restrito a quem tem perfil ADMINISTRADOR (`exigirAdmin()` em
`src/lib/usuario-atual.ts`). Testado promovendo um usuário de teste pra
ADMINISTRADOR direto no banco e validando as 3 telas.

### 5. Testes ✅ feito

Vitest configurado (`npm run test`), 11 testes unitários cobrindo CT03, CT17,
validação de cadastro e a validação de duração de sessão (CT09, escrita com
antecedência — a tela em si é Sprint 2). Cenários manuais de CT01, CT02, CT04,
CT05, CT06, CT07 verificados ponta a ponta no navegador contra o Supabase real.

## Os 4 documentos da entrega

1. **[`sprint-1-relatorio.md`](sprint-1-relatorio.md)** ✅ escrito — factual, sem pendência
2. **[`sprint-1-evidencias-teste.md`](sprint-1-evidencias-teste.md)** ✅ escrito — factual, sem pendência
3. **[`sprint-1-retrospectiva.md`](sprint-1-retrospectiva.md)** ⏳ estrutura pronta, reflexão pendente — **precisa ser feita em conjunto pelos dois**
4. **[`sprint-1-contribuicao-tobias.md`](sprint-1-contribuicao-tobias.md)** ⏳ rascunho pronto, revisar e completar seções 3–4
5. **[`sprint-1-contribuicao-artur.md`](sprint-1-contribuicao-artur.md)** ❌ em branco — Artur não participou desta sessão, ver nota no próprio arquivo

## Retomando de onde parou

Esta sessão trabalhou sob um limite de tempo apertado (30 min). Se for
continuar em outra sessão/máquina: o repositório já tem tudo commitado até
aqui, o Supabase já está configurado e com tabelas criadas — é só clonar,
copiar as credenciais reais para o `.env` (elas **não** estão no repositório,
por segurança) e seguir a partir da seção "Pendências técnicas" acima.
