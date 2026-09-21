# Evidências de Teste — Sprint 1 — Rastreador de Uso de IA no Desenvolvimento

Atualiza o [`docs/plano-de-testes.md`](../plano-de-testes.md) com a execução real
dos casos aplicáveis ao que foi construído na Sprint 1 (histórias #1–#6). Os
demais CTs do plano (sessão de IA, avaliação, situação de atenção, dashboard)
dependem de funcionalidades da Sprint 2 em diante e ainda não se aplicam.

## Testes automatizados (Vitest)

Comando: `npm run test`

```
Test Files  1 passed (1)
     Tests  11 passed (11)
```

| ID | Caso de teste | Tipo | Resultado | Evidência |
|---|---|---|---|---|
| CT03 | Cadastro de projeto com nome vazio | Unitário | ✅ Passou | `src/lib/validacoes.test.ts` — `validarNomeProjeto` |
| CT17 | Envio de formulário com campo obrigatório vazio (título da tarefa) | Unitário | ✅ Passou | `src/lib/validacoes.test.ts` — `validarTituloTarefa` |
| — | Cadastro com senha curta / nome ou e-mail vazio | Unitário | ✅ Passou | `src/lib/validacoes.test.ts` — `validarCadastro` (não é um CT numerado do plano original; validação real usada em `src/lib/actions/auth.ts`) |
| CT09 | Duração de sessão ≤ 0 | Unitário | ✅ Passou (validação isolada) | `src/lib/validacoes.test.ts` — `validarDuracaoSessaoMinutos`. **Atenção:** a tela de registro de sessão (história #7) ainda não existe — é Sprint 2. Esta validação foi escrita e testada com antecedência, mas não está conectada a nenhuma tela ainda. |

## Testes manuais executados (ponta a ponta, contra o Supabase real)

| ID | Cenário | Entrada | Resultado esperado | Resultado obtido |
|---|---|---|---|---|
| CT01 (adaptado) | Cadastro de novo usuário | Nome, e-mail e senha válidos, via `/cadastro` | Usuário criado no Supabase Auth e linha correspondente em `usuario` | ✅ Passou — conferido com `SELECT` direto na tabela `usuario`, `auth_user_id` bate com o `id` do Supabase Auth |
| CT02 | Login com credenciais inválidas | E-mail/senha incorretos | Mensagem de erro genérica | ✅ Passou |
| — | Login com credenciais válidas | E-mail/senha corretos, e-mail confirmado | Redireciona para `/projetos`, navbar mostra nome e perfil | ✅ Passou |
| — | Acesso não autenticado a rota protegida | Navegar para `/`, `/projetos` sem sessão | Redireciona para `/login` | ✅ Passou (middleware) |
| — | Criar projeto com nome válido | Formulário em `/projetos` | Projeto aparece na lista, vínculo criado em `usuario_projeto` | ✅ Passou |
| CT04 (adaptado) | Criar tarefa dentro de um projeto | Formulário em `/projetos/[id]` | Tarefa aparece na lista, vinculada ao projeto e ao usuário | ✅ Passou |
| — | Alterar status de uma tarefa | Selecionar novo status no dropdown | Status atualizado no banco (conferido via `SELECT`) | ✅ Passou |
| CT05 (adaptado) | Administrador desativa um usuário | Botão "Desativar" em `/admin/usuarios` | Status do usuário muda para INATIVO | ✅ Passou |
| — | Administrador concede/revoga permissão | Clique na matriz em `/admin/permissoes` | Vínculo criado/removido em `perfil_permissao` | ✅ Passou |
| CT07 (adaptado) | Desativar ferramenta de IA | Botão "Desativar" em `/admin/ferramentas-ia` | Campo `ativa` muda para `false` | ✅ Passou |
| CT06 | Usuário não-admin acessando telas de `/admin/*` | Perfil DESENVOLVEDOR tenta acessar `/admin/usuarios` | Redirecionado para `/projetos` | ✅ Passou |

## Cobertura automatizada nesta sprint

11 testes unitários, 100% passando, cobrindo as validações de entrada usadas
pelas 3 primeiras histórias (#1–#3). Cobertura de código (%) ainda não medida
— `vitest run --coverage` pode ser configurado numa próxima sprint se a
equipe quiser esse número formal.

## Pendências conhecidas para a próxima verificação

- [ ] Testar o cenário de e-mail duplicado no cadastro (Supabase deve recusar; comportamento não verificado nesta sessão)
