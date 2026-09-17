# Termo de Aceite do Projeto — Plataforma de Acompanhamento do Uso de IA no Desenvolvimento

**Equipe:** Artur Feiteiro Ruiz (2840482421032) — Tobias Gomide Fonsatti (2840482421046)
**Trilha:** A1
**Data:** 28/08/2026

## 1. Escopo aceito para o semestre (funcionalidades Must + Should)

- Autenticação e perfis (Desenvolvedor, Gestor/Professor, Administrador) com controle de permissões
- Cadastro de projetos e tarefas, com associação a desenvolvedores
- Gestão de usuários e do catálogo de ferramentas de IA (Administrador)
- Registro de sessão de desenvolvimento (projeto, tarefa, duração, uso de IA, ferramenta, tipo de atividade)
- Avaliação da experiência por sessão (produtividade, dificuldade, confiança, foco, fluidez, feedback)
- Regra de negócio: identificação automática de situações de atenção
- Histórico pessoal de sessões e indicadores para o Desenvolvedor
- Dashboard consolidado para Gestor/Professor, com filtros por projeto, desenvolvedor e período
- Visualização e acompanhamento de situações de atenção da equipe
- Validações consistentes em interface e banco de dados
- Deploy público por URL e repositório Git com README completo

## 2. Critérios de pronto do MVP

- [ ] Um Desenvolvedor consegue se cadastrar, logar e registrar uma sessão completa de uso (ou não uso) de IA
- [ ] Um Gestor/Professor consegue visualizar o dashboard consolidado da equipe e identificar situações de atenção
- [ ] Um Administrador consegue gerenciar usuários, permissões e o catálogo de ferramentas de IA
- [ ] A regra de identificação de situação de atenção funciona de ponta a ponta com dados reais de teste
- [ ] Todas as entidades do modelo de dados (mín. 6, com ao menos um relacionamento N:N) estão implementadas e validadas
- [ ] A aplicação está publicada em uma URL pública e acessível
- [ ] O repositório contém README que permite a um terceiro rodar o projeto do zero

## 3. Stack tecnológica definida

Decidido na E4 (setup do repositório) — ver README.md.

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js (React + TypeScript) |
| Backend | Next.js (API routes) + Prisma ORM |
| Banco de dados | PostgreSQL (hospedado no Supabase — mesmo projeto usado para Auth; não no servidor Oracle Cloud) |
| Autenticação | Supabase Auth (alternativa avaliada: Auth.js/NextAuth) |
| Testes | Vitest (unitários da regra de negócio) |
| CI | GitHub Actions |
| Deploy | Docker no servidor Oracle Cloud, exposto via Cloudflare Tunnel no domínio próprio |

## 4. Papéis iniciais da equipe (Sprint 1)

Papéis rotacionam a cada sprint (§5 do Manual). Independente do papel, ambos os integrantes programam e revisam PRs.

| Integrante | Papel |
|---|---|
| Tobias Gomide Fonsatti (2840482421046) | Product Owner + Responsável por dados |
| Artur Feiteiro Ruiz (2840482421032) | Facilitador + Responsável por qualidade |

## 5. Aprovação

- Professor: _______________________________________          Data: ____ / ____ / ________
