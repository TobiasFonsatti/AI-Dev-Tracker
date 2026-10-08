# Protótipo Navegável — Rastreador de Uso de IA no Desenvolvimento

**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)
**Trilha:** A1 · Laboratório de Engenharia de Software · ADS Fatec Ribeirão Preto, 2026

---

## Link do Protótipo

| Item | Valor |
|---|---|
| **Ferramenta** | Figma |
| **Link público** | https://www.figma.com/make/bpwBTpmc3LCUJGC4r89YLK/Naveg%C3%A1vel-AI-Dev-Tracker-Prototype?fullscreen=1&t=iObFK9RJhPgiiGAR-1&code-node-id=0-6 |
| **Acesso** | Visualização liberada (qualquer pessoa com o link pode ver e navegar) |

> O protótipo é **navegável** (clicável entre telas), não uma sequência de imagens
> soltas. Todos os fluxos descritos abaixo podem ser percorridos diretamente no link acima.

---

## Índice de Telas

As telas a seguir cobrem as funcionalidades **Must** do backlog (E2a) e estão organizadas
por perfil de usuário.

### Fluxo Geral (Todos os perfis)

| # | Tela | História (E2) | Descrição |
|---|---|---|---|
| 1 | **Login** | #1 | Formulário de e-mail e senha. Mensagem de erro genérica (sem revelar qual campo está incorreto). Link para cadastro. |
| 2 | **Cadastro** | #1 | Formulário de criação de conta com nome, e-mail e senha. Após cadastro, redireciona para o login. |

### Fluxo do Desenvolvedor

| # | Tela | História (E2) | Descrição |
|---|---|---|---|
| 3 | **Meus Projetos** | #2 | Lista dos projetos do desenvolvedor com nome, status e data de criação. Botão "Novo Projeto" (nome + descrição). |
| 4 | **Detalhe do Projeto / Tarefas** | #3 | Lista de tarefas do projeto selecionado com status (A fazer / Em andamento / Concluída). Botão "Nova Tarefa" (título, descrição, prioridade, prazo). |
| 5 | **Nova Sessão de Desenvolvimento** | #7 | Formulário para registrar uma sessão: seleção de projeto e tarefa, data, duração (minutos), toggle "Usou IA?". Ao ativar o toggle, revela campos de seleção da ferramenta de IA e tipo de atividade. |
| 6 | **Avaliação da Sessão** | #8, #9 | Exibida logo após salvar uma sessão. Escalas de 1 a 5 para: Produtividade, Dificuldade, Confiança, Foco, Fluidez e Qualidade do Feedback da IA. Campo de observações opcional. |
| 7 | **Meu Histórico e Indicadores** | #11 | Lista de sessões com filtros por projeto e período. Cards com indicadores pessoais: % de uso de IA, confiança média, dificuldade média. |

### Fluxo do Administrador

| # | Tela | História (E2) | Descrição |
|---|---|---|---|
| 8 | **Gestão de Usuários** | #4 | Lista de todos os usuários do sistema com nome, e-mail, perfil e status. Ações: criar, editar dados/perfil, ativar/desativar conta. |
| 9 | **Permissões por Perfil** | #5 | Tela de configuração que exibe os três perfis (Desenvolvedor, Gestor/Professor, Administrador) e as permissões associadas a cada um, com toggles para ativar/desativar. |
| 10 | **Catálogo de Ferramentas de IA** | #6 | Lista de ferramentas de IA cadastradas (nome, fornecedor, versão, status ativa/inativa). Ações: adicionar, editar e desativar. |

### Fluxo do Gestor / Professor

| # | Tela | História (E2) | Descrição |
|---|---|---|---|
| 11 | **Dashboard da Equipe** | #12, #13 | Visão agregada: total de sessões, ferramentas de IA mais usadas, médias de produtividade e confiança. Filtros por projeto, desenvolvedor e período. |
| 12 | **Situações de Atenção** | #10, #14 | Lista de desenvolvedores com situações de atenção ativas (baixa confiança + alta dificuldade + uso frequente de IA). Colunas: desenvolvedor, motivo, data de identificação. Botão "Marcar como acompanhada". |
| 13 | **Evolução dos Indicadores** | #15 | Gráfico de série temporal de um indicador selecionado (ex.: confiança média) com período configurável. Permite comparação visual ao longo do semestre. |

---

## Navegação entre Telas

```
Login ──► Cadastro (ida e volta)
  │
  ├──► [Desenvolvedor] Meus Projetos ──► Detalhe do Projeto ──► Nova Sessão ──► Avaliação
  │                                                                   │
  │                                                     Meu Histórico ◄┘
  │
  ├──► [Administrador] Gestão de Usuários
  │                    Permissões por Perfil
  │                    Catálogo de Ferramentas de IA
  │
  └──► [Gestor/Professor] Dashboard da Equipe
                          Situações de Atenção
                          Evolução dos Indicadores
```

---

## Observações de Design

- **Paleta de cores:** tons neutros com destaques em azul para ações primárias e
  vermelho/amarelo para alertas e situações de atenção.
- **Responsividade:** as telas foram projetadas para funcionar em desktop (foco
  principal) com adaptação para tablet.
- **Acessibilidade:** labels nos campos de formulário, contraste adequado, indicação
  visual de estados (hover, focus, erro).
- **Consistência:** barra lateral de navegação presente em todas as telas autenticadas,
  com ícones e labels diferenciados por perfil.

---

## Rastreabilidade — Tela × História

| Tela | Histórias cobertas |
|---|---|
| Login / Cadastro | #1 |
| Meus Projetos | #2 |
| Detalhe do Projeto / Tarefas | #3 |
| Gestão de Usuários | #4 |
| Permissões por Perfil | #5 |
| Catálogo de Ferramentas de IA | #6 |
| Nova Sessão de Desenvolvimento | #7 |
| Avaliação da Sessão | #8, #9 |
| Situações de Atenção | #10, #14 |
| Meu Histórico e Indicadores | #11 |
| Dashboard da Equipe | #12, #13 |
| Evolução dos Indicadores | #15 |
