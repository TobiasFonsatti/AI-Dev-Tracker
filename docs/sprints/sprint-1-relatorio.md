# Relatório de Entrega — Sprint 1 — Rastreador de Uso de IA no Desenvolvimento

**Período:** 21/08/2026 (E1) a 21/09/2026 — prazo original da Sprint 1 (Semana 5, 18/09) estendido pelo professor e unificado com a Sprint 2, entrega até sexta-feira, 25/09/2026.
**Equipe:** Artur Feiteiro Ruiz (2840482421032) — Tobias Gomide Fonsatti (2840482421046)

## 1. Planejado vs. entregue

| História (E2) | Planejada para esta sprint? | Entregue? | Observação |
|---|---|---|---|
| #1 — Cadastro e login | Sim | ✅ Sim | Supabase Auth; usuário criado em `usuario` no cadastro |
| #2 — Cadastro de projetos | Sim | ✅ Sim | `/projetos` — lista + criação |
| #3 — Cadastro de tarefas | Sim | ✅ Sim | `/projetos/[id]` — lista + criação + troca de status |
| #4 — Gestão de usuários | Sim | ✅ Sim | `/admin/usuarios` — ativar/desativar |
| #5 — Permissões por perfil | Sim | ✅ Sim | `/admin/permissoes` — matriz perfil × permissão |
| #6 — Catálogo de ferramentas de IA | Sim | ✅ Sim | `/admin/ferramentas-ia` — CRUD |

Todas as 6 histórias Must planejadas para a Sprint 1 foram entregues.

## 2. Incremento funcional demonstrável

Aplicação Next.js + Prisma + Supabase (Auth e Postgres), rodando localmente
(`npm run dev`, ainda sem deploy público — previsto para a Sprint 4). Fluxo
demonstrável:

1. Cadastro de uma conta nova (`/cadastro`) → confirmação de e-mail (Supabase)
   → login (`/login`)
2. Criação de um projeto e de tarefas dentro dele, com troca de status
3. Acesso às telas de administração (usuários, permissões, ferramentas de IA)
   por um usuário com perfil ADMINISTRADOR

**Como reproduzir localmente:** ver [`README.md`](../../README.md), seção
"Como rodar localmente". Todas as credenciais do Supabase precisam ser
configuradas no `.env` de cada máquina (não vão pro repositório).

## 3. Backlog atualizado

Ver [`docs/backlog.md`](../backlog.md), seção "Atualização de status — Sprint 1".
Todas as 6 histórias Must da Sprint 1 estão marcadas como concluídas.

## 4. Evidências de teste

Resumo — detalhe completo em
[`sprint-1-evidencias-teste.md`](sprint-1-evidencias-teste.md).

- 11 testes unitários automatizados (Vitest), 100% passando, cobrindo as
  validações de CT03, CT17 e cadastro/duração de sessão
- Fluxos de #1 a #6 verificados manualmente ponta a ponta contra o banco real
  do Supabase (não apenas na tela — conferido também via consulta direta ao Postgres)

## 5. Retrospectiva e contribuição individual

- Ata de retrospectiva: [`sprint-1-retrospectiva.md`](sprint-1-retrospectiva.md) — **pendente de preenchimento em conjunto pela equipe** (seções de reflexão)
- Relatórios individuais de contribuição: [`sprint-1-contribuicao-tobias.md`](sprint-1-contribuicao-tobias.md), [`sprint-1-contribuicao-artur.md`](sprint-1-contribuicao-artur.md) — **ambos precisam de revisão/preenchimento pelos próprios integrantes antes da entrega** (ver nota de honestidade em cada arquivo)

## 6. Riscos/impedimentos para a próxima sprint

| Risco/impedimento | Impacto | Mitigação |
|---|---|---|
| Prazo apertado (Sprint 1+2 juntas até 25/09) | Alto | Sprint 2 já tem plano de execução detalhado a montar, priorizando a regra de negócio (história #10) sobre a avaliação estendida (#9, Should) |
| Confirmação de e-mail do Supabase pode travar testes/demo | Médio | Time pode desativar "Confirm email" nas configs do Supabase para a fase de desenvolvimento, ou usar `scripts/confirmar-usuario-teste.mjs` |
| Grande parte do código desta sprint foi escrita com assistência de IA | Médio | Declarado nesta entrega (ver `sprint-1-contribuicao-*.md`); ambos os integrantes precisam revisar e conseguir explicar o código linha a linha (§7 do Manual) |
| Artur não participou desta sessão de desenvolvimento | Alto | Precisa ser resolvido antes da avaliação de contribuição individual — ver nota em `sprint-1-contribuicao-artur.md` |
