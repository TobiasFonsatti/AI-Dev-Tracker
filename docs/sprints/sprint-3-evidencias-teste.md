# Evidências de Teste — Sprint 3 — Rastreador de Uso de IA no Desenvolvimento

Este documento registra as evidências de validação e testes automatizados executados para as histórias da **Sprint 3 (histórias #11 a #15)** e regras analíticas consolidadas.

## 1. Testes Automatizados (Vitest)

Comando executado:
```bash
npm run test
```

### Saída da execução:
```
> ai-dev-tracker@0.1.0 test
> vitest run

 RUN  v5.0.1 C:/AI-Dev-Tracker

 ✓ src/lib/indicadores.test.ts (12 tests) 7ms
 ✓ src/lib/validacoes.test.ts (11 tests) 8ms

 Test Files  2 passed (2)
      Tests  23 passed (23)
   Duration  254ms
```

### Casos de teste automatizados da Sprint 3:

| ID | Cenário / Regra | Tipo | Arquivo | Resultado |
|---|---|---|---|---|
| CT-IND-01 | Rejeição de sessão com duração zero ou negativa | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-02 | Exigência de ferramenta quando `usouIa = true` | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-03 | Exigência de tipo de atividade quando `usouIa = true` | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-04 | Validação de notas fora do range 1 a 5 | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-05 | Aceitação de notas válidas na escala 1 a 5 | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-06 | Disparo de situação de atenção com confiança média < 2.5 (5 sessões) | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-07 | Disparo de situação de atenção com dificuldade média > 3.5 (5 sessões) | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-08 | Não disparo de alerta quando menos de 5 sessões avaliadas com IA | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-09 | Não disparo de alerta quando índices estão equilibrados | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-10 | Agregação correta de percentual de IA em sessões | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-11 | Cálculo exato de médias de produtividade e confiança agregadas | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |
| CT-IND-12 | Ordenação de ranking das ferramentas de IA mais utilizadas | Unitário | `src/lib/indicadores.test.ts` | ✅ Passou |

## 2. Testes Manuais de Interface e Fluxos de Usuário

| História | Rota | Cenário Testado | Resultado Esperado | Resultado Obtido |
|---|---|---|---|---|
| #11 | `/historico` | Desenvolvedor acessa seu histórico pessoal | Exibe cards de resumo de indicadores e tabela de sessões | ✅ Passou |
| #11 | `/historico?projetoId=X` | Filtro de sessões por projeto selecionado | Lista atualiza exibindo apenas sessões do projeto em foco | ✅ Passou |
| #12 | `/dashboard` | Usuário comum tenta acessar rota de gestor | Redirecionado para `/historico` | ✅ Passou (proteção de perfil) |
| #12 | `/dashboard` | Gestor acessa o dashboard | Visualiza indicadores agregados da equipe e ranking de IA | ✅ Passou |
| #13 | `/dashboard?projetoId=X&desenvolvedorId=Y` | Gestor aplica filtros cruzados de projeto e desenvolvedor | Métricas do dashboard recalculam com o subconjunto | ✅ Passou |
| #14 | `/dashboard` | Gestor insere observação e clica em "Marcar Acompanhada" | Alerta sai do painel de situações ativas e é persistido | ✅ Passou |
| #15 | `/dashboard` | Visualização da evolução por período | Barras mostram contagem de sessões e porcentagem de IA por data | ✅ Passou |

## 3. Resumo de Qualidade

- **Total de testes unitários:** 23 testes automatizados (100% passando).
- **Verificação estática:** código tipado em TypeScript sem erros de compilação.
