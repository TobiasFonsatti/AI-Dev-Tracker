# Manual do Usuário — AI-Dev-Tracker

**Produto:** Plataforma de Acompanhamento do Uso de IA no Desenvolvimento  
**URL de Acesso:** [https://aidevtracker.tobiasfonsatti.com.br/](https://aidevtracker.tobiasfonsatti.com.br/)  
**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)  

---

## 1. Primeiros Passos

### Como acessar o sistema
1. Abra o navegador e acesse [https://aidevtracker.tobiasfonsatti.com.br/](https://aidevtracker.tobiasfonsatti.com.br/).
2. Na tela de login, informe seu e-mail e senha cadastrados.
3. Se for seu primeiro acesso, clique em **Criar conta**, preencha seu nome, e-mail, senha e confirme a leitura do Aviso de Privacidade.

---

## 2. Para Desenvolvedores

O perfil de Desenvolvedor tem foco em registrar o tempo de trabalho em suas tarefas, documentar quando e como ferramentas de IA foram utilizadas e acompanhar seu histórico pessoal.

### Como registrar uma sessão de desenvolvimento
1. No menu superior, clique em **Nova Sessão** (ou acesse `/sessoes/nova`).
2. Selecione o **Projeto** em que trabalhou.
3. Escolha a **Tarefa** vinculada ao projeto selecionado.
4. Informe o horário de **Início** e de **Fim** da atividade (ou a duração em minutos).
5. Se utilizou alguma inteligência artificial durante a tarefa, marque a opção **"Utilizei ferramenta de IA nesta sessão"**:
   * Selecione a **Ferramenta de IA** utilizada (ex: Claude Code, GitHub Copilot, ChatGPT).
   * Descreva resumidamente a **Atividade com IA** (ex: *geração de testes unitários*, *refatoração de função*, *pesquisa de arquitetura*).
   * Marque as dimensões de percepção: notas de 1 a 5 para **Produtividade**, **Dificuldade**, **Confiança no código gerado**, **Foco** e **Fluidez**.
6. Se não utilizou IA, apenas avalie a produtividade e a dificuldade geral da tarefa.
7. Clique em **Salvar Sessão**.

### Como consultar seu histórico pessoal
1. No menu superior, clique em **Histórico** (`/historico`).
2. Você verá o resumo consolidado das suas sessões: total de horas trabalhadas, percentual de uso de IA e média de produtividade.
3. Utilize os filtros de **Projeto** e **Período** para consultar trabalhos de semanas ou meses anteriores.

---

## 3. Para Gestores e Professores

O perfil de Gestor permite acompanhar o progresso das equipes, identificar padrões de adoção de inteligência artificial e prestar suporte aos desenvolvedores.

### Como visualizar o Dashboard da equipe
1. Faça login com suas credenciais de gestor e clique em **Dashboard** (`/dashboard`).
2. No topo da página, consulte os indicadores gerais:
   * **Taxa de adoção de IA:** proporção de sessões que contaram com assistência de ferramentas de inteligência artificial.
   * **Horas totais trabalhadas** e **Média de confiança** relatada pelo time.
   * **Distribuição de ferramentas:** gráfico com as IAs mais utilizadas (ex: Copilot, Cursor, ChatGPT).
3. Utilize os seletores de filtro no topo para restringir a análise por **Projeto**, por **Desenvolvedor específico** ou por **Intervalo de datas**.

### Como acompanhar Situações de Atenção
O sistema analisa automaticamente as últimas sessões de cada desenvolvedor. Quando alguém registra repetidamente confiança baixa nas respostas da IA ou alta dificuldade associada ao uso da ferramenta, um alerta preventivo é gerado.

1. No `/dashboard`, role até a seção **Situações de Atenção Pendentes**.
2. Identifique o desenvolvedor, a data de início do alerta e o motivo diagnosticado.
3. Após conversar com o desenvolvedor ou prestar mentoria sobre o uso da ferramenta:
   * Clique em **Acompanhar**.
   * Insira uma observação com a ação tomada (ex: *alinhamento sobre engenharia de prompts* ou *revisão do código em pares*).
   * Confirme para arquivar o alerta como acompanhado.

---

## 4. Para Administradores

O perfil Administrador gerencia as configurações mestras do sistema.

### Como gerenciar usuários e permissões
1. Acesse o menu **Administração** ➔ **Usuários** (`/admin/usuarios`).
2. Visualize a lista de usuários cadastrados e seus respectivos perfis (`Desenvolvedor`, `Gestor` ou `Administrador`).
3. Para alterar o papel de um membro, selecione o novo perfil desejado e confirme.
4. Para bloquear temporariamente o acesso de um usuário desligado, altere o status para `Inativo` ou `Bloqueado`.

### Como gerenciar o catálogo de ferramentas de IA
1. Acesse **Administração** ➔ **Ferramentas de IA** (`/admin/ferramentas-ia`).
2. Visualize as ferramentas disponíveis na empresa.
3. Para cadastrar uma nova ferramenta, informe o nome, desenvolvedor responsável (empresa criadora) e descrição.
4. Para impedir que ferramentas descontinuadas continuem sendo selecionadas pelos desenvolvedores em novas sessões, desative a chave de status da ferramenta.

---

## 5. Perguntas Frequentes (FAQ) e Solução de Problemas

**1. Tentei entrar no sistema mas a tela recarregou ou informou credenciais inválidas.**  
*Verifique se o e-mail e a senha digitados estão corretos. Por motivos de segurança, o sistema não informa se o e-mail existe ou se apenas a senha está incorreta.*

**2. Sou desenvolvedor e não consigo acessar o Dashboard.**  
*O painel `/dashboard` reúne métricas consolidadas de toda a organização e é restrito a Gestores e Administradores. Desenvolvedores têm acesso ao seu próprio histórico individual em `/historico`.*

**3. Não consigo selecionar uma tarefa ao registrar a sessão.**  
*A listagem de tarefas é dinâmica e depende do projeto selecionado. Certifique-se de selecionar primeiro o projeto correto no qual a tarefa foi criada.*

**4. Posso registrar uma sessão com data futura?**  
*Não. O sistema rejeita o registro de sessões com horários futuros ou com horário de término anterior ao horário de início.*

**5. Uma situação de atenção sumiu do painel de pendências.**  
*Situações marcadas como acompanhadas pelo Gestor saem da lista de pendências e ficam registradas no histórico de acompanhamento com as observações registradas.*

