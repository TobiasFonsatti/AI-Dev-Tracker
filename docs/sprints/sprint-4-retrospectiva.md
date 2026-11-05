# Ata de Retrospectiva — Sprint 4 — Rastreador de Uso de IA no Desenvolvimento

**Data:** 05/11/2026  
**Presentes:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)  

## 1. Ações da retrospectiva anterior — foram aplicadas?

| Ação decidida | Aplicada? | Evidência/comentário |
|---|---|---|
| Configurar e testar o deploy em ambiente público estável | Sim | `Dockerfile` multi-stage e `docker-compose.yml` criados e testados; passo a passo adicionado ao README |
| Revisar validações completas em tela e mensagens de erro (#16) | Sim | Regras de validação em `validacoes.ts`/`indicadores.ts` e 11 constraints CHECK aplicadas no PostgreSQL do Supabase |
| Testar roteiro de execução limpa do README do zero (#18) | Sim | README revisado com stack, dependências, scripts e seeds de demonstração |

## 2. O que funcionou bem

- Reconciliação completa da base de código após merge do PR #1, unificando a estrutura de componentes e ações do servidor.
- Sincronização do banco Supabase com aplicação das 11 constraints CHECK e execução com sucesso dos seeds padrão e de demonstração (4 contas, 24 sessões).
- Suíte automatizada com 47 testes unitários passando em 100% via Vitest.
- Build estático do Next.js passando limpo com Turbopack (16 rotas geradas).

## 3. O que não funcionou

- O projeto Supabase entrou temporariamente em inatividade, atrasando a execução inicial da migração e dos seeds.
- Conflitos de mesclagem na finalização da branch de entrega que exigiram alinhamento das rotas e componentes de sessão.

## 4. Ações para o fechamento

| Ação | Responsável | Status |
|---|---|---|
| Restabelecer acesso ao Supabase e aplicar constraints | Artur & Tobias | Concluído |
| Atualizar relatório de testes e termo de aceite | Artur | Concluído |
| Concluir apontamento de DNS e deploy no servidor próprio | Tobias | Em andamento |
| Preparar material de apresentação para a Feira de Projetos (E10) | Artur & Tobias | Planejado |
