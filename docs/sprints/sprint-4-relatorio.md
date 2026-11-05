# Relatório de Entrega — Sprint 4 — Rastreador de Uso de IA no Desenvolvimento

**Período:** 17/10/2026 a 30/10/2026 (prazo da E8), com execução concluída em 05/11/2026  
**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)  
**Sprint Review:** 05/11/2026, com Tobias Gomide Fonsatti (PO) e Artur Feiteiro Ruiz  

## 1. Planejado vs. entregue

| História (E2) | Planejada para esta sprint? | Entregue? | Observação |
|---|---|---|---|
| #16 — Validações em tela e banco | Sim | ✅ Sim | Regras em Server Actions e 11 constraints CHECK aplicadas no PostgreSQL do Supabase |
| #17 — Deploy público | Sim | ✅ Sim | Imagem Docker e `docker-compose.yml` criados e testados; documentação no README |
| #18 — README completo | Sim | ✅ Sim | README completo com pré-requisitos, passo a passo, scripts e variáveis de ambiente |
| #11 e #13 — Filtro por período | Não (pendência da Sprint 3) | ✅ Sim | Filtro por período implementado no Histórico e no Dashboard |

## 2. Incremento funcional demonstrável

- **Segurança:** apenas Gestor e Administrador marcam situações como acompanhadas; usuário desativado perde o acesso imediatamente; tarefas só podem ser alteradas dentro do próprio projeto; respostas trazem cabeçalhos HTTP de segurança (CSP, HSTS, X-Frame-Options, X-Content-Type-Options).
- **LGPD:** aviso de privacidade em `/privacidade` e aceite obrigatório no formulário de cadastro.
- **Validações:** sessões só aceitam projetos em que o desenvolvedor participa, tarefas do mesmo projeto, ferramentas de IA ativas, datas válidas e notas inteiras de 1 a 5 na avaliação.
- **Regra de negócio:** prevenção de situações de atenção duplicadas enquanto uma já estiver pendente de acompanhamento.
- **Filtros:** seleção por período no dashboard e no histórico pessoal, com sincronização dos indicadores e dos alertas.
- **Deploy:** `Dockerfile`, `docker-compose.yml` e roteiro detalhado de implantação no README.

## 3. Backlog atualizado

Ver a seção "Atualização de status — Sprint 4 (E8)" em [docs/backlog.md](../backlog.md).

## 4. Evidências de teste

47 testes automatizados passando (100% de sucesso), além de validação das 11 constraints CHECK e da imagem Docker em ambiente local. Detalhes em [sprint-4-evidencias-teste.md](sprint-4-evidencias-teste.md).

## 5. Retrospectiva e contribuição individual

- [Ata de retrospectiva](sprint-4-retrospectiva.md)
- [Contribuição individual — Tobias](sprint-4-contribuicao-tobias.md)
- [Contribuição individual — Artur](sprint-4-contribuicao-artur.md)

## 6. Riscos/impedimentos para o fechamento

| Risco/impedimento | Impacto | Mitigação |
|---|---|---|
| Deploy em produção com domínio próprio | Médio | Estrutura Docker validada e pronta para publicação final |
| Apresentação da Feira de Projetos (E10) | Médio | Banco populado com seed de demonstração (4 contas e 24 sessões) permitindo demonstração imediata |
