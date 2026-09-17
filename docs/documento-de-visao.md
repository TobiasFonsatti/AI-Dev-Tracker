# Documento de Visão — Plataforma de Acompanhamento do Uso de IA no Desenvolvimento

**Equipe:** Artur Feiteiro Ruiz (2840482421032) — Tobias Gomide Fonsatti (2840482421046)
**Trilha:** A1
**Origem do problema:** adaptação de TCC
**Data:** 17/08/2026

## 1. Problema

O uso de ferramentas de inteligência artificial generativa está modificando a maneira
como desenvolvedores realizam atividades de programação. O conceito de "Vibe
Coding", apresentado no TCC, descreve uma forma de desenvolvimento em que o
programador utiliza linguagem natural e sugestões de modelos de linguagem para
produzir software, reduzindo a necessidade de escrever e compreender
individualmente cada trecho de código. Essa mudança pode deslocar parte do esforço
do desenvolvedor da escrita do código para sua revisão, avaliação e orquestração.

Apesar do potencial de ganho de produtividade e redução da carga cognitiva, o uso de
IA também apresenta riscos. O TCC destaca especialmente a possibilidade de o
desenvolvedor aceitar código gerado pela IA sem compreender adequadamente sua
lógica, além de problemas relacionados à dependência das ferramentas e à perda de
autonomia técnica.

Atualmente, um desenvolvedor pode utilizar diferentes ferramentas de IA durante suas
atividades sem possuir um mecanismo organizado para registrar como essas
ferramentas foram utilizadas, quais tipos de tarefas foram realizadas, quanto o
desenvolvedor confiou nas sugestões recebidas e quais dificuldades ou benefícios
foram percebidos durante o processo.

Na ausência de uma ferramenta específica, esse acompanhamento depende de
anotações individuais ou simplesmente da percepção do próprio desenvolvedor,
dificultando a organização dessas informações e a identificação de padrões de uso.

> **Pendência da devolutiva:** trazer números concretos (pessoas afetadas, tempo perdido) — ver ação em aberto no README.

## 2. Público-alvo e perfis de usuário

| Perfil | Quem é | O que faz no sistema |
|---|---|---|
| Desenvolvedor | Pessoa que utiliza ferramentas de IA como apoio ao desenvolvimento de software | Registra projetos, tarefas e sessões de desenvolvimento, informa as ferramentas utilizadas e avalia sua experiência |
| Gestor/Professor | Responsável por acompanhar desenvolvedores ou estudantes | Consulta indicadores consolidados e acompanha padrões de utilização das ferramentas de IA |
| Administrador | Responsável pela administração da plataforma | Gerencia usuários, projetos, ferramentas e configurações do sistema |

## 3. Visão da solução

O sistema será uma plataforma web destinada ao registro e acompanhamento do uso
de inteligência artificial durante atividades de desenvolvimento de software. O
desenvolvedor poderá registrar uma tarefa, indicar se utilizou IA, informar qual
ferramenta foi utilizada e registrar sua percepção sobre produtividade, fluidez,
dificuldade e confiança nas sugestões ou no código produzido.

A plataforma organizará essas informações e disponibilizará indicadores que permitam
acompanhar o comportamento de utilização das ferramentas ao longo do tempo. Os
dados poderão ser consultados individualmente ou de forma agregada por gestores e
professores.

A solução será inspirada nos conceitos de Experiência do Desenvolvedor apresentados
no TCC, especialmente nas dimensões de Foco, Feedback e Ferramental.

O sistema também dará atenção aos riscos associados ao uso excessivamente
dependente da IA, permitindo registrar situações nas quais o desenvolvedor possui
baixa confiança ou dificuldade para compreender o código ou a solução sugerida.

## 4. Objetivos do MVP (o que o semestre entrega)

