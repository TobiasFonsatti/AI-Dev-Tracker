# Contribuição Individual — Sprint 2 — Tobias Gomide Fonsatti (RA 2840482421046)

**Papel nesta sprint:** Product Owner + Responsável por dados

## 1. O que fiz

| Item | Status |
|---|---|
| Adicionei tabelas sessao e avaliacao_sessao no schema Prisma e rodei db:push | Concluído |
| Implementei a API Route POST /api/sessoes com validação e criação da avaliação na mesma transação | Concluído |
| Criei a página /sessoes/nova com o formulário completo — campos condicionais pra quando "usou IA = sim" (#9) | Concluído |
| Implementei a função de cálculo de situação de atenção e chamada automática ao salvar sessão (#10) | Concluído |
| Abri PR e incorporei as revisões do Artur (ajuste na validação de duração) | Concluído |

## 2. Rituais que participei

- [x] Sprint Planning
- [x] Sprint Review (02/10/2026)
- [x] Retrospectiva

## 3. PRs de colegas que revisei

Não teve PR do Artur nesta sprint — ele trabalhou nos testes e na documentação direto na branch.

## 4. Dificuldades e o que aprendi

A parte mais complicada foi garantir que a avaliação fosse salva junto com a sessão sem deixar dados pela metade se desse erro. Aprendi a usar transações do Prisma (prisma.) pra resolver isso. Também levei um tempo ajustando a query de situação de atenção pra considerar só as últimas 5 sessões com IA, não todas.

## Declaração de uso de IA (§7 do Manual)

Usei IA (Claude) pra ajudar a estruturar a lógica de transação do Prisma e montar o esqueleto do formulário. As decisões de o que validar, qual critério usar pro alerta e a revisão do código foram minhas. Consigo explicar qualquer trecho se solicitado.
