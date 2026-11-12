# Documentação Final — AI-Dev-Tracker

**Deploy definitivo:** [https://aidevtracker.tobiasfonsatti.com.br/](https://aidevtracker.tobiasfonsatti.com.br/)  
**Repositório:** [https://github.com/TobiasFonsatti/AI-Dev-Tracker](https://github.com/TobiasFonsatti/AI-Dev-Tracker)  
**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)  
**Trilha:** A1 (Laboratório de Engenharia de Software · ADS Fatec Ribeirão Preto · 2026/2)

---

## 1. Índice de artefatos do semestre

| Entrega | Descrição | Arquivo / Link |
|---|---|---|
| **E1** | Documento de Visão e Declaração de Escopo | [`docs/documento-de-visao.md`](documento-de-visao.md), [`docs/declaracao-de-escopo.md`](declaracao-de-escopo.md) |
| **E2** | Backlog Priorizado e Termo de Aceite do Projeto | [`docs/backlog.md`](backlog.md), [`docs/termo-de-aceite-projeto.md`](termo-de-aceite-projeto.md) |
| **E3** | Modelagem UML, DER e DDL | [`docs/uml.md`](uml.md), [`docs/der.md`](der.md), [`db/schema.sql`](../db/schema.sql), [`db/constraints.sql`](../db/constraints.sql) |
| **E4** | README, Protótipo e Plano de Testes | [`README.md`](../README.md), [`docs/prototipo.md`](prototipo.md), [`docs/plano-de-testes.md`](plano-de-testes.md) |
| **E5** | Relatório de Entrega — Sprint 1 | [`docs/sprints/sprint-1-relatorio.md`](sprints/sprint-1-relatorio.md) |
| **E6** | Relatório de Entrega — Sprint 2 | [`docs/sprints/sprint-2-relatorio.md`](sprints/sprint-2-relatorio.md) |
| **E7** | Relatório de Entrega — Sprint 3 | [`docs/sprints/sprint-3-relatorio.md`](sprints/sprint-3-relatorio.md) |
| **E8** | Relatório de Entrega — Sprint 4 | [`docs/sprints/sprint-4-relatorio.md`](sprints/sprint-4-relatorio.md) |
| **E9** | Relatório de Testes Executados e Termo de Aceite do Cliente | [`docs/relatorio-testes-final.md`](relatorio-testes-final.md), [`docs/termo-de-aceite-cliente.md`](termo-de-aceite-cliente.md) |
| **E10** | Manual do Usuário, Ficha da Mostra Virtual e Roteiro do Vídeo | [`docs/manual-do-usuario.md`](manual-do-usuario.md), [`docs/mostra-virtual.md`](mostra-virtual.md), [`docs/roteiro-video.md`](roteiro-video.md) |

---

## 2. Desvios do escopo original (vs. E2b)

Comparação entre o escopo contratado no Termo de Aceite do Projeto (E2b) e o software entregue na E10:

| Item original | Mudou? | Justificativa e detalhamento |
|---|---|---|
| **Autenticação e perfis** | Sim (ajuste técnico) | A senha não é mais armazenada como hash na tabela `usuario`. Adotou-se o Supabase Auth com UUID vinculado via `auth_user_id`, aumentando a segurança com autenticação gerenciada, suporte a sessões seguras e redefinição de credenciais. |
| **Chave estrangeira composta da sessão** | Sim (simplificação planejada) | No modelo relacional inicial a FK era `(id_tarefa, id_projeto)`. No Prisma ORM foi simplificada para `id_tarefa -> tarefa.id_tarefa`, com validação na camada de aplicação garantindo que a tarefa pertença ao mesmo projeto da sessão. |
| **Filtro por período no dashboard e histórico** | Sim (adição de valor) | Inicialmente planejado sem restrição temporal; na Sprint 4 foi adicionado filtro por período em ambas as telas com persistência na URL via query params (`?inicio=...&fim=...`). |
| **Acompanhamento de situações de atenção** | Sim (evolução) | Além da visualização, foi adicionada a funcionalidade para gestores e administradores registrarem anotações de acompanhamento e encerrarem a pendência, com proteção impedindo abertura repetida para o mesmo critério ativo. |
| **LGPD e Privacidade** | Sim (requisito não funcional) | Incluída tela informativa de privacidade em `/privacidade` com aceite obrigatório na criação de conta. |

---

## 3. Arquitetura final (resumo)

A arquitetura consolidada segue o padrão monolítico modular moderno com Next.js App Router:

* **Frontend:** Next.js 16 (React 19, Server Components e Server Actions), estilizado com Tailwind CSS v4.
* **Backend:** Next.js Server Actions e Route Handlers integrados no mesmo serviço, rodando em Node.js 22.
* **Autenticação:** Supabase Auth integrado via `@supabase/ssr`, gerenciando cookies HTTPOnly com proteção CSRF e controle de sessão.
* **Banco de dados:** PostgreSQL hospedado no Supabase, acessado pelo Prisma ORM 7 com adapter `@prisma/adapter-pg` e 11 constraints `CHECK` e `UNIQUE` aplicadas diretamente no banco (`db/constraints.sql`).
* **Deploy e Infraestrutura:** Container Docker em modo standalone publicado em servidor próprio, exposto via túnel Cloudflare com terminação TLS/HTTPS em [https://aidevtracker.tobiasfonsatti.com.br/](https://aidevtracker.tobiasfonsatti.com.br/).

---

## 4. Como reproduzir e rodar localmente

As instruções completas de pré-requisitos, variáveis de ambiente, migrações, scripts de seed e execução estão detalhadas no [`README.md`](../README.md).