- Permitir que desenvolvedores registrem tarefas e sessões de desenvolvimento realizadas com ou sem auxílio de IA.
- Permitir o registro das ferramentas de IA utilizadas e do tipo de atividade realizada.
- Permitir que o desenvolvedor avalie sua experiência em aspectos como produtividade percebida, fluidez, dificuldade e confiança no resultado produzido.
- Disponibilizar um dashboard com indicadores de utilização das ferramentas, produtividade percebida, confiança e dificuldades registradas.
- Permitir que gestores ou professores consultem informações agregadas dos desenvolvedores acompanhados.
- Implementar mecanismos de identificação de situações de atenção relacionadas à baixa confiança ou dificuldade de compreensão do resultado produzido pela IA.

> **Pendência da devolutiva:** reescrever os itens acima como metas mensuráveis (ex.: "reduzir de X para Y..."), não como lista de funcionalidades.

## 5. Fora de escopo (explicitamente)

- Criação de um modelo próprio de inteligência artificial.
- Desenvolvimento de um chatbot ou copiloto de programação próprio.
- Geração automática de código pelo sistema.
- Integração obrigatória com Cursor, GitHub Copilot, ChatGPT ou outras ferramentas externas.
- Análise automática do código-fonte para determinar sua qualidade, segurança ou complexidade.
- Avaliação científica ou reprodução da pesquisa acadêmica apresentada no TCC.
- Aplicativo mobile nativo.
- Métricas objetivas de produtividade de equipes de desenvolvimento, como métricas DORA.
- Análise automática de vulnerabilidades ou cobertura de testes.

Esses recursos poderão ser considerados em versões futuras. O próprio TCC aponta
como possibilidades futuras a investigação de métricas objetivas de qualidade de
código, como cobertura de testes, complexidade ciclomática e incidência de
vulnerabilidades.

## 6. Requisitos mínimos do §3 do Manual — como este projeto cobre cada um

| Requisito mínimo | Como este projeto cobre |
|---|---|
| Autenticação com 2+ perfis | O sistema terá autenticação com perfis de Desenvolvedor e Gestor/Professor, além do Administrador. Os perfis possuirão diferentes permissões de acesso. |
| 6+ entidades com relacionamento N:N | Entidades: Usuário, Perfil, Projeto, Tarefa, Sessão de Desenvolvimento, Ferramenta de IA, Atividade, Avaliação e Indicador. Um usuário pode participar de vários projetos e um projeto pode ter vários usuários; uma ferramenta pode ser usada em várias sessões e uma sessão pode registrar várias ferramentas. |
| Regra de negócio não trivial | O sistema calcula indicadores de uso e identifica situações de atenção a partir da combinação das avaliações registradas (ex.: baixa confiança associada a dificuldade elevada ou uso frequente de IA). |
| Consulta agregada (relatório/dashboard) | Dashboard com indicadores de utilização de IA, produtividade percebida, confiança, dificuldades e distribuição das ferramentas utilizadas, com filtros por período, projeto e usuário. |
| Validações em interface e banco | Validação de campos obrigatórios, escalas de avaliação, datas, relacionamentos, permissões e consistência dos registros, na interface e no banco de dados. |
| Deploy público por URL | Aplicação disponibilizada em ambiente público por meio de uma URL ao final do semestre. |
| Repositório Git com README | Repositório Git com código-fonte, documentação, instruções de execução, configuração e descrição das principais funcionalidades. |

## 7. Riscos identificados

| Risco | Impacto | Mitigação |
|---|---|---|
| Escopo muito amplo para o semestre | Alto | Priorizar registro de uso, avaliações, regras de negócio e dashboard no MVP. |
| Confusão entre o produto do Laboratório e o TCC | Alto | Tratar o sistema como adaptação prática dos conceitos do TCC, sem afirmar que dados/funcionalidades já faziam parte da pesquisa acadêmica. |
| Dependência de integrações externas | Médio | Permitir inicialmente registro manual das ferramentas utilizadas, deixando integrações para versões futuras. |
| Dificuldade para definir indicadores úteis | Médio | Usar no MVP indicadores ligados diretamente aos conceitos do TCC: foco, feedback, ferramental, produtividade percebida e confiança. |
| Interpretação incorreta dos indicadores | Médio | Apresentar resultados como registros/percepções dos usuários, evitando tratá-los como medidas científicas objetivas. |
| Complexidade da modelagem | Médio | Definir previamente entidades, relacionamentos e regras de negócio antes da implementação. |
