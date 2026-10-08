# Plano de Execução — Sprint 2 — Rastreador de Uso de IA no Desenvolvimento

**Período:** 25/09/2026 a 02/10/2026
**Equipe:** Artur Feiteiro Ruiz (2840482421032) — Tobias Gomide Fonsatti (2840482421046)

## 1. Objetivo da sprint

Implementar o núcleo funcional da aplicação: registro de sessão de desenvolvimento com uso de IA (#7), avaliação de percepção do desenvolvedor (#8 e #9) e identificação automática de situações de atenção (#10).

## 2. Histórias selecionadas para esta sprint

| # | História | Prioridade | Estimativa | Responsável |
|---|---|---|---|---|
| #7 | Registrar sessão de desenvolvimento (projeto, tarefa, data, duração, uso de IA, ferramenta, tipo de atividade) | Must | G | Tobias |
| #8 | Avaliar produtividade, dificuldade e confiança ao final da sessão | Must | M | Tobias |
| #9 | Avaliar foco, fluidez e qualidade do feedback da IA (Should) | Should | P | Tobias |
| #10 | Identificação automática de situações de atenção | Must | G | Tobias + Artur |

## 3. Critérios de aceite por história

### #7 — Registrar sessão
- Sessão exige projeto e tarefa válidos (previamente cadastrados)
- Campos obrigatórios: projeto, tarefa, data, duração (numérica positiva), usou IA (bool)
- Se usou IA = true → ferramenta de IA e tipo de atividade tornam-se obrigatórios
- Duração em minutos, número inteiro positivo

### #8 — Avaliação percepção
- Escalas de 1 a 5 para produtividade, dificuldade e confiança
- Observações textuais opcionais
- Avaliação vinculada à sessão no banco (mesma transação ou logo após criar sessão)

### #9 — Avaliação IA estendida (Should)
- Campos extras: foco, fluidez, qualidade do feedback (escala 1–5)
- Só aparecem quando "usou IA = verdadeiro"
- Dados disponíveis para os indicadores do dashboard

### #10 — Situação de atenção
- Critério de disparo: nas últimas 5 sessões com uso de IA, confiança média < 2,5 OU dificuldade média > 3,5
- Cálculo executado ao salvar cada sessão (trigger na API)
- Alerta visível: no perfil do desenvolvedor e na lista de gestores
- Critério documentado no backlog

## 4. Tarefas técnicas

| Tarefa | Responsável | Status |
|---|---|---|
| Criar tabela sessao e avaliacao_sessao no schema Prisma | Tobias | Concluído |
| API Route POST /api/sessoes | Tobias | Concluído |
| API Route GET /api/sessoes (listagem por usuário) | Tobias | Concluído |
| Página /sessoes/nova — formulário React | Tobias | Concluído |
| Lógica de situação de atenção (função utilitária) | Tobias | Concluído |
| Testes unitários da regra de situação de atenção | Artur | Concluído |
| Atualizar backlog com status Sprint 2 | Artur | Concluído |
| Documentar critério de disparo no backlog.md | Artur | Concluído |

## 5. Definição de Pronto (DoD) desta sprint

- [x] Código no repositório na branch main (via PR revisado)
- [x] Testes unitários passando (`npm run test`)
- [ ] Fluxo demonstrado ponta a ponta contra banco real (Supabase — dependente de revisão de credenciais do .env)
- [x] Backlog atualizado
- [x] Documentos da entrega no repositório
