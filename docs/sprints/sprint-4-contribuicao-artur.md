# Relatório Individual de Contribuição — Sprint 4 — Artur Feiteiro Ruiz (RA 2840482421032)

**Papel nesta sprint:** Desenvolvedor Fullstack + Responsável por Qualidade

## 1. O que fiz

| Item | Status |
|---|---|
| Implementação do aviso de privacidade e conformidade com LGPD (`src/app/privacidade/page.tsx` e validação no cadastro) | Concluído |
| Implementação do filtro por período no Dashboard e no Histórico pessoal (`src/lib/indicadores.ts`) | Concluído |
| Implementação dos cabeçalhos HTTP de segurança (CSP, HSTS, X-Frame-Options) em `next.config.ts` | Concluído |
| Expansão da suíte de testes unitários para 47 casos de teste aprovados | Concluído |
| Reconciliação e validação do fluxo completo de testes manuais e automatizados (`docs/relatorio-testes-final.md`) | Concluído |

## 2. Rituais que participei

- [x] Dailies/weeklies
- [x] Sprint Review
- [x] Retrospectiva

## 3. PRs de colegas que revisei

| PR | Autor | Comentário resumido |
|---|---|---|
| PR #1 (feat/sprint-4-e8-e9) | Tobias Fonsatti / Artur Ruiz | Validação das configurações de Docker, scripts de seed e consistência do banco de dados |

## 4. Dificuldades e o que aprendi

- Aprendi a configurar e testar cabeçalhos de segurança web avançados (Content Security Policy e HTTP Strict Transport Security) em aplicações Next.js modernas.
- Aprofundei o domínio sobre manipulação e normalização de datas e fusos horários entre o frontend Next.js e o PostgreSQL via Prisma para evitar divergências em consultas temporais.

## Declaração de uso de IA (§7 do Manual)

Utilizei assistentes de IA para geração de casos de teste no Vitest, sugestão de políticas de CSP e refatoração de funções puras de validação.
