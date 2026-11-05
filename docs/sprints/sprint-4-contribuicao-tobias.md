# Relatório Individual de Contribuição — Sprint 4 — Tobias Gomide Fonsatti (RA 2840482421046)

**Papel nesta sprint:** Product Owner + Desenvolvedor Fullstack

## 1. O que fiz

| Item | Status |
|---|---|
| Elaboração do container Dockerfile e arquivo docker-compose.yml para empacotamento da aplicação | Concluído |
| Implementação do script de aplicação de constraints SQL (`scripts/aplicar-constraints.mjs` e `db/constraints.sql`) | Concluído |
| Implementação do script de dados de demonstração (`prisma/seed-demo.ts`) | Concluído |
| Revisão e enriquecimento do README com instruções de deploy, configuração de ambiente e banco | Concluído |
| Revisão das regras de segurança de acesso em Server Actions e navegação de perfis | Concluído |

## 2. Rituais que participei

- [x] Dailies/weeklies
- [x] Sprint Review
- [x] Retrospectiva

## 3. PRs de colegas que revisei

| PR | Autor | Comentário resumido |
|---|---|---|
| PR #1 (feat/sprint-4-e8-e9) | Artur Ruiz / Tobias Fonsatti | Revisão dos testes unitários, validações analíticas e integração de constraints do banco |

## 4. Dificuldades e o que aprendi

- Aprendi a configurar um container Docker multi-stage otimizado para Next.js no modo standalone, reduzindo significativamente o tamanho da imagem final.
- Ajuste das permissões de DDL no PostgreSQL do Supabase, compreendendo as particularidades entre conexões diretas (session mode) e conexões através do pooler (transaction mode) para execução de constraints CHECK.

## Declaração de uso de IA (§7 do Manual)

Utilizei assistentes de IA para auxílio na elaboração da configuração do container Dockerfile, formatação das constraints SQL e revisão dos cenários de teste de segurança.
