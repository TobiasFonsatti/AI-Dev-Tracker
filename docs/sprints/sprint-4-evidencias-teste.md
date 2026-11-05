# Evidências de Teste — Sprint 4 — Rastreador de Uso de IA no Desenvolvimento

**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)  
**Execução:** 05/11/2026  

| ID | Caso de teste | Tipo | Resultado | Evidência |
|---|---|---|---|---|
| CT15 | Leitura do período do filtro | Unitário | ✅ Passou | `src/lib/indicadores.test.ts` |
| CT16 | Permissão para acompanhar situação | Unitário | ✅ Passou | `src/lib/indicadores.test.ts` e `src/lib/actions/sessoes.ts` |
| CT23 | Período com início depois do fim | Unitário | ✅ Passou | `src/lib/indicadores.test.ts` |
| CT24 | Valores inválidos recusados pelo banco | Integração banco Supabase | ✅ Passou | Supabase PostgreSQL: `ck_sessao_duracao`, `ck_avaliacao_confianca` e `ck_tarefa_status` rejeitaram valores inválidos |
| CT25 | Aceite de privacidade obrigatório | Unitário | ✅ Passou | `src/lib/validacoes.test.ts` |
| CT26 | Headers de segurança | Config / Build | ✅ Passou | `next.config.ts` injeta HSTS, CSP, X-Frame-Options e X-Content-Type-Options |
| CT18 | Permissão para marcar situação como acompanhada | Ação / Auth | ✅ Passou | Bloqueio de ação e redirecionamento para perfil Desenvolvedor |
| CT19 | Sessão vinculada a projeto que o usuário não participa | Ação / Validação | ✅ Passou | Rejeitado pela verificação de vínculo `UsuarioProjeto` |
| CT20 | Tarefa pertencente a projeto divergente | Ação / Validação | ✅ Passou | Rejeitado pela conferência de `idProjeto` na tarefa |
| CT21 | Prevenção de duplicatas de situação de atenção | Lógica / Banco | ✅ Passou | Verificação de `situacaoAberta` impede múltiplos alertas pendentes para o mesmo usuário |
| CT22 | Filtro por período no histórico pessoal | Interface / Query | ✅ Passou | `lerPeriodo` aplica `gte`/`lte` na cláusula `where` da consulta de sessões |

## Cobertura automatizada nesta sprint

47 testes unitários, 100% passando. Cobertura acima de 95% das regras de negócio em `src/lib/indicadores.ts` e `src/lib/validacoes.ts`.

Comando: `npm test` (`vitest run`)

## Verificações complementares

| Verificação | Resultado |
|---|---|
| `npm run lint` | Sem erros (código 0) |
| `npm test` | 47 testes aprovados em 3 arquivos de teste |
| `npm run build` | Next.js 16 build com Turbopack concluído com sucesso (16 rotas estáticas/dinâmicas geradas) |
| `npm run db:push` | Prisma schema sincronizado com PostgreSQL do Supabase |
| `npm run db:constraints` | 11 constraints CHECK aplicadas com sucesso no PostgreSQL |
| `npm run db:seed` | Perfis, permissões e ferramentas de IA inseridos/atualizados com sucesso |
| `npm run db:seed:demo` | 4 contas de demonstração e 24 sessões geradas sem inconsistências |
