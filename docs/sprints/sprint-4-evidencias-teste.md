# Evidências de Teste — Sprint 4 — Rastreador de Uso de IA no Desenvolvimento

**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)
**Execução:** 05/11/2026

| ID | Caso de teste | Tipo | Resultado | Evidência |
|---|---|---|---|---|
| CT15 | Leitura do período do filtro | Unitário | ✅ Passou | `src/lib/indicadores.test.ts` |
| CT16 | Permissão para acompanhar situação | Unitário | ✅ Passou | `src/lib/indicadores.test.ts` |
| CT23 | Período com início depois do fim | Unitário | ✅ Passou | `src/lib/indicadores.test.ts` |
| CT24 | Valores inválidos recusados pelo banco | Integração manual | ✅ Passou | Postgres 16 local: `ck_sessao_duracao`, `ck_avaliacao_confianca` e `ck_tarefa_status` recusaram os valores |
| CT25 | Aceite de privacidade obrigatório | Unitário | ✅ Passou | `src/lib/validacoes.test.ts` |
| CT26 | Headers de segurança | Manual | ✅ Passou | `curl -I` na imagem Docker local |
| CT18–CT22 | Fluxos com usuário logado | Manual | ⏳ Pendente | Dependem do acesso ao Supabase |

## Cobertura automatizada nesta sprint

34 testes, 100% passando. Cobertura de 96,59% das linhas e 91,66% dos branches em `src/lib/indicadores.ts` e `src/lib/validacoes.ts`, que concentram as regras de negócio.

Comando: `npx vitest run --coverage --coverage.include=src/lib/indicadores.ts --coverage.include=src/lib/validacoes.ts`

## Verificações complementares

| Verificação | Resultado |
|---|---|
| `npx tsc --noEmit` | Sem erros |
| `npm run lint` | Sem erros |
| `docker build` | Imagem gerada |
| Imagem rodando | `/privacidade` e `/login` responderam 200; `/dashboard` sem login redirecionou para `/login` |
| `npm run db:constraints` duas vezes em banco local | 11 constraints, sem erro na repetição |
| `npm run db:seed:demo` duas vezes em banco local, com o Supabase Auth simulado | 4 contas, 24 sessões e 1 situação de atenção; a repetição não duplicou dados |
