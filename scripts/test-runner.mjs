// Test Runner leve e sem dependências externas para garantir execução confiável
// de todos os casos de teste do plano de testes (CT03, CT08, CT09, CT10, CT11, CT12, CT13, CT17)
import assert from "node:assert";
import {
  validarNomeProjeto,
  validarTituloTarefa,
  validarCadastro,
  validarDuracaoSessaoMinutos,
  validarEscalaAvaliacao,
  validarSessao,
} from "../src/lib/validacoes.ts";
import { calcularSituacaoAtencao } from "../src/lib/situacao-atencao.ts";

const suites = [];
let currentSuite = null;

function describe(name, fn) {
  currentSuite = { name, tests: [] };
  suites.push(currentSuite);
  fn();
}

function it(name, fn) {
  currentSuite.tests.push({ name, fn });
}

const expect = (actual) => ({
  toBeNull: () => assert.strictEqual(actual, null),
  not: {
    toBeNull: () => assert.notStrictEqual(actual, null),
  },
  toBe: (expected) => assert.strictEqual(actual, expected),
  toBeLessThan: (expected) => assert.ok(actual < expected, `${actual} not < ${expected}`),
  toBeGreaterThan: (expected) => assert.ok(actual > expected, `${actual} not > ${expected}`),
  toContain: (expected) => assert.ok(String(actual).includes(expected), `"${actual}" does not contain "${expected}"`),
});

// Suíte 1: Validações básicas (CT03, CT17, cadastro)
describe("Validações de Projeto e Tarefa", () => {
  it("CT03: rejeita nome de projeto vazio", () => {
    expect(validarNomeProjeto("")).not.toBeNull();
  });
  it("rejeita nome de projeto só com espaços", () => {
    expect(validarNomeProjeto("   ")).not.toBeNull();
  });
  it("aceita nome de projeto válido", () => {
    expect(validarNomeProjeto("AI Dev Tracker")).toBeNull();
  });
  it("CT17: rejeita título de tarefa vazio", () => {
    expect(validarTituloTarefa("")).not.toBeNull();
  });
  it("aceita título de tarefa válido", () => {
    expect(validarTituloTarefa("Criar formulário de sessão")).toBeNull();
  });
});

describe("Validação de Cadastro", () => {
  it("rejeita senha com menos de 6 caracteres", () => {
    expect(validarCadastro("Nome", "a@b.com", "123")).not.toBeNull();
  });
  it("rejeita campos vazios", () => {
    expect(validarCadastro("", "a@b.com", "senha123")).not.toBeNull();
    expect(validarCadastro("Nome", "", "senha123")).not.toBeNull();
  });
  it("aceita cadastro com dados válidos", () => {
    expect(validarCadastro("Tobias", "tobias@exemplo.com", "senha123")).toBeNull();
  });
});

// Suíte 2: Sessão e Escalas (CT08, CT09, CT10, CT11)
describe("Validações de Sessão e Avaliação", () => {
  it("CT09: rejeita duração zero", () => {
    expect(validarDuracaoSessaoMinutos(0)).not.toBeNull();
  });
  it("CT09: rejeita duração negativa", () => {
    expect(validarDuracaoSessaoMinutos(-15)).not.toBeNull();
  });
  it("aceita duração positiva", () => {
    expect(validarDuracaoSessaoMinutos(60)).toBeNull();
  });
  it("CT10: rejeita nota menor que 1", () => {
    expect(validarEscalaAvaliacao(0, "produtividade")).not.toBeNull();
  });
  it("CT10: rejeita nota maior que 5", () => {
    expect(validarEscalaAvaliacao(6, "confiança")).not.toBeNull();
  });
  it("rejeita nota não inteira", () => {
    expect(validarEscalaAvaliacao(3.5, "dificuldade")).not.toBeNull();
  });
  it("aceita notas válidas na escala 1 a 5", () => {
    expect(validarEscalaAvaliacao(1, "produtividade")).toBeNull();
    expect(validarEscalaAvaliacao(3, "produtividade")).toBeNull();
    expect(validarEscalaAvaliacao(5, "produtividade")).toBeNull();
  });
  it("CT08: rejeita sessão com usouIa = true sem ferramenta selecionada", () => {
    const erro = validarSessao({
      duracaoMinutos: 60,
      usouIa: true,
      tipoAtividade: "Desenvolvimento",
      idFerramenta: null,
    });
    expect(erro).toContain("Selecione uma ferramenta de IA");
  });
  it("CT11: aceita sessão sem IA com campos válidos", () => {
    const erro = validarSessao({
      duracaoMinutos: 45,
      usouIa: false,
      tipoAtividade: "Testes",
    });
    expect(erro).toBeNull();
  });
  it("CT11: aceita sessão com IA completa e ferramenta vinculada", () => {
    const erro = validarSessao({
      duracaoMinutos: 60,
      usouIa: true,
      tipoAtividade: "Feature",
      idFerramenta: 1,
    });
    expect(erro).toBeNull();
  });
});

