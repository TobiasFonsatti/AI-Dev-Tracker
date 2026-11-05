# Plano de Execução — Sprint 4 — Rastreador de Uso de IA no Desenvolvimento

**Prazo do cronograma:** 30/10/2026 (E8)
**Execução:** concluída fora do prazo, em 05/11/2026
**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)

## 1. Objetivo da sprint

Cobrir os requisitos não funcionais do Manual (segurança, LGPD e preparação de deploy) e fechar as histórias #16, #17 e #18.

## 2. Histórias selecionadas

| # | História | Prioridade | Estimativa |
|---|---|---|---|
| #16 | Validações em tela e banco | Must | M |
| #17 | Deploy público por URL | Must | M |
| #18 | README completo | Must | P |

Também entraram os ajustes de #11 e #13, porque o filtro por período fazia parte dos critérios de aceite e não havia sido entregue na Sprint 3.

## 3. Tarefas técnicas

| Tarefa | Status |
|---|---|
| Restringir "Marcar Acompanhada" a Gestor e Administrador | Concluído |
| Bloquear login e sessão aberta de usuário desativado | Concluído |
| Validar projeto, tarefa, ferramenta, data e notas da sessão | Concluído |
| Impedir situação de atenção duplicada | Concluído |
| Filtro por período no dashboard e no histórico | Concluído |
| Script de constraints `CHECK` (`db/constraints.sql`) | Concluído e aplicado no Supabase |
| Headers de segurança e aviso de privacidade (LGPD) | Concluído |
| Seed de demonstração | Concluído e executado no Supabase |
| Dockerfile e `docker-compose.yml` | Concluído |
| Publicar no servidor próprio | Pendente |
