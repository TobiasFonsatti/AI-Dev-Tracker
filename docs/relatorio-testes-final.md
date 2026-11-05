# Relatório de Testes Executados — Rastreador de Uso de IA no Desenvolvimento

**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)  
**Data da bateria final:** 05/11/2026  
**Escopo testado:** funcionalidades do Termo de Aceite do Projeto (E2)  

## 1. Resumo executivo

| Métrica | Valor |
|---|---|
| Total de casos de teste | 26 |
| Passaram | 26 |
| Falharam | 0 |
| Pendentes de execução | 0 |
| Testes automatizados | 47, todos passando |
| Cobertura automatizada das regras de negócio | >95% das linhas e >90% dos branches (`indicadores.ts` e `validacoes.ts`) |

## 2. Casos de teste — visão consolidada

| ID | Área | Tipo | Resultado | Observação |
|---|---|---|---|---|
| CT01 | Cadastro | Manual / Ação | ✅ Passou | E-mail duplicado checado no banco e rejeitado com mensagem de erro amigável |
| CT02 | Login | Manual / Ação | ✅ Passou | Credenciais inválidas retornam erro genérico sem expor existência de usuário |
| CT03 | Projetos | Unitário | ✅ Passou | `validacoes.test.ts` — rejeita nome vazio ou com espaços |
| CT04 | Tarefas | Manual / Ação | ✅ Passou | Criação de tarefa exige projeto válido e permissão de vínculo |
| CT05 | Usuários | Manual / Ação | ✅ Passou | Usuário com status `INATIVO` ou `BLOQUEADO` tem sessão revogada e login bloqueado |
| CT06 | Permissões | Manual / Ação | ✅ Passou | Desenvolvedor redirecionado para `/historico` ao tentar acessar `/dashboard` |
| CT07 | Ferramentas de IA | Manual / Tela | ✅ Passou | Ferramentas com `ativa = false` não aparecem na listagem do formulário de sessão |
| CT08 | Sessão | Unitário | ✅ Passou | `indicadores.test.ts` e `validacoes.test.ts` — ferramenta e atividade obrigatórias com IA |
| CT09 | Sessão | Banco Supabase | ✅ Passou | Recusado por constraint `ck_sessao_duracao` e validação de schema |
| CT10 | Avaliação | Unitário | ✅ Passou | `indicadores.test.ts` e `validacoes.test.ts` — notas restritas à escala 1 a 5 |
| CT11 | Avaliação | Banco Supabase | ✅ Passou | Segunda avaliação bloqueada pela constraint UNIQUE `avaliacao_sessao_id_sessao_key` |
| CT12 | Situação de atenção | Unitário | ✅ Passou | `indicadores.test.ts` e seed demo — alerta gerado para confiança baixa recorrente |
| CT13 | Situação de atenção | Unitário | ✅ Passou | `indicadores.test.ts` — confiança alta não dispara alerta |
| CT14 | Dashboard | Analítico | ✅ Passou | Totais consolidados conferidos contra agregação do seed demo |
| CT15 | Dashboard | Unitário / Tela | ✅ Passou | `indicadores.test.ts` — `lerPeriodo` filtra datas e recalcula totais |
| CT16 | Situação de atenção | Manual / Ação | ✅ Passou | Gestor atualiza `acompanhada = true` com observações registradas |
| CT17 | Validações | Manual / Ação | ✅ Passou | Campos obrigatórios recusados em tela e protegidos por NOT NULL |
| CT18 | Permissões | Ação | ✅ Passou | Desenvolvedor bloqueado ao tentar marcar situação como acompanhada |
| CT19 | Sessão | Ação | ✅ Passou | Sessão recusada se o usuário não participa do projeto selecionado |
| CT20 | Sessão | Ação | ✅ Passou | Sessão recusada se a tarefa informada não pertence ao projeto selecionado |
| CT21 | Situação de atenção | Lógica / Ação | ✅ Passou | Verificação `situacaoAberta` impede abertura de alerta duplicado |
| CT22 | Histórico | Tela / Ação | ✅ Passou | Filtro por período restringe a listagem de sessões no histórico pessoal |
| CT23 | Filtros | Unitário | ✅ Passou | `indicadores.test.ts` — início posterior ao fim exibe mensagem de erro |
| CT24 | Banco | Banco Supabase | ✅ Passou | Constraints `ck_sessao_duracao`, `ck_avaliacao_confianca` e `ck_tarefa_status` validadas |
| CT25 | Cadastro | Unitário | ✅ Passou | `validacoes.test.ts` — aceite do aviso de privacidade obrigatório |
| CT26 | Segurança | Cabeçalhos HTTP | ✅ Passou | Respostas incluem HSTS, CSP, X-Frame-Options e nosniff via `next.config.ts` |

## 3. Bugs encontrados e corrigidos nesta bateria

| # | Descrição | Severidade | Status |
|---|---|---|---|
| 1 | Qualquer usuário logado podia marcar uma situação de atenção como acompanhada | Alta | Corrigido |
| 2 | Usuário desativado continuava conseguindo logar | Alta | Corrigido |
| 3 | Filtro por período ausente no dashboard e no histórico | Alta | Corrigido |
| 4 | Constraints `CHECK` do `schema.sql` não são criadas pelo `prisma db push` | Média | Corrigido via `npm run db:constraints` |
| 5 | Sessão aceitava projeto de outro usuário, tarefa de outro projeto e ferramenta inativa | Média | Corrigido |
| 6 | Cada nova sessão gerava outra situação de atenção enquanto o critério seguia ativo | Média | Corrigido |
| 7 | Nota vazia ou não numérica passava pela validação | Média | Corrigido |
| 8 | Era possível alterar o status de uma tarefa de outro projeto | Média | Corrigido |
| 9 | Filtros com valor inválido na URL causavam erro na página | Baixa | Corrigido |
| 10 | Datas podiam aparecer um dia antes em servidores no fuso do Brasil | Baixa | Corrigido |
| 11 | Banco e Auth do Supabase inacessíveis ("tenant/user not found") | Alta | Corrigido (instância reativada e testada) |

## 4. Testes de aceitação com cliente/PO

**Data:** 05/11/2026  
**Participantes:** Artur Feiteiro Ruiz (Desenvolvedor/Qualidade) e Tobias Gomide Fonsatti (Product Owner)  
**Roteiro:** Desenvolvedor se cadastra, aceita termos de privacidade, registra sessões e recebe situação de atenção; Gestor visualiza dashboard agregado, aplica filtros por período e marca situação como acompanhada; Administrador gerencia usuários, permissões e ferramentas.  
**Resultado:** Todos os fluxos principais foram validados e aprovados conforme critérios do Termo de Aceite.

## 5. Lacunas conhecidas

- A Content Security Policy cobre `frame-ancestors`, `base-uri` e `object-src`, mantendo flexibilidade para scripts do Next.js.
- O aceite do aviso de privacidade é obrigatório para criação de conta, armazenado de forma implícita no momento do cadastro.
- A publicação no servidor com domínio próprio final está preparada via container Docker (`Dockerfile` e `docker-compose.yml`), operando atualmente no banco de dados Supabase em nuvem.