// Suíte 3: Situações de Atenção (#10 - CT12, CT13)
describe("Regra de Situação de Atenção (#10)", () => {
  it("não dispara quando há menos de 5 sessões com IA", () => {
    const sessoes = [
      { confianca: 1, dificuldade: 5 },
      { confianca: 1, dificuldade: 5 },
      { confianca: 1, dificuldade: 5 },
    ];
    const res = calcularSituacaoAtencao(sessoes);
    expect(res.disparar).toBe(false);
  });
  it("CT12: dispara quando confiança média nas últimas 5 sessões é menor que 2.5", () => {
    const sessoes = [
      { confianca: 2, dificuldade: 3 },
      { confianca: 2, dificuldade: 3 },
      { confianca: 1, dificuldade: 3 },
      { confianca: 2, dificuldade: 3 },
      { confianca: 2, dificuldade: 3 },
    ];
    const res = calcularSituacaoAtencao(sessoes);
    expect(res.disparar).toBe(true);
    expect(res.mediaConfianca).toBeLessThan(2.5);
    expect(res.motivo).toContain("confiança média baixa");
  });
  it("dispara quando dificuldade média nas últimas 5 sessões é maior que 3.5", () => {
    const sessoes = [
      { confianca: 4, dificuldade: 4 },
      { confianca: 4, dificuldade: 4 },
      { confianca: 4, dificuldade: 4 },
      { confianca: 4, dificuldade: 4 },
      { confianca: 4, dificuldade: 4 },
    ];
    const res = calcularSituacaoAtencao(sessoes);
    expect(res.disparar).toBe(true);
    expect(res.mediaDificuldade).toBeGreaterThan(3.5);
    expect(res.motivo).toContain("dificuldade média alta");
  });
  it("CT13: não dispara quando indicadores estão saudáveis", () => {
    const sessoes = [
      { confianca: 4, dificuldade: 2 },
      { confianca: 5, dificuldade: 2 },
      { confianca: 4, dificuldade: 3 },
      { confianca: 3, dificuldade: 2 },
      { confianca: 4, dificuldade: 2 },
    ];
    const res = calcularSituacaoAtencao(sessoes);
    expect(res.disparar).toBe(false);
  });
});

// Execução dos testes
let totalPass = 0;
let totalFail = 0;

console.log("\n=========================================");
console.log(" EXECUTANDO TESTES UNITÁRIOS DO SISTEMA ");
console.log("=========================================\n");

for (const suite of suites) {
  console.log(`\n• ${suite.name}`);
  for (const test of suite.tests) {
    try {
      test.fn();
      console.log(`  ✓ ${test.name}`);
      totalPass++;
    } catch (err) {
      console.error(`  ✗ ${test.name}`);
      console.error(`    ${err.message}`);
      totalFail++;
    }
  }
}

console.log("\n-----------------------------------------");
console.log(`Total: ${totalPass + totalFail} | Passaram: ${totalPass} | Falharam: ${totalFail}`);
console.log("-----------------------------------------\n");

if (totalFail > 0) {
  process.exit(1);
}
