-- schema.sql — Rastreador de Uso de IA no Desenvolvimento
-- Artur Feiteiro Ruiz (2840482421032) — Tobias Gomide Fonsatti (2840482421046)
--
-- NOTA: convertido de MySQL para PostgreSQL (stack definida no Termo de Aceite —
-- ver docs/termo-de-aceite-projeto.md). Principais trocas em relação ao rascunho
-- original: AUTO_INCREMENT -> SERIAL, ENGINE=InnoDB removido (não existe em
-- Postgres), TINYINT -> SMALLINT, DATETIME -> TIMESTAMP. Estrutura, nomes de
-- tabela/coluna e constraints seguem exatamente o DER (docs/der.md).

CREATE TABLE perfil (
    id_perfil SERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    descricao VARCHAR(255) NULL,
    CONSTRAINT uq_perfil_nome UNIQUE (nome)
);

CREATE TABLE permissao (
    id_permissao SERIAL PRIMARY KEY,
    codigo VARCHAR(60) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    CONSTRAINT uq_permissao_codigo UNIQUE (codigo)
);

CREATE TABLE perfil_permissao (
    id_perfil INT NOT NULL,
    id_permissao INT NOT NULL,
    CONSTRAINT pk_perfil_permissao PRIMARY KEY (id_perfil, id_permissao),
    CONSTRAINT fk_perfil_permissao_perfil
        FOREIGN KEY (id_perfil) REFERENCES perfil (id_perfil),
    CONSTRAINT fk_perfil_permissao_permissao
        FOREIGN KEY (id_permissao) REFERENCES permissao (id_permissao)
);

CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    id_perfil INT NOT NULL,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuario_email UNIQUE (email),
    CONSTRAINT ck_usuario_status CHECK (status IN ('ATIVO', 'INATIVO', 'BLOQUEADO')),
    CONSTRAINT fk_usuario_perfil
        FOREIGN KEY (id_perfil) REFERENCES perfil (id_perfil)
);

CREATE TABLE projeto (
    id_projeto SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    data_criacao DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    CONSTRAINT ck_projeto_status CHECK (status IN ('ATIVO', 'CONCLUIDO', 'ARQUIVADO')),
    CONSTRAINT uq_projeto_id_nome UNIQUE (id_projeto, nome)
);

CREATE TABLE usuario_projeto (
    id_usuario INT NOT NULL,
    id_projeto INT NOT NULL,
    papel_no_projeto VARCHAR(30) NOT NULL,
    data_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_usuario_projeto PRIMARY KEY (id_usuario, id_projeto),
    CONSTRAINT fk_usuario_projeto_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    CONSTRAINT fk_usuario_projeto_projeto
        FOREIGN KEY (id_projeto) REFERENCES projeto (id_projeto)
);

CREATE TABLE tarefa (
    id_tarefa SERIAL PRIMARY KEY,
    id_projeto INT NOT NULL,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
    prioridade VARCHAR(20) NOT NULL DEFAULT 'MEDIA',
    prazo DATE NULL,
    CONSTRAINT ck_tarefa_status CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')),
    CONSTRAINT ck_tarefa_prioridade CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA')),
    CONSTRAINT uq_tarefa_id_projeto UNIQUE (id_tarefa, id_projeto),
    CONSTRAINT fk_tarefa_projeto
        FOREIGN KEY (id_projeto) REFERENCES projeto (id_projeto)
);

CREATE TABLE usuario_tarefa (
    id_usuario INT NOT NULL,
    id_tarefa INT NOT NULL,
    papel VARCHAR(30) NOT NULL,
    CONSTRAINT pk_usuario_tarefa PRIMARY KEY (id_usuario, id_tarefa),
    CONSTRAINT fk_usuario_tarefa_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    CONSTRAINT fk_usuario_tarefa_tarefa
        FOREIGN KEY (id_tarefa) REFERENCES tarefa (id_tarefa)
);

CREATE TABLE ferramenta_ia (
    id_ferramenta SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    fornecedor VARCHAR(100) NULL,
    versao VARCHAR(40) NULL,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_ferramenta_ia_nome UNIQUE (nome)
);

