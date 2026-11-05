# Relatório de Entrega — Sprint 4 — Rastreador de Uso de IA no Desenvolvimento

**Período:** 17/10/2026 a 30/10/2026 (prazo da E8), com execução concluída em 05/11/2026, fora do prazo
**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)
**Sprint Review:** [data, com quem]

## 1. Planejado vs. entregue

| História (E2) | Planejada para esta sprint? | Entregue? | Observação |
|---|---|---|---|
| #16 — Validações em tela e banco | Sim | 🟡 Parcial | Regras e script prontos; constraints ainda não aplicadas no Supabase |
| #17 — Deploy público | Sim | 🟡 Parcial | Imagem Docker validada localmente; publicação pendente |
| #18 — README completo | Sim | 🟡 Parcial | Atualizado; falta o teste em máquina limpa |
| #11 e #13 — Filtro por período | Não (pendência da Sprint 3) | ✅ Sim | Critério de aceite que faltava |

## 2. Incremento funcional demonstrável

- **Segurança:** só Gestor e Administrador marcam situações como acompanhadas, usuário desativado perde o acesso, uma tarefa só pode ser alterada dentro do próprio projeto, e as respostas trazem headers de segurança.
- **LGPD:** página `/privacidade` e aceite obrigatório no cadastro.
- **Validações:** sessão só é aceita com projeto do usuário, tarefa do mesmo projeto, ferramenta ativa, data válida e notas inteiras de 1 a 5.
- **Regra de negócio:** uma situação de atenção aberta não gera duplicatas.
- **Filtros:** período no dashboard e no histórico, com o painel de alertas acompanhando os filtros.
- **Deploy:** `Dockerfile`, `docker-compose.yml` e passo a passo no README.

Link do deploy: [preencher após a publicação]

## 3. Backlog atualizado

Ver a seção "Atualização de status — Sprint 4 (E8)" em [docs/backlog.md](../backlog.md).

## 4. Evidências de teste

34 testes automatizados passando, além de validação das constraints e da imagem em ambiente local. Detalhes em [sprint-4-evidencias-teste.md](sprint-4-evidencias-teste.md).

## 5. Retrospectiva e contribuição individual

- [Ata de retrospectiva](sprint-4-retrospectiva.md)
- [Contribuição individual — Tobias](sprint-4-contribuicao-tobias.md)
- [Contribuição individual — Artur](sprint-4-contribuicao-artur.md)

## 6. Riscos/impedimentos para o fechamento

| Risco/impedimento | Impacto | Mitigação |
|---|---|---|
| Banco e Auth do Supabase inacessíveis: "tenant/user not found" e endereço do projeto não resolve | Alto | Conferir no painel do Supabase se o projeto está ativo; se não existir mais, recriar e atualizar o `.env` |
| Deploy ainda não publicado | Alto | Publicar no servidor próprio antes da bateria de aceitação |
| Entrega da E8 fora do prazo | Médio | Alinhar com o professor |
| Sem testes de integração automatizados | Médio | Registrar como lacuna no relatório final ou implementar antes da E10 |
