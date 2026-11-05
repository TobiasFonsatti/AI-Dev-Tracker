-- constraints.sql — AI-Dev-Tracker
-- Equipe: Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)
--
-- O banco é criado com `prisma db push`, e o Prisma não gera constraints CHECK.
-- Este script aplica no banco real os mesmos CHECKs de db/schema.sql.
-- Pode rodar mais de uma vez: cada constraint é removida e recriada.
-- Execução: npm run db:constraints

BEGIN;

ALTER TABLE usuario DROP CONSTRAINT IF EXISTS ck_usuario_status;
ALTER TABLE usuario ADD CONSTRAINT ck_usuario_status
  CHECK (status IN ('ATIVO', 'INATIVO', 'BLOQUEADO'));

ALTER TABLE projeto DROP CONSTRAINT IF EXISTS ck_projeto_status;
ALTER TABLE projeto ADD CONSTRAINT ck_projeto_status
  CHECK (status IN ('ATIVO', 'CONCLUIDO', 'ARQUIVADO'));

ALTER TABLE tarefa DROP CONSTRAINT IF EXISTS ck_tarefa_status;
ALTER TABLE tarefa ADD CONSTRAINT ck_tarefa_status
  CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA'));

ALTER TABLE tarefa DROP CONSTRAINT IF EXISTS ck_tarefa_prioridade;
ALTER TABLE tarefa ADD CONSTRAINT ck_tarefa_prioridade
  CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA'));

ALTER TABLE sessao_desenvolvimento DROP CONSTRAINT IF EXISTS ck_sessao_duracao;
ALTER TABLE sessao_desenvolvimento ADD CONSTRAINT ck_sessao_duracao
  CHECK (duracao_minutos > 0);

ALTER TABLE avaliacao_sessao DROP CONSTRAINT IF EXISTS ck_avaliacao_produtividade;
ALTER TABLE avaliacao_sessao ADD CONSTRAINT ck_avaliacao_produtividade
  CHECK (produtividade BETWEEN 1 AND 5);

ALTER TABLE avaliacao_sessao DROP CONSTRAINT IF EXISTS ck_avaliacao_dificuldade;
ALTER TABLE avaliacao_sessao ADD CONSTRAINT ck_avaliacao_dificuldade
  CHECK (dificuldade BETWEEN 1 AND 5);

ALTER TABLE avaliacao_sessao DROP CONSTRAINT IF EXISTS ck_avaliacao_confianca;
ALTER TABLE avaliacao_sessao ADD CONSTRAINT ck_avaliacao_confianca
  CHECK (confianca BETWEEN 1 AND 5);

ALTER TABLE avaliacao_sessao DROP CONSTRAINT IF EXISTS ck_avaliacao_foco;
ALTER TABLE avaliacao_sessao ADD CONSTRAINT ck_avaliacao_foco
  CHECK (foco BETWEEN 1 AND 5);

ALTER TABLE avaliacao_sessao DROP CONSTRAINT IF EXISTS ck_avaliacao_fluidez;
ALTER TABLE avaliacao_sessao ADD CONSTRAINT ck_avaliacao_fluidez
  CHECK (fluidez BETWEEN 1 AND 5);

ALTER TABLE avaliacao_sessao DROP CONSTRAINT IF EXISTS ck_avaliacao_qualidade_feedback;
ALTER TABLE avaliacao_sessao ADD CONSTRAINT ck_avaliacao_qualidade_feedback
  CHECK (qualidade_feedback BETWEEN 1 AND 5);

COMMIT;
