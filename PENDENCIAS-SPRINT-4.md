# Pendências da branch `feat/sprint-4-e8-e9`

> **Observação:** apague este arquivo quando tudo abaixo estiver concluído, antes do merge do [PR #1](https://github.com/TobiasFonsatti/AI-Dev-Tracker/pull/1). Ele é só um controle de trabalho e não faz parte das entregas.

Prazos: E8 venceu em 30/10/2026 · E9 vence em 06/11/2026 · E10 e Feira em 13/11/2026.

## 1. Banco de dados (bloqueia todo o resto)

O Supabase do `.env` está inacessível: o banco responde "tenant/user not found" e o endereço do projeto não resolve.

- [ ] Conferir no painel do Supabase se o projeto está ativo. Se não existir mais, recriar e atualizar o `.env`.
- [ ] Definir `SEED_DEMO_SENHA` no `.env`.
- [ ] Rodar `npm run db:push`.
- [ ] Rodar `npm run db:constraints`.
- [ ] Rodar `npm run db:seed`.
- [ ] Rodar `npm run db:seed:demo`.

## 2. Deploy no servidor próprio

- [ ] Criar o `.env` no servidor e rodar `docker compose up -d --build`.
- [ ] Apontar o domínio para `127.0.0.1:3000`, com HTTPS.
- [ ] Cadastrar a URL pública como *Site URL* no Supabase (Authentication → URL Configuration).
- [ ] Colocar a URL no `README.md` (seção "Status do Deploy") e em `docs/sprints/sprint-4-relatorio.md`.
- [ ] Atualizar o status da história #17 em `docs/backlog.md`.

## 3. Testes

- [ ] Executar os 16 casos pendentes em `docs/relatorio-testes-final.md` e trocar cada ⏳ pelo resultado real.
- [ ] Atualizar o resumo executivo do relatório com os totais finais.
- [ ] Repetir CT09 e CT24 no Supabase, depois de aplicar as constraints.
- [ ] Marcar CT18 a CT22 em `docs/sprints/sprint-4-evidencias-teste.md`.
- [ ] Seguir o README do zero em uma máquina limpa e atualizar a história #18 em `docs/backlog.md`.
- [ ] Decidir sobre os testes de integração: implementar ou manter como lacuna registrada no relatório.

## 4. Aceitação e documentos

- [ ] Fazer o teste de aceitação com o PO e preencher a seção 4 de `docs/relatorio-testes-final.md`.
- [ ] Preencher ressalvas e parecer e assinar `docs/termo-de-aceite-cliente.md`.
- [ ] Preencher `docs/sprints/sprint-4-retrospectiva.md` em conjunto.
- [ ] Tobias preencher `docs/sprints/sprint-4-contribuicao-tobias.md`.
- [ ] Artur preencher `docs/sprints/sprint-4-contribuicao-artur.md`.
- [ ] Informar a data e os participantes da Sprint Review em `docs/sprints/sprint-4-relatorio.md`.
- [ ] Revisar o texto de `src/app/privacidade/page.tsx`.

## 5. Fechamento do PR

- [ ] Avisar o professor que a E8 foi concluída depois de 30/10.
- [ ] Confirmar que a CI do PR passou.
- [ ] Pedir a revisão do outro integrante, que precisa conseguir explicar as mudanças.
- [ ] **Apagar este arquivo** e fazer o merge.
