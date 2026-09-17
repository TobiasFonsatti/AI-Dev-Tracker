# Diagramas UML — Rastreador de Uso de IA no Desenvolvimento

**Equipe:** Artur Feiteiro Ruiz (2840482421032) — Tobias Gomide Fonsatti (2840482421046)

## 1. Diagrama de Casos de Uso

```mermaid
flowchart LR
  Dev((Desenvolvedor))
  Gest((Gestor/Professor))
  Adm((Administrador))

  Dev --> UC1[Cadastrar-se e fazer login]
  Dev --> UC2[Cadastrar projetos]
  Dev --> UC3[Cadastrar tarefas]
  Dev --> UC4[Registrar sessão de desenvolvimento]
  Dev --> UC5[Avaliar experiência da sessão]
  Dev --> UC6[Visualizar meu histórico e indicadores]

  Gest --> UC7[Identificar situações de atenção]
  Gest --> UC8[Consultar dashboard da equipe]
  Gest --> UC9[Filtrar indicadores do dashboard]
  Gest --> UC10[Acompanhar situações de atenção]
  Gest --> UC11[Visualizar evolução dos indicadores]

  Adm --> UC12[Gerenciar usuários]
  Adm --> UC13[Definir permissões por perfil]
  Adm --> UC14[Gerenciar ferramentas de IA]

  UC4 -.-> UC15[Validar dados]
  UC5 -.-> UC15
  UC12 -.-> UC15
  UC14 -.-> UC15
  UC4 -.include.-> UC7
```

## 2. Diagrama de Classes

```mermaid
classDiagram
  class Usuario {
    +id: int
    +nome: string
    +email: string
    +senhaHash: string
    +perfil: enum
    +status: enum
  }
  class Projeto {
    +id: int
    +nome: string
    +descricao: string
    +dataCriacao: date
  }
  class Tarefa {
    +id: int
    +titulo: string
    +descricao: string
    +status: enum
  }
  class SessaoDesenvolvimento {
    +id: int
    +data: date
    +duracao: int
    +usouIA: bool
    +tipoAtividade: string
  }
  class FerramentaIA {
    +id: int
    +nome: string
    +ativa: bool
  }
  class AvaliacaoSessao {
    +id: int
    +produtividade: int
    +dificuldade: int
    +confianca: int
    +foco: int
    +fluidez: int
    +qualidadeFeedback: int
    +observacoes: string
  }
  class SituacaoAtencao {
    +id: int
    +motivo: string
    +dataIdentificacao: date
    +acompanhada: bool
  }
  class Dashboard {
    +periodoInicio: date
    +periodoFim: date
  }

  Usuario "N" -- "N" Projeto : participa
  Projeto "1" -- "N" Tarefa : possui
  Usuario "N" -- "N" Tarefa : associado
  Usuario "1" -- "N" SessaoDesenvolvimento : registra
  Projeto "1" -- "N" SessaoDesenvolvimento : contexto
  Tarefa "1" -- "N" SessaoDesenvolvimento : relacionada
  FerramentaIA "1" -- "N" SessaoDesenvolvimento : utilizada
  SessaoDesenvolvimento "1" -- "0..1" AvaliacaoSessao : recebe
  SessaoDesenvolvimento "1" -- "N" SituacaoAtencao : pode gerar
  Usuario "1" -- "N" SituacaoAtencao : possui
  Dashboard "1" -- "N" Usuario : consolida
  Dashboard "1" -- "N" Projeto : filtra
```

## 3. Rastreabilidade — caso de uso → história do backlog

| Caso de uso | História(s) relacionada(s) (E2) |
|---|---|
| Cadastrar-se e fazer login | #1 |
| Cadastrar projetos | #2 |
| Cadastrar tarefas | #3 |
| Gerenciar usuários | #4 |
| Definir permissões por perfil | #5 |
| Gerenciar ferramentas de IA | #6 |
| Registrar sessão de desenvolvimento | #7 |
| Avaliar experiência da sessão | #8, #9 |
| Identificar situações de atenção | #10 |
| Visualizar meu histórico e indicadores | #11 |
| Consultar dashboard da equipe | #12 |
| Filtrar indicadores do dashboard | #13 |
| Acompanhar situações de atenção | #14 |
| Visualizar evolução dos indicadores | #15 |
| Validar dados | #16 |
| Aplicação pública por URL | #17 |
| README completo no repositório | #18 |
