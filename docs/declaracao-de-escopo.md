# Declaração de Escopo Compartilhado

**Aluno:** Artur Feiteiro Ruiz (2840482421032), Tobias Gomide Fonsatti (2840482421046)
**TCC:** O Impacto do "Vibe Coding" na Experiência do Desenvolvedor: Um Estudo sobre Produtividade e Criatividade Assistida por IA
**Orientador do TCC:** Prof. Dr. Lucas Baggio Figueira
**Produto:** Plataforma de Acompanhamento do Uso de IA no Desenvolvimento de Software
**Formato de equipe:** A1
**Data:** 20/08/2026

## 1. O que já existia antes do início do semestre (não conta como incremento)

Antes do início do semestre, já existia o trabalho acadêmico desenvolvido para o TCC,
cujo tema é o impacto do "Vibe Coding" na Experiência do Desenvolvedor, com foco
nos efeitos da assistência por inteligência artificial sobre produtividade, criatividade e
experiência durante o desenvolvimento de software.

O TCC já apresentava:

- definição do tema e do problema de pesquisa;
- fundamentação sobre o conceito de "Vibe Coding";
- estudo sobre Experiência do Desenvolvedor (DX);
- estudo sobre estado de fluxo;
- discussão sobre ferramentas de desenvolvimento assistido por inteligência artificial;
- discussão sobre produtividade, criatividade e carga cognitiva;
- identificação de possíveis benefícios e riscos relacionados ao uso de IA;
- discussão sobre dependência de ferramentas e compreensão do código produzido por IA;
- definição dos objetivos do trabalho e de possíveis trabalhos futuros.

O TCC apresenta como problema de pesquisa a investigação de como a adoção do
"Vibe Coding" pode alterar a percepção de produtividade e a qualidade da Experiência
do Desenvolvedor em projetos de pequeno e médio porte.

**Não faz parte do escopo já existente:** uma aplicação web funcional, banco de dados
do produto, sistema de autenticação, dashboard ou plataforma para acompanhamento
de desenvolvedores.

Também não serão considerados como entregas já realizadas quaisquer pesquisas,
questionários, entrevistas ou resultados empíricos que não tenham efetivamente sido
executados pela equipe.

## 2. O que será construído durante o Laboratório (conta como incremento)

Durante o Laboratório será desenvolvida uma aplicação web inspirada no problema e
nos conceitos estudados no TCC. O sistema terá como objetivo permitir o
acompanhamento estruturado da utilização de ferramentas de inteligência artificial no
desenvolvimento de software.

### 2.1 Autenticação e perfis
- Cadastro e autenticação de usuários.
- Perfil de Desenvolvedor, Gestor/Professor e Administrador.
- Controle de permissões conforme o perfil.

### 2.2 Projetos e tarefas
- Cadastro de projetos.
- Associação de desenvolvedores aos projetos.
- Cadastro de tarefas de desenvolvimento.
- Associação das tarefas aos projetos e desenvolvedores.

### 2.3 Registro de utilização de IA
O desenvolvedor poderá registrar uma sessão de desenvolvimento informando: projeto,
tarefa, data e duração, utilização ou não de IA, ferramenta utilizada, tipo de atividade
realizada, percepção de produtividade, nível de dificuldade, nível de confiança no
resultado produzido e observações sobre a utilização da IA.

### 2.4 Avaliação da experiência
Registro de avaliações relacionadas aos conceitos do TCC: foco durante a atividade,
fluidez percebida, facilidade/dificuldade da tarefa, qualidade do feedback recebido,
confiança no resultado gerado, percepção de produtividade e dependência percebida
da ferramenta. O objetivo não é reproduzir a pesquisa do TCC, mas transformar seus
conceitos em funcionalidades de acompanhamento dentro de uma aplicação.

### 2.5 Dashboard
Quantidade de sessões realizadas, quantidade de sessões com uso de IA, ferramentas
mais utilizadas, tipos de atividades realizadas com IA, produtividade percebida, nível
médio de confiança, distribuição das dificuldades e evolução dos indicadores ao longo
do tempo.

### 2.6 Regras de negócio
Cálculo de indicadores a partir das avaliações registradas, identificação de situações
de atenção, controle de quais informações cada perfil pode visualizar, consolidação de
dados de diferentes usuários/projetos, e impedimento de registros inconsistentes. Uma
situação de atenção pode, por exemplo, ser identificada quando houver uso frequente
de IA associado a baixa confiança ou elevada dificuldade de compreensão do
resultado.

### 2.7 Banco de dados e validações
Banco de dados relacional para usuários, perfis, projetos, tarefas, sessões,
ferramentas, avaliações e indicadores. Validações realizadas tanto na interface quanto
no banco, garantindo consistência e integridade dos dados.

### 2.8 Deploy e documentação
Aplicação disponibilizada publicamente por URL ao final do desenvolvimento.
Repositório Git com código-fonte e README contendo objetivo do projeto,
tecnologias utilizadas, configuração, instalação, execução, estrutura do sistema e
funcionalidades implementadas.

## 3. Como as entregas serão avaliadas separadamente

| Aspecto | Avaliado pelo TCC | Avaliado pelo Laboratório |
|---|---|---|
| Tema do Vibe Coding | Fundamentação e discussão conceitual | Utilização do tema como origem do produto |
| Experiência do Desenvolvedor | Estudo do conceito e suas dimensões | Transformação dos conceitos em funcionalidades do sistema |
| Problema de pesquisa | Investigação acadêmica sobre o impacto do Vibe Coding | Utilização do problema como inspiração para a solução tecnológica |
| Referencial teórico | Vibe Coding, DX, fluxo e IA | Não constitui entrega direta, mas fundamenta decisões do produto |
| Modelagem do banco de dados | Não constitui entrega do TCC | Modelagem e implementação do banco da aplicação |
| Autenticação | Não constitui entrega do TCC | Implementação de autenticação e múltiplos perfis |
| Cadastro de projetos e tarefas | Não constitui entrega do TCC | Implementação das funcionalidades |
| Registro de sessões de desenvolvimento | Não constitui entrega do TCC | Implementação da funcionalidade |
| Registro de uso de IA | Não constitui entrega do TCC | Implementação da funcionalidade |
| Avaliação da experiência | Conceitos relacionados são discutidos no TCC | Implementação das avaliações dentro do sistema |
| Dashboard | Não constitui entrega do TCC | Implementação de consultas agregadas e indicadores |
| Regras de negócio | Discussão conceitual sobre benefícios e riscos | Implementação das regras no sistema |
| Validações | Não constitui entrega do TCC | Validações na interface e no banco |
| Testes | Não constitui entrega do TCC | Testes das funcionalidades e regras implementadas |
| Deploy | Não constitui entrega do TCC | Aplicação disponível publicamente |
| Git e README | Não constitui entrega do TCC | Repositório e documentação do software |

## 4. Assinaturas

- Aluno: _______________________
- Ciência do orientador do TCC: _______________________ (ciência confirmada diretamente com o orientador pelo professor da disciplina)
