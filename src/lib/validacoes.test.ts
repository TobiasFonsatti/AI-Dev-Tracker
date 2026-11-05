import { describe, expect, it } from "vitest";
import {
  validarNomeProjeto,
  validarTituloTarefa,
  validarCadastro,
  validarDuracaoSessaoMinutos,
  validarEscalaAvaliacao,
  validarSessao,
} from "./validacoes";

// CT03 (docs/plano-de-testes.md) — cadastro de projeto com nome vazio
describe("validarNomeProjeto", () => {
  it("rejeita nome vazio", () => {
    expect(validarNomeProjeto("")).not.toBeNull();
  });

  it("rejeita nome só com espaços", () => {
    expect(validarNomeProjeto("   ")).not.toBeNull();
  });

  it("aceita nome válido", () => {
    expect(validarNomeProjeto("Projeto X")).toBeNull();
  });
});

// CT17 — envio de formulário com campo obrigatório vazio (título da tarefa)
describe("validarTituloTarefa", () => {
  it("rejeita título vazio", () => {
    expect(validarTituloTarefa("")).not.toBeNull();
  });

  it("aceita título válido", () => {
    expect(validarTituloTarefa("Configurar CI")).toBeNull();
  });
});

describe("validarCadastro", () => {
  it("rejeita senha com menos de 6 caracteres", () => {
    expect(validarCadastro("Nome", "a@b.com", "123")).not.toBeNull();
  });

  it("rejeita nome ou e-mail vazio", () => {
    expect(validarCadastro("", "a@b.com", "senha123")).not.toBeNull();
    expect(validarCadastro("Nome", "", "senha123")).not.toBeNull();
  });

  it("aceita dados válidos", () => {
    expect(validarCadastro("Nome", "a@b.com", "senha123")).toBeNull();
  });
});

// CT09 — sessão com duração negativa ou zero
describe("validarDuracaoSessaoMinutos", () => {
  it("rejeita duração zero", () => {
    expect(validarDuracaoSessaoMinutos(0)).not.toBeNull();
  });

  it("rejeita duração negativa", () => {
    expect(validarDuracaoSessaoMinutos(-10)).not.toBeNull();
  });

  it("aceita duração positiva", () => {
    expect(validarDuracaoSessaoMinutos(60)).toBeNull();
  });
});

// CT10 — nota fora da escala de 1 a 5
describe("validarEscalaAvaliacao", () => {
  it("rejeita nota menor que 1", () => {
    expect(validarEscalaAvaliacao(0, "produtividade")).not.toBeNull();
    expect(validarEscalaAvaliacao(-1, "confiança")).not.toBeNull();
  });

  it("rejeita nota maior que 5", () => {
    expect(validarEscalaAvaliacao(6, "dificuldade")).not.toBeNull();
  });

  it("rejeita número decimal", () => {
    expect(validarEscalaAvaliacao(3.5, "fluidez")).not.toBeNull();
  });

  it("aceita notas válidas entre 1 e 5", () => {
    expect(validarEscalaAvaliacao(1, "produtividade")).toBeNull();
    expect(validarEscalaAvaliacao(3, "produtividade")).toBeNull();
    expect(validarEscalaAvaliacao(5, "produtividade")).toBeNull();
  });
});

// CT08 & CT11 — validação de sessão de desenvolvimento e uso de IA
describe("validarSessao", () => {
  it("CT08: rejeita sessão com usouIa = true sem ferramenta informada", () => {
    const erro = validarSessao({
      duracaoMinutos: 60,
      usouIa: true,
      tipoAtividade: "Desenvolvimento de feature",
      idFerramenta: null,
    });
    expect(erro).toContain("Selecione uma ferramenta de IA");
  });

  it("rejeita sessão com tipo de atividade em branco", () => {
    const erro = validarSessao({
      duracaoMinutos: 45,
      usouIa: false,
      tipoAtividade: "   ",
    });
    expect(erro).toContain("tipo de atividade é obrigatório");
  });

  it("aceita sessão sem IA com duração e tipo de atividade válidos", () => {
    const erro = validarSessao({
      duracaoMinutos: 90,
      usouIa: false,
      tipoAtividade: "Refatoração de código",
    });
    expect(erro).toBeNull();
  });

  it("aceita sessão com IA completa e ferramenta vinculada", () => {
    const erro = validarSessao({
      duracaoMinutos: 45,
      usouIa: true,
      tipoAtividade: "Correção de bug",
      idFerramenta: 1,
    });
    expect(erro).toBeNull();
  });
});
