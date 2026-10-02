# Relatório de Entrega — Sprint 2 — Rastreador de Uso de IA no Desenvolvimento

**Período:** 25/09/2026 a 02/10/2026
**Equipe:** Artur Feiteiro Ruiz (2840482421032) — Tobias Gomide Fonsatti (2840482421046)
**Sprint Review:** 02/10/2026

## 1. Planejado vs. entregue

| História | Planejada? | Entregue? | Observação |
|---|---|---|---|
| #7 — Registrar sessão de desenvolvimento | Sim | ✅ Sim | /sessoes/nova — formulário completo com projeto, tarefa, duração, uso de IA, ferramenta e tipo de atividade |
| #8 — Avaliação de produtividade, dificuldade e confiança | Sim | ✅ Sim | Campos de escala 1–5 ao final do formulário de sessão; vinculados à sessão no banco |
| #9 — Avaliação de foco, fluidez e qualidade do feedback da IA (Should) | Sim | ✅ Sim | Campos adicionais exibidos condicionalmente quando "usou IA = verdadeiro" |
| #10 — Identificação automática de situações de atenção | Sim | ✅ Sim | Cálculo nas últimas 5 sessões; critério documentado em docs/backlog.md; alerta visível para desenvolvedor e gestor |

## 2. Incremento funcional demonstrável

Fluxo demonstrável nesta sprint:

1. Login como Desenvolvedor → /sessoes/nova
2. Preenchimento do formulário de sessão (projeto, tarefa, data, duração, uso de IA, ferramenta, tipo de atividade)
3. Avaliação de percepção ao final: produtividade, dificuldade, confiança (1–5)
4. Se "usou IA = sim": campos adicionais de foco, fluidez e qualidade do feedback (#9)
5. Sessão salva; sistema roda regra de situação de atenção (#10) automaticamente
6. Alerta visível na dashboard do desenvolvedor e na tela do gestor quando critério é atingido

**Como reproduzir localmente:** ver [README.md](../../README.md).

## 3. Backlog atualizado

Ver [docs/backlog.md](../backlog.md), seção "Atualização de status — Sprint 2".

## 4. Evidências de teste

Resumo — detalhe completo em [sprint-2-evidencias-teste.md](sprint-2-evidencias-teste.md).

- Testes unitários automatizados (Vitest): [preencher quantidade e resultado]
- Fluxos #7 a #10 verificados manualmente ponta a ponta

## 5. Retrospectiva e contribuição individual

- Ata de retrospectiva: [sprint-2-retrospectiva.md](sprint-2-retrospectiva.md)
- Contribuição individual: [sprint-2-contribuicao-tobias.md](sprint-2-contribuicao-tobias.md), [sprint-2-contribuicao-artur.md](sprint-2-contribuicao-artur.md)

## 6. Riscos/impedimentos para a próxima sprint (Sprint 3)

| Risco/impedimento | Impacto | Mitigação |
|---|---|---|
| Dashboard de gestor (histórias #11–#14) é a maior entrega — complexidade alta | Alto | Iniciar planejamento na semana 1 da Sprint 3; priorizar #11 e #12 (Must) antes de #13–#14 (Should) |
| Deploy ainda pendente (Sprint 4) | Médio | Confirmar ambiente Oracle Cloud/Cloudflare antes do fim da Sprint 3 |
| Artur precisa aumentar participação em código/commits | Alto | Definir histórias específicas para Artur na Sprint 3 na reunião de planejamento |
