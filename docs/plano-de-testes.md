# Plano de Testes — Rastreador de Uso de IA no Desenvolvimento

**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)
**Versão:** inicial (E4) — atualizada a cada sprint até a E9

## 1. Estratégia

| Tipo de teste | O que cobre | Ferramenta | Quando roda |
|---|---|---|---|
| Unitário | Regras de negócio isoladas: cálculo/identificação de situação de atenção, validação de escala de avaliação (1–5), obrigatoriedade condicional de campos quando `usou_ia = true` | Vitest | A cada PR (CI) |
| Integração | Rotas de API (autenticação via Supabase, CRUD de projeto/tarefa/sessão, geração de situação de atenção) contra banco de teste | Vitest + requisições HTTP à API do Next.js | A cada PR (CI), a partir da Sprint 1 (funcionalidades de auth/cadastro) |
| Manual/aceitação | Fluxos completos de ponta a ponta (Desenvolvedor registra sessão → avaliação → situação de atenção aparece para o Gestor no dashboard) | Roteiro manual | Ao fim de cada sprint, antes da Sprint Review |

## 2. Critério de bloqueio de merge

Nenhum PR é aceito na `main` se: (a) algum teste automatizado existente quebrar; (b) uma nova
regra de negócio (ex.: cálculo de situação de atenção, validação de campos obrigatórios
condicionais) for adicionada sem teste unitário correspondente; (c) uma rota de API nova não
tiver ao menos um teste de integração cobrindo o caminho de sucesso e um caminho de erro.

## 3. Casos de teste planejados (cresce a cada sprint)

| ID | História (E2) | Cenário | Entrada | Resultado esperado | Prioridade |
|---|---|---|---|---|---|
| CT01 | #1 | Cadastro com e-mail já existente | e-mail duplicado no cadastro | Sistema recusa com mensagem de erro | Alta |
| CT02 | #1 | Login com credenciais inválidas | e-mail ou senha incorretos | Mensagem de erro genérica, sem indicar qual campo está errado | Alta |
| CT03 | #2 | Cadastro de projeto com nome vazio | nome = "" | Sistema recusa o cadastro | Alta |
| CT04 | #3 | Cadastro de tarefa sem projeto vinculado | tarefa sem `id_projeto` | Sistema recusa — projeto é obrigatório | Alta |
| CT05 | #4 | Desativação de usuário | admin desativa uma conta | Usuário desativado não consegue mais fazer login | Alta |
| CT06 | #5 | Desenvolvedor tenta acessar dashboard agregado | requisição de um usuário com perfil Desenvolvedor | Acesso bloqueado com mensagem clara (403) | Alta |
| CT07 | #6 | Ferramenta de IA desativada | `ativa = false` | Ferramenta não aparece mais como opção ao registrar nova sessão | Média |
| CT08 | #7 | Sessão com `usou_ia = true` e sem ferramenta informada | ferramenta ausente | Sistema recusa — ferramenta e tipo de atividade tornam-se obrigatórios | Alta |
| CT09 | #7 | Sessão com duração negativa ou zero | `duracao_minutos = 0` | Sistema recusa (validação de interface + constraint `CHECK` no banco) | Alta |
| CT10 | #8 | Avaliação com nota fora da escala 1–5 | `produtividade = 7` | Sistema recusa a avaliação | Alta |
| CT11 | #8 | Segunda avaliação para a mesma sessão | tentativa de criar 2ª `avaliacao_sessao` para o mesmo `id_sessao` | Sistema bloqueia (constraint `UNIQUE` em `id_sessao`) | Alta |
| CT12 | #10 | Uso frequente de IA associado a baixa confiança | últimas 5 sessões com `usou_ia = true` e `confianca <= 2` | Sistema gera uma `situacao_atencao` visível para o desenvolvedor e para o gestor responsável | Alta |
| CT13 | #10 | Critério de disparo não atingido | sessões recentes com confiança alta | Nenhuma situação de atenção é criada | Média |
| CT14 | #12 | Dashboard agregado por período | sessões de vários desenvolvedores num mês | Totais e médias exibidos batem com a soma manual dos registros | Alta |
| CT15 | #13 | Filtro combinado projeto + período no dashboard | filtro aplicado | Todos os indicadores da tela são recalculados conforme o filtro | Média |
| CT16 | #14 | Gestor marca situação de atenção como acompanhada | ação de "marcar acompanhada" | Campo `acompanhada` muda para `true` e reflete na listagem | Média |
| CT17 | #16 | Envio de formulário com campo obrigatório vazio | campo obrigatório não preenchido | Erro de validação específico do campo, tanto na interface quanto rejeitado pelo banco (`NOT NULL`) | Alta |

*(A partir da E5, cada linha nova aqui precisa de uma evidência de execução correspondente —
ver `docs/sprints/sprint-N-evidencias-teste.md`.)*
