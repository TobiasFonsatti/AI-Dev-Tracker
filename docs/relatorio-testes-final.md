# Relatório de Testes Executados — Rastreador de Uso de IA no Desenvolvimento

**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)
**Data da bateria final:** 05/11/2026 (parte automatizada); [data] (parte manual)
**Escopo testado:** funcionalidades do Termo de Aceite do Projeto (E2)

> Documento em andamento. Os casos marcados como ⏳ ainda precisam ser executados na aplicação publicada, e o resultado real deve substituir a marcação.

## 1. Resumo executivo

| Métrica | Valor |
|---|---|
| Total de casos de teste | 26 |
| Passaram | 10 |
| Falharam | 0 |
| Pendentes de execução manual | 16 |
| Testes automatizados | 34, todos passando |
| Cobertura automatizada das regras de negócio | 96,59% das linhas e 91,66% dos branches (`indicadores.ts` e `validacoes.ts`) |

## 2. Casos de teste — visão consolidada

| ID | Área | Tipo | Resultado | Observação |
|---|---|---|---|---|
| CT01 | Cadastro | Manual | ⏳ Pendente | E-mail duplicado passou a ser checado antes do Supabase |
| CT02 | Login | Manual | ⏳ Pendente | |
| CT03 | Projetos | Unitário | ✅ Passou | `validacoes.test.ts` |
| CT04 | Tarefas | Manual | ⏳ Pendente | |
| CT05 | Usuários | Manual | ⏳ Pendente | Falha corrigida nesta bateria (bug 2) |
| CT06 | Permissões | Manual | ⏳ Pendente | Resultado esperado ajustado para o redirecionamento implementado |
| CT07 | Ferramentas de IA | Manual | ⏳ Pendente | |
| CT08 | Sessão | Unitário | ✅ Passou | `indicadores.test.ts` |
| CT09 | Sessão | Unitário + banco local | ✅ Passou | Falta repetir no Supabase após aplicar as constraints |
| CT10 | Avaliação | Unitário | ✅ Passou | `indicadores.test.ts` |
| CT11 | Avaliação | Manual | ⏳ Pendente | Constraint `UNIQUE` definida no schema |
| CT12 | Situação de atenção | Unitário | ✅ Passou | Falta o fluxo completo na tela |
| CT13 | Situação de atenção | Unitário | ✅ Passou | `indicadores.test.ts` |
| CT14 | Dashboard | Manual | ⏳ Pendente | O cálculo tem teste unitário; falta comparar na tela |
| CT15 | Dashboard | Manual | ⏳ Pendente | Leitura do período tem teste unitário |
| CT16 | Situação de atenção | Manual | ⏳ Pendente | Permissão tem teste unitário |
| CT17 | Validações | Manual | ⏳ Pendente | |
| CT18 | Permissões | Manual | ⏳ Pendente | Bug 1 |
| CT19 | Sessão | Manual | ⏳ Pendente | Bug 5 |
| CT20 | Sessão | Manual | ⏳ Pendente | Bug 5 |
| CT21 | Situação de atenção | Manual | ⏳ Pendente | Bug 6 |
| CT22 | Histórico | Manual | ⏳ Pendente | Bug 3 |
| CT23 | Filtros | Unitário | ✅ Passou | `indicadores.test.ts` |
| CT24 | Banco | Banco local | ✅ Passou | Falta repetir no Supabase |
| CT25 | Cadastro | Unitário | ✅ Passou | `validacoes.test.ts` |
| CT26 | Segurança | Manual | ✅ Passou | Na imagem Docker local |

## 3. Bugs encontrados nesta bateria

| # | Descrição | Severidade | Status |
|---|---|---|---|
| 1 | Qualquer usuário logado podia marcar uma situação de atenção como acompanhada | Alta | Corrigido |
| 2 | Usuário desativado continuava conseguindo logar | Alta | Corrigido |
| 3 | Filtro por período ausente no dashboard e no histórico | Alta | Corrigido |
| 4 | Constraints `CHECK` do `schema.sql` não são criadas pelo `prisma db push` | Média | Script criado; falta aplicar no Supabase |
| 5 | Sessão aceitava projeto de outro usuário, tarefa de outro projeto e ferramenta inativa | Média | Corrigido |
| 6 | Cada nova sessão gerava outra situação de atenção enquanto o critério seguia ativo | Média | Corrigido |
| 7 | Nota vazia ou não numérica passava pela validação | Média | Corrigido |
| 8 | Era possível alterar o status de uma tarefa de outro projeto | Média | Corrigido |
| 9 | Filtros com valor inválido na URL causavam erro na página | Baixa | Corrigido |
| 10 | Datas podiam aparecer um dia antes em servidores no fuso do Brasil | Baixa | Corrigido |
| 11 | Banco e Auth do Supabase inacessíveis: "tenant/user not found" e endereço do projeto não resolve | Alta | Aberto |

## 4. Testes de aceitação com cliente/PO

**Data:** [dd/mm/aaaa]
**Participantes:** [nomes]
**Roteiro:** Desenvolvedor se cadastra, registra sessões e recebe uma situação de atenção; Gestor vê o dashboard, aplica filtros e marca a situação como acompanhada; Administrador gerencia usuários, permissões e ferramentas.
**Resultado:** [preencher após a execução]

## 5. Lacunas conhecidas

- Não há testes de integração automatizados, embora o plano de testes os preveja.
- A Content Security Policy cobre `frame-ancestors`, `base-uri` e `object-src`, sem restringir scripts.
- O aceite do aviso de privacidade é exigido, mas a data do aceite não é guardada.
