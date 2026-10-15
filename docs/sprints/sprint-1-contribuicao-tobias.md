# Relatório Individual de Contribuição — Sprint 1 — Tobias Gomide Fonsatti (RA 2840482421046)

**Papel nesta sprint:** Product Owner + Responsável por dados (conforme Termo de Aceite, E2)

## 1. O que fiz

| Item | PR/commit | Status |
|---|---|---|
| Criação e configuração do projeto Supabase (Auth + Postgres) | — (painel Supabase) | Concluído |
| Decisão de arquitetura e conexão: Postgres hospedado no Supabase via Prisma | commit `71b7977` | Concluído |
| Modelagem inicial e sincronização do schema Prisma (`usuario`, `projeto`, `tarefa`, etc.) | commit `71ebee8` | Concluído |
| Implementação das telas e rotas de login, cadastro, projetos e tarefas (#1 a #3) | commits na branch | Concluído |
| Implementação das páginas de administração de usuários, permissões e ferramentas (#4 a #6) | commits na branch | Concluído |
| Elaboração da bateria inicial de 11 testes unitários com Vitest | commits na branch | Concluído |

## 2. Rituais que participei

- [x] Sprint Planning
- [x] Sprint Review (25/09/2026)
- [x] Retrospectiva

## 3. PRs de colegas que revisei

- Revisei as especificações de regras de validação e casos de teste manuais propostos pelo Artur, incorporando os critérios de aceite nas rotas de API.

## 4. Dificuldades e o que aprendi

A maior complexidade foi conciliar a autenticação do Supabase SSR com a sessão do Next.js App Router e o schema do Prisma. Aprendi bastante sobre como vincular o `auth_user_id` da autenticação com o registro interno da tabela `usuario`.

## Declaração de uso de IA (§7 do Manual)

A maior parte do código desta sprint (páginas de autenticação, CRUD de projetos/tarefas, telas de administração, schema do Prisma, testes unitários) foi escrita com auxílio de IA (Claude) sob meu direcionamento arquitetural, revisão e testes. Consigo explicar qualquer trecho e lógica implementada.