CREATE TABLE sessao_desenvolvimento (
    id_sessao SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_projeto INT NOT NULL,
    id_tarefa INT NULL,
    data_sessao DATE NOT NULL,
    duracao_minutos INT NOT NULL,
    usou_ia BOOLEAN NOT NULL DEFAULT FALSE,
    tipo_atividade VARCHAR(60) NOT NULL,
    observacoes TEXT NULL,
    CONSTRAINT ck_sessao_duracao CHECK (duracao_minutos > 0),
    CONSTRAINT fk_sessao_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    CONSTRAINT fk_sessao_projeto
        FOREIGN KEY (id_projeto) REFERENCES projeto (id_projeto),
    CONSTRAINT fk_sessao_tarefa_do_projeto
        FOREIGN KEY (id_tarefa, id_projeto)
        REFERENCES tarefa (id_tarefa, id_projeto)
);

CREATE TABLE sessao_ferramenta (
    id_sessao INT NOT NULL,
    id_ferramenta INT NOT NULL,
    CONSTRAINT pk_sessao_ferramenta PRIMARY KEY (id_sessao, id_ferramenta),
    CONSTRAINT fk_sessao_ferramenta_sessao
        FOREIGN KEY (id_sessao) REFERENCES sessao_desenvolvimento (id_sessao),
    CONSTRAINT fk_sessao_ferramenta_ferramenta
        FOREIGN KEY (id_ferramenta) REFERENCES ferramenta_ia (id_ferramenta)
);

CREATE TABLE avaliacao_sessao (
    id_avaliacao SERIAL PRIMARY KEY,
    id_sessao INT NOT NULL,
    produtividade SMALLINT NOT NULL,
    dificuldade SMALLINT NOT NULL,
    confianca SMALLINT NOT NULL,
    foco SMALLINT NOT NULL,
    fluidez SMALLINT NOT NULL,
    qualidade_feedback SMALLINT NOT NULL,
    observacoes TEXT NULL,
    CONSTRAINT uq_avaliacao_sessao UNIQUE (id_sessao),
    CONSTRAINT ck_avaliacao_produtividade CHECK (produtividade BETWEEN 1 AND 5),
    CONSTRAINT ck_avaliacao_dificuldade CHECK (dificuldade BETWEEN 1 AND 5),
    CONSTRAINT ck_avaliacao_confianca CHECK (confianca BETWEEN 1 AND 5),
    CONSTRAINT ck_avaliacao_foco CHECK (foco BETWEEN 1 AND 5),
    CONSTRAINT ck_avaliacao_fluidez CHECK (fluidez BETWEEN 1 AND 5),
    CONSTRAINT ck_avaliacao_qualidade_feedback CHECK (qualidade_feedback BETWEEN 1 AND 5),
    CONSTRAINT fk_avaliacao_sessao
        FOREIGN KEY (id_sessao) REFERENCES sessao_desenvolvimento (id_sessao)
);

