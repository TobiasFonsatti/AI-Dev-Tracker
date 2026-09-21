import { describe, expect, it } from "vitest";
import {
  validarNomeProjeto,
  validarTituloTarefa,
  validarCadastro,
  validarDuracaoSessaoMinutos,
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

// CT09 — sessão com duração negativa ou zero (validação pronta;
// tela de registro de sessão ainda não existe — feature da Sprint 2, história #7)
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
