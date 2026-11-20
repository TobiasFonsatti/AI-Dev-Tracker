# Roteiro do Vídeo — AI-Dev-Tracker (Mostra Virtual)

**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)  
**Link do vídeo (não listado):** [https://youtu.be/zSEzHEvfKnw](https://youtu.be/zSEzHEvfKnw)  
**Duração planejada:** ~10:00 (mínimo 8:00, máximo 12:00)  
**Deploy utilizado na gravação:** [https://aidevtracker.tobiasfonsatti.com.br/](https://aidevtracker.tobiasfonsatti.com.br/)

---

## 1. Planejamento dos blocos

| Bloco | Tempo | Quem fala | O que aparece na tela |
|---|---|---|---|
| **1 · Abertura** | 0:00–0:30 (~0:30) | Tobias | Tela de título com o nome do projeto (AI-Dev-Tracker), nomes dos integrantes e apresentação breve da equipe e da trilha A1. |
| **2 · Problema e Cliente** | 0:30–1:30 (~1:00) | Artur | Apresentação da dor de pesquisa (TCC): o fenômeno do *Vibe Coding*, ganho de produtividade versus perda de controle técnico e confiança cega. Apresentação da proposta da plataforma. |
| **3 · Demonstração no Deploy Público** | 1:30–5:15 (~3:45) | Tobias narra, Artur navega | Fluxo real no deploy público (`https://aidevtracker.tobiasfonsatti.com.br/` visível na barra de endereços). Registro de sessão como Desenvolvedor, validações de erro, avaliação de IA, detecção de situação de atenção e visualização como Gestor no Dashboard. |
| **4 · Engenharia e Rastreabilidade** | 5:15–7:00 (~1:45) | Artur | Rastreabilidade vertical de ponta a ponta: História no Backlog (#10 / #16) ➔ Modelo no DER (`situacao_atencao`, constraints `ck_sessao_duracao`) ➔ Código no Pull Request (revisão de código de Tobias/Artur) ➔ Teste automatizado (`indicadores.test.ts` e Vitest passando na CI do GitHub Actions). Decisão técnica justificada: uso de constraints nativas no Postgres em conjunto com Server Actions. |
| **5 · Processo Ágil** | 7:00–9:10 (~2:10) | Tobias e Artur | Gestão das 4 sprints: GitHub Projects (Board Kanban), tabela de Planejado × Entregue, Pull Requests revisados por pares e Ata de Retrospectiva da Sprint com plano de ação efetivamente aplicado na sprint seguinte. |
| **6 · Depoimentos Individuais** | 9:10–10:10 (~1:00) | Tobias (30s) e Artur (30s) | Câmera aberta de cada integrante com nome na tela. Cada um reflete sobre um aprendizado concreto de engenharia de software no semestre (ex: importância dos critérios de aceite para a escrita de testes, mitigação de dívida técnica, trabalho com revisões de código). |
| **Fechamento** | 10:10–10:30 (~0:20) | Tobias | Tela final com URL do deploy em produção, link do repositório no GitHub, tecnologias utilizadas e agradecimentos. |

---

## 2. Como os requisitos mínimos aparecem no Bloco 3 (Demonstração)

| Requisito mínimo (§3 do Manual) | Momento do vídeo | O que é demonstrado na prática |
|---|---|---|
| **Autenticação com 2+ perfis** | 1:40 | Login como Desenvolvedor (`dev@teste.com`), mostrando restrição de acesso a `/dashboard`. Depois, login como Gestor (`gestor@teste.com`) com acesso liberado. |
| **Regra de negócio não trivial** | 2:40 | Geração automática de *Situação de Atenção* quando o desenvolvedor acumula confiança baixa recorrente (< 2.5) nas sessões com IA. Demonstração de que situação duplicada não é aberta se já existir uma pendente. |
| **Consulta agregada (Dashboard)** | 3:30 | Gestor visualiza totais de horas, sessões com/sem IA, distribuição de ferramentas e média de confiança no `/dashboard`. Filtro por período recalculando os dados em tempo real. |
| **Validações de formulário e dados** | 2:10 | Tentativa de submissão de sessão com data futura ou campos obrigatórios faltantes; mensagem de erro clara exibida para o usuário. |
| **6+ entidades e ao menos uma N:N** | 4:30 e Bloco 4 | Apresentação do modelo de dados (`usuario`, `perfil`, `projeto`, `tarefa`, `sessao_desenvolvimento`, `avaliacao_sessao`, `ferramenta_ia`, `situacao_atencao`), com N:N em `usuario_projeto` e `perfil_permissao`. |
| **Deploy público com HTTPS** | O vídeo todo | Barra de endereço do navegador sempre visível exibindo `https://aidevtracker.tobiasfonsatti.com.br/`. |
| **Repositório com README** | 10:15 | Apresentação rápida do repositório aberto com README e documentação completa. |

---

## 3. Dicas de gravação para a equipe

* **Gravar em blocos:** Grave bloco por bloco (ex: gravação de tela pelo OBS Studio, câmera pelo Teams/Google Meet/celular).
* **Áudio:** Use microfone de headset ou fone de ouvido em local silencioso.
* **Navegador:** Zoom em 125%, abas pessoais fechadas, URL do deploy visível.
* **Dados plausíveis:** O banco já possui o seed com 4 usuários e 24 sessões de teste para evitar telas vazias.

