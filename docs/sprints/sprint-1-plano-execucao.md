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

### 1. Autenticação (história #1)

- [ ] Página `/cadastro` — formulário de e-mail/senha usando `supabase.auth.signUp`
- [ ] Página `/login` — `supabase.auth.signInWithPassword`
- [ ] Ao cadastrar no Supabase Auth, criar a linha correspondente na tabela `usuario` (perfil padrão: Desenvolvedor)
- [ ] Middleware (`src/middleware.ts`, já existe o esqueleto) redirecionando pra `/login` quem não está autenticado
- [ ] Botão de logout

### 2. CRUD de Projetos (história #2)

- [ ] Rota `/projetos` — lista os projetos do usuário logado
- [ ] Formulário de criação (nome + descrição)
- [ ] Validação: nome não pode ser vazio (interface + já garantido pelo banco via `NOT NULL`)

### 3. CRUD de Tarefas (história #3)

- [ ] Rota `/projetos/[id]` — lista tarefas do projeto, com status
- [ ] Formulário de criação de tarefa (vinculada ao projeto da URL)

### 4. Administração (histórias #4, #5, #6) — se sobrar tempo na sprint

Mais complexas que as anteriores; se o tempo apertar, negociar levar pra
Sprint 2 é preferível a entregar pela metade (ver §10 do Manual sobre redução
de escopo negociada x abandono silencioso).

- [ ] `/admin/usuarios` — listar, desativar conta
- [ ] `/admin/permissoes` — tela simples de associar permissão a perfil
- [ ] `/admin/ferramentas-ia` — CRUD do catálogo de ferramentas

### 5. Testes

- [ ] Configurar Vitest no projeto (`npm install -D vitest`, script `test` no `package.json`)
- [ ] Escrever os testes unitários mais simples do plano (`docs/plano-de-testes.md`): CT03 (nome de projeto vazio), CT09 (duração ≤ 0), CT17 (campo obrigatório vazio)
- [ ] Rodar manualmente os cenários de CT01, CT02, CT04 (dependem de auth/CRUD, não são unitários)

## Depois que houver algo funcionando: os 4 documentos da entrega

Só fazem sentido depois dos itens técnicos acima — não dá pra descrever
incremento ou evidência de algo que não existe ainda.

1. **`sprint-1-evidencias-teste.md`** — resultado real de cada CT executado (passou/falhou)
2. **`sprint-1-retrospectiva.md`** — feita **em conjunto** pelos dois na Sprint Review, não sozinho
3. **`sprint-1-contribuicao-artur.md`** e **`sprint-1-contribuicao-tobias.md`** — um por pessoa, honesto, cruza com o histórico de commits
4. **`sprint-1-relatorio.md`** — documento-capa: planejado vs. entregue, link/demo, linka os outros 3

## Retomando de onde parou

Esta sessão trabalhou sob um limite de tempo apertado (30 min). Se for
continuar em outra sessão/máquina: o repositório já tem tudo commitado até
aqui, o Supabase já está configurado e com tabelas criadas — é só clonar,
copiar as credenciais reais para o `.env` (elas **não** estão no repositório,
por segurança) e seguir a partir da seção "Pendências técnicas" acima.
