# Plano de Execução — Sprint 3 — Rastreador de Uso de IA no Desenvolvimento

**Período:** 03/10/2026 a 16/10/2026  
**Equipe:** Artur Feiteiro Ruiz (2840482421032) — Tobias Gomide Fonsatti (2840482421046)  

## 1. Objetivo da sprint

Implementar a camada analítica e de visualização da plataforma: tela de histórico pessoal e indicadores do desenvolvedor (#11), dashboard agregado de uso de IA para gestores (#12), filtros combinados no dashboard (#13), acompanhamento de situações de atenção ativas (#14) e visualização de evolução temporal das métricas (#15).

## 2. Histórias selecionadas para esta sprint

| # | História | Prioridade | Estimativa | Responsável |
|---|---|---|---|---|
| #11 | Visualizar meu próprio histórico de sessões e indicadores | Should | M | Artur |
| #12 | Visualizar dashboard com indicadores agregados de uso de IA da equipe | Must | G | Tobias |
| #13 | Filtrar os indicadores do dashboard por projeto, desenvolvedor e período | Should | M | Tobias |
| #14 | Ver lista de desenvolvedores com situações de atenção ativas e marcar como acompanhada | Should | M | Artur |
| #15 | Visualizar a evolução dos indicadores ao longo das semanas/datas | Could | M | Tobias + Artur |

## 3. Critérios de aceite por história

### #11 — Histórico e indicadores pessoais
- Rota `/historico` acessível por desenvolvedores autenticados.
- Lista filtrável por projeto.
- Cards resumindo: total de sessões, percentual de uso de IA, confiança e produtividade médias.
- Alerta visual caso o usuário possua uma situação de atenção pendente.

### #12 — Dashboard da equipe
- Rota `/dashboard` com controle de acesso (restrito a GESTOR e ADMINISTRADOR).
- Métricas agregadas: total de sessões, taxa de adoção de IA (%), médias de produtividade e confiança.
- Relação das ferramentas de IA mais utilizadas na equipe.

### #13 — Filtros do dashboard
- Filtro por projeto e por desenvolvedor.
- Combinação de filtros funcionando de forma integrada.
- Opção de limpar filtros.

### #14 — Acompanhar situações de atenção
- Painel destacado no dashboard exibindo desenvolvedores com situações de atenção abertas.
- Ação para o gestor inserir nota de acompanhamento e marcar a situação como "Acompanhada".

### #15 — Evolução temporal
- Seção no dashboard exibindo as sessões e taxa de uso de IA por data/semana.

## 4. Tarefas técnicas e distribuição

| Tarefa | Responsável | Status |
|---|---|---|
| Módulo de cálculo puro de indicadores (`src/lib/indicadores.ts`) | Artur | Concluído |
| Testes unitários de indicadores e regras de alerta (`src/lib/indicadores.test.ts`) | Artur | Concluído |
| Server action para registro de sessão e acompanhamento de situação (`src/lib/actions/sessoes.ts`) | Tobias | Concluído |
| Página e formulário de Nova Sessão (`/sessoes/nova`) | Tobias | Concluído |
| Página de Histórico do Desenvolvedor (`/historico`) | Artur | Concluído |
| Página de Dashboard Gerencial com filtros e gráficos (`/dashboard`) | Tobias | Concluído |
| Atualização da barra de navegação com novos acessos (`navbar.tsx`) | Artur | Concluído |
| Documentação da Sprint 3 e atualização do backlog | Artur + Tobias | Concluído |

## 5. Definição de Pronto (DoD) desta sprint

- [x] Código com histórias #11 a #15 implementado na branch principal
- [x] Testes automatizados executando com 100% de sucesso (`npm run test`)
- [x] Documentação da Sprint 3 entregue conforme modelos do curso
- [x] Backlog atualizado com o encerramento da Sprint 3
