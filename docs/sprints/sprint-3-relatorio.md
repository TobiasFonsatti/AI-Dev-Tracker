# Relatório de Entrega — Sprint 3 — Rastreador de Uso de IA no Desenvolvimento

**Período:** 03/10/2026 a 16/10/2026  
**Equipe:** Artur Feiteiro Ruiz (2840482421032) — Tobias Gomide Fonsatti (2840482421046)  
**Sprint Review:** 16/10/2026  

## 1. Planejado vs. entregue

| História | Planejada? | Entregue? | Observação |
|---|---|---|---|
| #11 — Histórico e indicadores pessoais | Sim | ✅ Sim | Tela `/historico` completa com cards de métricas, filtro por projeto e lista de sessões com avaliação |
| #12 — Dashboard de indicadores agregados da equipe | Sim | ✅ Sim | Tela `/dashboard` restrita a perfis GESTOR e ADMINISTRADOR, consolidando volume, taxa de uso de IA e ferramentas líderes |
| #13 — Filtros no dashboard da equipe | Sim | ✅ Sim | Filtros combinados por projeto e desenvolvedor |
| #14 — Acompanhamento de situações de atenção | Sim | ✅ Sim | Painel em destaque no topo do dashboard com ação de resolução/acompanhamento de alertas |
| #15 — Evolução temporal dos indicadores | Sim | ✅ Sim | Gráfico de barras de progresso mostrando a taxa de adoção de IA por período |

## 2. Incremento funcional demonstrável

Fluxo implementado nesta sprint:

1. **Visão do Desenvolvedor (`/historico`):**
   - Usuário consulta suas próprias sessões.
   - Visualiza métricas de taxa de IA, produtividade média e confiança média.
   - Filtra sessões por projeto e vê alertas de situação de atenção pessoais caso o critério de risco seja atingido.
2. **Visão do Gestor/Admin (`/dashboard`):**
   - Controle de permissão via perfil (`GESTOR` ou `ADMINISTRADOR`).
   - Visão panorâmica da equipe com taxa de adesão a IA e ferramentas mais populares.
   - Filtros dinâmicos por projeto ou membro da equipe.
   - Painel de controle de situações de atenção ativas com botão "Marcar Acompanhada" e campo de anotações.
   - Visualização da evolução temporal das sessões.
3. **Módulo de regras analíticas (`src/lib/indicadores.ts`):**
   - Módulo isolado e coberto por testes unitários contínuos garantindo a integridade dos cálculos.

## 3. Evidências de teste

- 23 testes unitários automatizados executados com sucesso via Vitest (`npm run test`).
- Casos cobrindo validações de entrada, fórmulas estatísticas e gatilhos de alerta.
- Detalhes em [docs/sprints/sprint-3-evidencias-teste.md](sprint-3-evidencias-teste.md).

## 4. Retrospectiva e contribuições individuais

- [Ata de retrospectiva da Sprint 3](sprint-3-retrospectiva.md)
- [Contribuição individual - Tobias Fonsatti](sprint-3-contribuicao-tobias.md)
- [Contribuição individual - Artur Ruiz](sprint-3-contribuicao-artur.md)

## 5. Riscos/impedimentos para a Sprint 4 (Final)

| Risco/impedimento | Impacto | Mitigação |
|---|---|---|
| Hospedagem pública para avaliação externa (#17) | Alto | Configurar deploy na Vercel/Oracle Cloud na primeira metade da Sprint 4 |
| Validações ponta a ponta na UI e no banco (#16) | Médio | Revisar consistência dos schemas e formulários |
| Finalização do README para reprodução do zero (#18) | Baixo | Validar instruções em máquina limpa |