CREATE TABLE situacao_atencao (
    id_situacao SERIAL PRIMARY KEY,
    id_sessao INT NOT NULL,
    id_usuario INT NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    data_identificacao DATE NOT NULL,
    acompanhada BOOLEAN NOT NULL DEFAULT FALSE,
    observacoes TEXT NULL,
    CONSTRAINT fk_situacao_sessao
        FOREIGN KEY (id_sessao) REFERENCES sessao_desenvolvimento (id_sessao),
    CONSTRAINT fk_situacao_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

-- Seed mínimo de referência

INSERT INTO perfil (nome, descricao) VALUES
    ('ADMINISTRADOR', 'Gerencia usuários, permissões e ferramentas de IA'),
    ('GESTOR', 'Acompanha indicadores, equipes e situações de atenção'),
    ('DESENVOLVEDOR', 'Registra projetos, tarefas, sessões e avaliações');

INSERT INTO permissao (codigo, descricao) VALUES
    ('USUARIO_GERENCIAR', 'Gerenciar usuários'),
    ('DASHBOARD_CONSULTAR', 'Consultar dashboard da equipe'),
    ('SESSAO_REGISTRAR', 'Registrar sessão de desenvolvimento');

INSERT INTO perfil_permissao (id_perfil, id_permissao)
SELECT p.id_perfil, pe.id_permissao
FROM perfil p
CROSS JOIN permissao pe
WHERE (p.nome = 'ADMINISTRADOR')
   OR (p.nome = 'GESTOR' AND pe.codigo = 'DASHBOARD_CONSULTAR')
   OR (p.nome = 'DESENVOLVEDOR' AND pe.codigo = 'SESSAO_REGISTRAR');

INSERT INTO usuario (id_perfil, nome, email, senha_hash, status)
SELECT id_perfil, 'Usuário Exemplo', 'usuario.exemplo@exemplo.com',
       '$2b$12$hash_de_exemplo_nao_utilizar_em_producao', 'ATIVO'
FROM perfil
WHERE nome = 'DESENVOLVEDOR';

INSERT INTO projeto (nome, descricao, data_criacao, status)
VALUES ('Projeto Exemplo', 'Projeto inicial para validação do rastreador.', CURRENT_DATE, 'ATIVO');

INSERT INTO usuario_projeto (id_usuario, id_projeto, papel_no_projeto)
SELECT u.id_usuario, p.id_projeto, 'MEMBRO'
FROM usuario u
CROSS JOIN projeto p
WHERE u.email = 'usuario.exemplo@exemplo.com'
  AND p.nome = 'Projeto Exemplo';

INSERT INTO tarefa (id_projeto, titulo, descricao, status, prioridade)
SELECT id_projeto, 'Tarefa exemplo', 'Tarefa inicial do projeto.', 'PENDENTE', 'MEDIA'
FROM projeto
WHERE nome = 'Projeto Exemplo';

INSERT INTO usuario_tarefa (id_usuario, id_tarefa, papel)
SELECT u.id_usuario, t.id_tarefa, 'RESPONSAVEL'
FROM usuario u
CROSS JOIN tarefa t
WHERE u.email = 'usuario.exemplo@exemplo.com'
  AND t.titulo = 'Tarefa exemplo';

INSERT INTO ferramenta_ia (nome, fornecedor, versao, ativa)
VALUES ('Ferramenta IA Exemplo', 'Fornecedor Exemplo', '1.0', TRUE);

INSERT INTO sessao_desenvolvimento
    (id_usuario, id_projeto, id_tarefa, data_sessao, duracao_minutos,
     usou_ia, tipo_atividade, observacoes)
SELECT u.id_usuario, p.id_projeto, t.id_tarefa, CURRENT_DATE, 60,
       TRUE, 'DESENVOLVIMENTO', 'Sessão inicial de exemplo.'
FROM usuario u
CROSS JOIN projeto p
CROSS JOIN tarefa t
WHERE u.email = 'usuario.exemplo@exemplo.com'
  AND p.nome = 'Projeto Exemplo'
  AND t.titulo = 'Tarefa exemplo';

INSERT INTO sessao_ferramenta (id_sessao, id_ferramenta)
SELECT s.id_sessao, f.id_ferramenta
FROM sessao_desenvolvimento s
CROSS JOIN ferramenta_ia f
WHERE s.observacoes = 'Sessão inicial de exemplo.'
  AND f.nome = 'Ferramenta IA Exemplo';

INSERT INTO avaliacao_sessao
    (id_sessao, produtividade, dificuldade, confianca, foco,
     fluidez, qualidade_feedback, observacoes)
SELECT id_sessao, 4, 3, 4, 4, 4, 4, 'Avaliação inicial de exemplo.'
FROM sessao_desenvolvimento
WHERE observacoes = 'Sessão inicial de exemplo.';

INSERT INTO situacao_atencao
    (id_sessao, id_usuario, motivo, data_identificacao, acompanhada, observacoes)
SELECT id_sessao, id_usuario, 'Registro de exemplo para acompanhamento',
       CURRENT_DATE, FALSE, 'Situação criada para validar o esquema.'
FROM sessao_desenvolvimento
WHERE observacoes = 'Sessão inicial de exemplo.';
