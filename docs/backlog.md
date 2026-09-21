# Backlog Priorizado — Plataforma de Acompanhamento do Uso de IA no Desenvolvimento

**Equipe:** Artur Feiteiro Ruiz (2840482421032) — Tobias Gomide Fonsatti (2840482421046)
**Trilha:** A1
**Data:** 28/08/2026

Legenda — **Prioridade (MoSCoW):** Must = obrigatório para o MVP · Should = importante, mas negociável · Could = desejável se sobrar tempo · Won't = fora do escopo do semestre (ver seção "Fora de escopo" da E1). **Estimativa:** P = Pequena · M = Média · G = Grande.

| # | História | Critérios de aceite | Prioridade | Estimativa | Sprint alvo |
|---|---|---|---|---|---|
| 1 | [Desenvolvedor] Como Desenvolvedor, quero me cadastrar e fazer login no sistema, para que eu possa acessar minhas informações de forma segura. | Cadastro exige nome, e-mail único e senha com requisitos mínimos de segurança; login autentica e cria sessão válida; login inválido exibe erro genérico | Must | M | Sprint 1 |
| 2 | [Desenvolvedor] Como Desenvolvedor, quero cadastrar projetos, para que eu possa organizar meu trabalho por contexto. | Projeto possui nome, descrição e data de criação; um projeto pode ter vários desenvolvedores associados; nome não pode ser vazio | Must | P | Sprint 1 |
| 3 | [Desenvolvedor] Como Desenvolvedor, quero cadastrar tarefas vinculadas a um projeto, para que eu possa registrar as atividades que estou realizando. | Tarefa vinculada obrigatoriamente a um projeto existente; possui título, descrição e status; pode ser associada a um ou mais desenvolvedores | Must | P | Sprint 1 |
| 4 | [Administrador] Como Administrador, quero gerenciar usuários (criar, editar, desativar), para que eu possa manter o controle de acesso à plataforma. | Administrador pode criar, editar e desativar contas; usuário desativado não loga mais; alterações registradas com data/hora | Must | M | Sprint 1 |
| 5 | [Administrador] Como Administrador, quero definir permissões por perfil, para que cada usuário acesse apenas o que é pertinente ao seu papel. | Cada tela/ação verifica o perfil antes de exibir/permitir; Desenvolvedor não acessa dados agregados de outros; acesso não autorizado é bloqueado | Must | M | Sprint 1 |
| 6 | [Administrador] Como Administrador, quero cadastrar e manter uma lista de ferramentas de IA, para que os desenvolvedores possam selecioná-las ao registrar uma sessão. | Ferramentas podem ser adicionadas, editadas e desativadas; ferramenta desativada não aparece mais como opção | Must | P | Sprint 1 |
| 7 | [Desenvolvedor] Como Desenvolvedor, quero registrar uma sessão de desenvolvimento (projeto, tarefa, data, duração, uso de IA, ferramenta, tipo de atividade), para que eu tenha um histórico estruturado do meu trabalho. | Sessão exige projeto/tarefa válidos; se usou IA, ferramenta e tipo de atividade tornam-se obrigatórios; duração numérica positiva | Must | G | Sprint 2 |
| 8 | [Desenvolvedor] Como Desenvolvedor, quero avaliar minha percepção de produtividade, dificuldade e confiança ao final de uma sessão, para que eu registre como a IA impactou meu trabalho. | Escala padronizada (1 a 5) para cada dimensão; observações opcionais; avaliação vinculada à sessão | Must | M | Sprint 2 |
| 9 | [Desenvolvedor] Como Desenvolvedor, quero avaliar também foco, fluidez e qualidade do feedback recebido da IA, para que a avaliação reflita os conceitos de Experiência do Desenvolvedor do TCC. | Campos adicionais só aparecem quando "usou IA" é verdadeiro; dados alimentam os indicadores do dashboard | Should | P | Sprint 2 |
| 10 | [Gestor/Professor] Como Gestor/Professor, quero que o sistema identifique automaticamente situações de atenção (ex.: uso frequente de IA + baixa confiança/alta dificuldade), para que eu possa oferecer suporte a quem precisa. | Cálculo a partir de um conjunto definido de sessões recentes (ex.: últimas 5); visível para desenvolvedor e gestor; critério de disparo documentado | Must | G | Sprint 2 |
| 11 | [Desenvolvedor] Como Desenvolvedor, quero visualizar meu próprio histórico de sessões e indicadores, para que eu acompanhe minha evolução ao longo do tempo. | Lista filtrável por projeto e período; indicadores pessoais resumem uso de IA, confiança e dificuldade médias | Should | M | Sprint 3 |
| 12 | [Gestor/Professor] Como Gestor/Professor, quero visualizar um dashboard com indicadores agregados de uso de IA da equipe, para que eu acompanhe padrões de utilização. | Mostra quantidade de sessões, ferramentas mais usadas, médias de produtividade/confiança; dados agregados por período; acesso restrito a Gestor/Administrador | Must | G | Sprint 3 |
| 13 | [Gestor/Professor] Como Gestor/Professor, quero filtrar os indicadores do dashboard por projeto, desenvolvedor e período, para que eu possa analisar dados específicos. | Filtros combinam entre si; resultado atualiza todos os indicadores da tela | Should | M | Sprint 3 |
| 14 | [Gestor/Professor] Como Gestor/Professor, quero ver a lista de desenvolvedores com situações de atenção ativas, para que eu possa agir antes que o problema se agrave. | Lista mostra desenvolvedor, motivo do alerta e data; gestor pode marcar como "acompanhada" | Should | M | Sprint 3 |
| 15 | [Gestor/Professor] Como Gestor/Professor, quero visualizar a evolução dos indicadores ao longo das semanas, para que eu identifique tendências de adoção de IA. | Gráfico de série temporal para ao menos um indicador; período configurável | Could | M | Sprint 3 |
| 16 | [Sistema] Como usuário do sistema, quero que os dados informados sejam validados na tela e no banco, para que as informações fiquem sempre consistentes. | Campos obrigatórios validados antes do envio; constraints no banco (NOT NULL, UNIQUE, FK) equivalentes; erro específico por campo | Must | M | Sprint 4 |
| 17 | [Sistema] Como avaliador do projeto, quero acessar a aplicação publicamente por uma URL, para que eu possa testá-la sem rodar localmente. | Aplicação hospedada em ambiente público e acessível; URL estável durante a avaliação | Must | M | Sprint 4 |
| 18 | [Sistema] Como avaliador do projeto, quero encontrar um README completo no repositório, para que eu consiga rodar o projeto do zero sem depender da equipe. | README documenta stack, pré-requisitos, instalação e execução; um terceiro consegue seguir sem dúvidas adicionais | Must | P | Sprint 4 |

## Atualização de status — Sprint 1 (E5)

| # | História | Status | Observação |
|---|---|---|---|
| 1 | Cadastro e login | ✅ Concluída | Supabase Auth; testado ponta a ponta |
| 2 | Cadastro de projetos | ✅ Concluída | `/projetos` |
| 3 | Cadastro de tarefas | ✅ Concluída | `/projetos/[id]` |
| 4 | Gestão de usuários | ✅ Concluída | `/admin/usuarios` |
| 5 | Permissões por perfil | ✅ Concluída | `/admin/permissoes` |
| 6 | Catálogo de ferramentas de IA | ✅ Concluída | `/admin/ferramentas-ia` |
| 7–10 | Sessão de IA, avaliação, situação de atenção | ⏳ Planejada | Sprint 2 |
