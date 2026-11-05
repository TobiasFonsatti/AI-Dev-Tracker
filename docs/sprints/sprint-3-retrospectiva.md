# Retrospectiva — Sprint 3

**Data:** 16/10/2026  
**Presentes:** Artur Feiteiro Ruiz (RA 2840482421032), Tobias Gomide Fonsatti (RA 2840482421046)  

## 1. Ações da sprint anterior

| Ação | Aplicada? |
|---|---|
| Artur aumentar participação no código/rotas | Sim — Artur desenvolveu o módulo de lógica analítica `indicadores.ts`, testes unitários associados e tela de histórico |
| Iniciar planejamento das telas de visualização na semana 1 | Sim — escopo do dashboard e histórico foi mapeado e estruturado logo no início da sprint |

## 2. O que funcionou bem

- A divisão de tarefas técnicas em código foi bem equilibrada nesta sprint: Artur assumiu os cálculos puros de indicadores e o histórico, enquanto Tobias implementou as server actions de persistência e a tela de dashboard.
- A cobertura de testes unitários foi expandida para 23 testes automatizados, validando as regras de negócio analíticas e os critérios da situação de atenção.
- A experiência de navegação e visualização de dados atende aos requisitos do backlog das histórias #11 a #15.

## 3. O que não funcionou tão bem / O que pode melhorar

- A integração com deploy público (requisito da Sprint 4) precisa de atenção logo no começo do ciclo para não ficar concentrada na véspera da entrega final.
- Precisamos garantir dados de sementes (seeds) ricos para que o avaliador veja o dashboard preenchido imediatamente ao subir a aplicação.

## 4. Plano de ação para a Sprint 4 (Final)

| Ação | Responsável |
|---|---|
| Configurar e testar o deploy em ambiente público estável | Tobias |
| Revisar validações completas em tela e mensagens de erro (#16) | Artur |
| Testar roteiro de execução limpa do README do zero (#18) | Artur e Tobias |
