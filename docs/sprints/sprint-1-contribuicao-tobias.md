# Relatório Individual de Contribuição — Sprint 1 — Tobias Gomide Fonsatti (RA 2840482421046)

> **Nota de honestidade (ler antes de entregar):** este rascunho foi montado a
> partir do que aconteceu na sessão de desenvolvimento assistida por IA — ou
> seja, reflete o que a IA registrou, não uma autoavaliação sua. Revise cada
> linha, ajuste o que não bater com sua percepção real, e complete as seções
> 3 e 4 sozinho (isso é genuinamente pessoal e a IA não tem como preencher
> por você). O Manual (§7) exige que você consiga explicar linha a linha
> qualquer código submetido — antes de entregar, garanta que isso é verdade
> pra você.

**Papel nesta sprint:** Product Owner + Responsável por dados (conforme Termo de Aceite, E2)

## 1. O que fiz

| Item | PR/commit | Status |
|---|---|---|
| Criação e configuração do projeto Supabase (Auth + Postgres) | — (feito no painel do Supabase, fora do Git) | Concluído |
| Decisão de arquitetura: Postgres hospedado no Supabase em vez do servidor Oracle próprio | commit `71b7977` | Concluído |
| Aprovação explícita da alteração de schema (`usuario.senha_hash` → `auth_user_id`) que a IA sinalizou como ação de risco | commit `71ebee8` | Concluído |
| Direcionamento de escopo: priorizar Sprint 1 completa (incluindo item Admin) antes da Sprint 2 | — (decisão registrada na conversa) | Concluído |
| Fornecimento de credenciais e testes de configuração (chaves Supabase, senha do banco) | — | Concluído |

## 2. Rituais que participei

- [ ] Dailies/weeklies
- [ ] Sprint Review
- [ ] Retrospectiva

## 3. PRs de colegas que revisei

*(preencher — nenhum registrado nesta sessão)*

## 4. Dificuldades e o que aprendi

*(preencher com sua própria reflexão)*

## Declaração de uso de IA (§7 do Manual)

A maior parte do código desta sprint (páginas de autenticação, CRUD de
projetos/tarefas, telas de administração, schema do Prisma, testes unitários)
foi escrita por IA (Claude, via Claude Code) sob minha direção — eu tomei as
decisões de escopo/arquitetura, aprovei ações sensíveis (alteração de schema
em produção) e testei os fluxos, mas não digitei o código linha a linha.
Comprometo-me a revisar e conseguir explicar qualquer trecho se solicitado.
