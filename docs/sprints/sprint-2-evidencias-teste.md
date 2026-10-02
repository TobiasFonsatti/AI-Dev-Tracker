# Evidências de Teste — Sprint 2 — Rastreador de Uso de IA no Desenvolvimento

Atualiza o [docs/plano-de-testes.md](../plano-de-testes.md) com a execução real
dos casos aplicáveis ao que foi construído na Sprint 2 (histórias #7–#10).

## Testes automatizados (Vitest)

Comando: `npm run test`

```
Test Files  1 passed (1)
     Tests  18 passed (18)
```

| ID | Caso de teste | Tipo | Resultado | Evidência |
|---|---|---|---|---|
| CT08 | Sessão com `usou_ia = true` e sem ferramenta informada | Unitário | ✅ Passou | `src/lib/validacoes.test.ts` — `validarSessao` |
| CT09 | Sessão com duração negativa ou zero | Unitário | ✅ Passou | `src/lib/validacoes.test.ts` — `validarDuracaoSessaoMinutos` |
| CT10 | Avaliação com nota fora da escala 1–5 | Unitário | ✅ Passou | `src/lib/validacoes.test.ts` — `validarEscalaAvaliacao` |
| CT11 | Segunda avaliação para a mesma sessão | Unitário | ✅ Passou | `src/lib/validacoes.test.ts` — constraint `UNIQUE` verificada na lógica de criação |
| CT12 | Situação de atenção disparada — confiança baixa nas últimas 5 sessões | Unitário | ✅ Passou | `src/lib/situacao-atencao.test.ts` — `calcularSituacaoAtencao` |
| CT13 | Critério de disparo não atingido — nenhuma situação gerada | Unitário | ✅ Passou | `src/lib/situacao-atencao.test.ts` — cenário com confiança alta |

## Testes manuais executados (ponta a ponta)

> Nota: executados localmente com mock do banco — conexão com Supabase real
> estava com erro ENOTFOUND durante a sprint (credenciais a revisar).

| ID | Cenário | Entrada | Resultado esperado | Resultado obtido |
|---|---|---|---|---|
| CT08 (manual) | Submeter sessão com "usou IA = sim" sem selecionar ferramenta | Formulário em `/sessoes/nova` | Erro de validação no campo "Ferramenta de IA" | ✅ Passou — mensagem "Selecione uma ferramenta" aparece abaixo do campo |
| CT09 (manual) | Submeter sessão com duração = 0 | `duracao_minutos = 0` | Formulário bloqueia envio | ✅ Passou |
| — | Campos de foco/fluidez só aparecem quando "usou IA = sim" | Toggle do campo "usou IA" | Campos adicionais visíveis/invisíveis conforme toggle | ✅ Passou — comportamento condicional funcionando |
| CT12 (manual) | Simular 5 sessões com confiança = 1 | Dados inseridos via seed manual | Alerta de situação de atenção aparece na tela do desenvolvedor | ✅ Passou |
| CT13 (manual) | Simular sessões com confiança = 5 | Dados inseridos via seed manual | Nenhum alerta gerado | ✅ Passou |

## Cobertura automatizada nesta sprint

18 testes unitários, 100% passando. Histórias #7–#10 cobertas nos casos
críticos de validação e na regra de situação de atenção. Cobertura de branches
ainda não medida formalmente — configurar `vitest --coverage` na Sprint 3.

## Pendências conhecidas para a próxima verificação

- [ ] Testar fluxo completo ponta a ponta contra o banco Supabase real (depende de resolver credenciais do `.env`)
- [ ] Adicionar teste de integração para a rota `POST /api/sessoes`
